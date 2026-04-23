package com.yc.interior.service.impl;

import com.yc.interior.dto.request.GalleryRequest;
import com.yc.interior.dto.response.GalleryResponse;
import com.yc.interior.entity.Gallery;
import com.yc.interior.exception.BusinessException;
import com.yc.interior.exception.ResourceNotFoundException;
import com.yc.interior.repository.GalleryRepository;
import com.yc.interior.repository.MediaRepository;
import com.yc.interior.service.GalleryService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GalleryServiceImpl implements GalleryService {

    private static final int MAX_FEATURED = 7;

    private final GalleryRepository galleryRepository;
    private final MediaRepository mediaRepository;
    private final MediaServiceImpl mediaService;

    @Override
    public Page<GalleryResponse> getAll(String keyword, Boolean featured, Pageable pageable) {
        return galleryRepository.findAllWithFilters(keyword, featured, pageable).map(this::toResponse);
    }

    @Override
    public GalleryResponse getById(Long id) {
        return toResponse(galleryRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Gallery", id)));
    }

    @Override
    public GalleryResponse create(GalleryRequest request) {
        // Auto-assign display order (0-6 for gallery, max 7 featured)
        Integer displayOrder = request.getDisplayOrder();
        long currentCount = galleryRepository.count();
        
        if (displayOrder == null) {
            // Auto-increment: find max and add 1
            displayOrder = (int) Math.min(currentCount, 6); // Max order is 6 (0-6 = 7 items)
        } else if (displayOrder >= 0 && displayOrder <= 6) {
            // If order is in featured range, shift existing items
            shiftDisplayOrdersForInsertion(displayOrder);
        } else {
            // Order is beyond featured range, just use it
            displayOrder = (int) Math.max(displayOrder, 7);
        }
        
        Gallery entity = Gallery.builder()
                .title(request.getTitle()).mediaId(request.getMediaId())
                .isFeatured(request.getIsFeatured() != null ? request.getIsFeatured() : false)
                .displayOrder(displayOrder)
                .build();
        return toResponse(galleryRepository.save(entity));
    }
    
    private void shiftDisplayOrdersForInsertion(Integer insertOrder) {
        // Get all gallery items with order >= insertOrder and increment their order
        galleryRepository.findAll().stream()
                .filter(g -> g.getDisplayOrder() != null && g.getDisplayOrder() >= insertOrder)
                .forEach(g -> {
                    g.setDisplayOrder(g.getDisplayOrder() + 1);
                    galleryRepository.save(g);
                });
    }

    @Override
    public GalleryResponse update(Long id, GalleryRequest request) {
        Gallery entity = galleryRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Gallery", id));
        entity.setTitle(request.getTitle());
        entity.setMediaId(request.getMediaId());
        if (request.getIsFeatured() != null) entity.setIsFeatured(request.getIsFeatured());
        
        // Handle display order changes with shifting
        if (request.getDisplayOrder() != null) {
            Integer oldOrder = entity.getDisplayOrder();
            Integer newOrder = request.getDisplayOrder();
            
            if (oldOrder != null && !oldOrder.equals(newOrder)) {
                if (newOrder < oldOrder) {
                    // Shift items between newOrder and oldOrder up by 1
                    galleryRepository.findAll().stream()
                            .filter(g -> g.getDisplayOrder() != null && g.getDisplayOrder() >= newOrder && g.getDisplayOrder() < oldOrder && !g.getId().equals(id))
                            .forEach(g -> {
                                g.setDisplayOrder(g.getDisplayOrder() + 1);
                                galleryRepository.save(g);
                            });
                } else if (newOrder > oldOrder) {
                    // Shift items between oldOrder and newOrder down by 1
                    galleryRepository.findAll().stream()
                            .filter(g -> g.getDisplayOrder() != null && g.getDisplayOrder() > oldOrder && g.getDisplayOrder() <= newOrder && !g.getId().equals(id))
                            .forEach(g -> {
                                g.setDisplayOrder(g.getDisplayOrder() - 1);
                                galleryRepository.save(g);
                            });
                }
            }
            entity.setDisplayOrder(newOrder);
        }
        
        return toResponse(galleryRepository.save(entity));
    }

    @Override
    public void delete(Long id) {
        if (!galleryRepository.existsById(id)) throw new ResourceNotFoundException("Gallery", id);
        
        Gallery entity = galleryRepository.findById(id).orElseThrow();
        Integer deletedOrder = entity.getDisplayOrder();
        
        // Delete associated media
        if (entity.getMediaId() != null) {
            try {
                mediaService.delete(entity.getMediaId());
            } catch (Exception e) {
                System.err.println("Failed to delete media: " + e.getMessage());
            }
        }
        
        // Hard delete the gallery item
        galleryRepository.deleteById(id);
        
        // Reorder remaining gallery items
        if (deletedOrder != null) {
            reorderAfterDeletion(deletedOrder);
        }
    }
    
    private void reorderAfterDeletion(Integer deletedOrder) {
        // Get all gallery items with order > deletedOrder and decrement their order
        galleryRepository.findAll().stream()
                .filter(g -> g.getDisplayOrder() != null && g.getDisplayOrder() > deletedOrder)
                .forEach(g -> {
                    g.setDisplayOrder(g.getDisplayOrder() - 1);
                    galleryRepository.save(g);
                });
    }

    @Override
    public GalleryResponse setFeatured(Long id, Boolean featured, Integer displayOrder) {
        Gallery entity = galleryRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Gallery", id));
        
        if (Boolean.TRUE.equals(featured)) {
            long currentFeatured = galleryRepository.countByIsFeaturedTrue();
            // If trying to feature and already at max, and this item is not already featured
            if (currentFeatured >= MAX_FEATURED && !Boolean.TRUE.equals(entity.getIsFeatured())) {
                throw new BusinessException("Maximum featured gallery items reached (" + MAX_FEATURED + "). Unfeature another image first.");
            }
        }
        
        entity.setIsFeatured(featured);
        if (displayOrder != null) entity.setDisplayOrder(displayOrder);
        return toResponse(galleryRepository.save(entity));
    }

    private GalleryResponse toResponse(Gallery e) {
        var res = GalleryResponse.builder()
                .id(e.getId()).title(e.getTitle()).mediaId(e.getMediaId())
                .isFeatured(e.getIsFeatured()).displayOrder(e.getDisplayOrder())
                .createdAt(e.getCreatedAt()).updatedAt(e.getUpdatedAt());
        if (e.getMediaId() != null)
            mediaRepository.findByIdAndDeletedAtIsNull(e.getMediaId()).ifPresent(m -> res.media(mediaService.toResponse(m)));
        return res.build();
    }
}
