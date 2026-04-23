package com.yc.interior.service.impl;

import com.yc.interior.dto.request.AboutSectionRequest;
import com.yc.interior.dto.response.AboutSectionResponse;
import com.yc.interior.entity.AboutSection;
import com.yc.interior.exception.ResourceNotFoundException;
import com.yc.interior.repository.AboutSectionRepository;
import com.yc.interior.repository.MediaRepository;
import com.yc.interior.service.AboutSectionService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AboutSectionServiceImpl implements AboutSectionService {

    private final AboutSectionRepository repository;
    private final MediaRepository mediaRepository;
    private final MediaServiceImpl mediaService;

    @Override
    public Page<AboutSectionResponse> getAll(Pageable pageable) {
        return repository.findAllByOrderByDisplayOrderAsc(pageable).map(this::toResponse);
    }

    @Override
    public AboutSectionResponse getById(Long id) {
        return toResponse(repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("AboutSection", id)));
    }

    @Override
    public AboutSectionResponse create(AboutSectionRequest request) {
        // Auto-assign display order
        Integer displayOrder = request.getDisplayOrder();
        if (displayOrder == null) {
            displayOrder = repository.findAll().stream()
                    .mapToInt(a -> a.getDisplayOrder() != null ? a.getDisplayOrder() : 0)
                    .max()
                    .orElse(-1) + 1;
        } else {
            // Shift existing items if inserting in the middle
            shiftDisplayOrdersForInsertion(displayOrder);
        }
        
        AboutSection entity = AboutSection.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .mediaId(request.getMediaId())
                .displayOrder(displayOrder)
                .isActive(request.getIsActive() != null ? request.getIsActive() : true)
                .build();
        return toResponse(repository.save(entity));
    }
    
    private void shiftDisplayOrdersForInsertion(Integer insertOrder) {
        repository.findAll().stream()
                .filter(a -> a.getDisplayOrder() != null && a.getDisplayOrder() >= insertOrder)
                .forEach(a -> {
                    a.setDisplayOrder(a.getDisplayOrder() + 1);
                    repository.save(a);
                });
    }

    @Override
    public AboutSectionResponse update(Long id, AboutSectionRequest request) {
        AboutSection entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("AboutSection", id));
        entity.setTitle(request.getTitle());
        entity.setDescription(request.getDescription());
        entity.setMediaId(request.getMediaId());
        
        // Handle display order changes with shifting
        if (request.getDisplayOrder() != null) {
            Integer oldOrder = entity.getDisplayOrder();
            Integer newOrder = request.getDisplayOrder();
            
            if (oldOrder != null && !oldOrder.equals(newOrder)) {
                if (newOrder < oldOrder) {
                    // Shift items between newOrder and oldOrder up by 1
                    repository.findAll().stream()
                            .filter(a -> a.getDisplayOrder() != null && a.getDisplayOrder() >= newOrder && a.getDisplayOrder() < oldOrder && !a.getId().equals(id))
                            .forEach(a -> {
                                a.setDisplayOrder(a.getDisplayOrder() + 1);
                                repository.save(a);
                            });
                } else if (newOrder > oldOrder) {
                    // Shift items between oldOrder and newOrder down by 1
                    repository.findAll().stream()
                            .filter(a -> a.getDisplayOrder() != null && a.getDisplayOrder() > oldOrder && a.getDisplayOrder() <= newOrder && !a.getId().equals(id))
                            .forEach(a -> {
                                a.setDisplayOrder(a.getDisplayOrder() - 1);
                                repository.save(a);
                            });
                }
            }
            entity.setDisplayOrder(newOrder);
        }
        
        if (request.getIsActive() != null) entity.setIsActive(request.getIsActive());
        return toResponse(repository.save(entity));
    }

    @Override
    public void delete(Long id) {
        if (!repository.existsById(id)) throw new ResourceNotFoundException("AboutSection", id);
        
        AboutSection entity = repository.findById(id).orElseThrow();
        Integer deletedOrder = entity.getDisplayOrder();
        
        // Delete associated media
        if (entity.getMediaId() != null) {
            try {
                mediaService.delete(entity.getMediaId());
            } catch (Exception e) {
                System.err.println("Failed to delete media: " + e.getMessage());
            }
        }
        
        // Hard delete the about section
        repository.deleteById(id);
        
        // Reorder remaining about sections
        if (deletedOrder != null) {
            reorderAfterDeletion(deletedOrder);
        }
    }
    
    private void reorderAfterDeletion(Integer deletedOrder) {
        repository.findAll().stream()
                .filter(a -> a.getDisplayOrder() != null && a.getDisplayOrder() > deletedOrder)
                .forEach(a -> {
                    a.setDisplayOrder(a.getDisplayOrder() - 1);
                    repository.save(a);
                });
    }

    private AboutSectionResponse toResponse(AboutSection e) {
        var res = AboutSectionResponse.builder()
                .id(e.getId()).title(e.getTitle()).description(e.getDescription())
                .mediaId(e.getMediaId()).displayOrder(e.getDisplayOrder())
                .isActive(e.getIsActive()).createdAt(e.getCreatedAt()).updatedAt(e.getUpdatedAt());
        if (e.getMediaId() != null)
            mediaRepository.findByIdAndDeletedAtIsNull(e.getMediaId()).ifPresent(m -> res.media(mediaService.toResponse(m)));
        return res.build();
    }
}
