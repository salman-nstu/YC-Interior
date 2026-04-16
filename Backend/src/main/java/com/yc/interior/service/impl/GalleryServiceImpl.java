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

    private static final int MAX_FEATURED = 8;

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
        Gallery entity = Gallery.builder()
                .title(request.getTitle()).mediaId(request.getMediaId())
                .isFeatured(request.getIsFeatured() != null ? request.getIsFeatured() : false)
                .displayOrder(request.getDisplayOrder() != null ? request.getDisplayOrder() : 0)
                .build();
        return toResponse(galleryRepository.save(entity));
    }

    @Override
    public GalleryResponse update(Long id, GalleryRequest request) {
        Gallery entity = galleryRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Gallery", id));
        entity.setTitle(request.getTitle());
        entity.setMediaId(request.getMediaId());
        if (request.getIsFeatured() != null) entity.setIsFeatured(request.getIsFeatured());
        if (request.getDisplayOrder() != null) entity.setDisplayOrder(request.getDisplayOrder());
        return toResponse(galleryRepository.save(entity));
    }

    @Override
    public void delete(Long id) {
        if (!galleryRepository.existsById(id)) throw new ResourceNotFoundException("Gallery", id);
        galleryRepository.deleteById(id);
    }

    @Override
    public GalleryResponse setFeatured(Long id, Boolean featured, Integer displayOrder) {
        Gallery entity = galleryRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Gallery", id));
        if (Boolean.TRUE.equals(featured)) {
            long total = galleryRepository.count();
            long currentFeatured = galleryRepository.countByIsFeaturedTrue();
            if (total > MAX_FEATURED && currentFeatured >= MAX_FEATURED && !Boolean.TRUE.equals(entity.getIsFeatured())) {
                throw new BusinessException("Maximum featured gallery items reached (" + MAX_FEATURED + ").");
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
