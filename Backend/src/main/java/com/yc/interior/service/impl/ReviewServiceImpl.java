package com.yc.interior.service.impl;

import com.yc.interior.dto.request.ReviewRequest;
import com.yc.interior.dto.response.ReviewResponse;
import com.yc.interior.entity.Review;
import com.yc.interior.exception.BusinessException;
import com.yc.interior.exception.ResourceNotFoundException;
import com.yc.interior.repository.MediaRepository;
import com.yc.interior.repository.ReviewRepository;
import com.yc.interior.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private static final int MAX_FEATURED = 6;

    private final ReviewRepository repository;
    private final MediaRepository mediaRepository;
    private final MediaServiceImpl mediaService;

    @Override
    public Page<ReviewResponse> getAll(String keyword, Boolean featured, Pageable pageable) {
        return repository.findAllWithFilters(keyword, featured, pageable).map(this::toResponse);
    }

    @Override
    public ReviewResponse getById(Long id) {
        return toResponse(repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Review", id)));
    }

    @Override
    public ReviewResponse create(ReviewRequest request) {
        Review entity = Review.builder().name(request.getName()).designation(request.getDesignation())
                .rating(request.getRating()).description(request.getDescription()).mediaId(request.getMediaId())
                .isFeatured(request.getIsFeatured() != null ? request.getIsFeatured() : true).build();
        return toResponse(repository.save(entity));
    }

    @Override
    public ReviewResponse update(Long id, ReviewRequest request) {
        Review entity = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Review", id));
        entity.setName(request.getName()); entity.setDesignation(request.getDesignation());
        entity.setRating(request.getRating()); entity.setDescription(request.getDescription());
        entity.setMediaId(request.getMediaId());
        if (request.getIsFeatured() != null) entity.setIsFeatured(request.getIsFeatured());
        return toResponse(repository.save(entity));
    }

    @Override
    public void delete(Long id) {
        if (!repository.existsById(id)) throw new ResourceNotFoundException("Review", id);
        repository.deleteById(id);
    }

    @Override
    public ReviewResponse setFeatured(Long id, Boolean featured, boolean ignored) {
        return setFeatured(id, featured);
    }

    @Override
    public ReviewResponse setFeatured(Long id, Boolean featured) {
        Review entity = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Review", id));
        if (Boolean.TRUE.equals(featured)) {
            long currentFeatured = repository.countByIsFeaturedTrue();
            if (currentFeatured >= MAX_FEATURED && !Boolean.TRUE.equals(entity.getIsFeatured())) {
                throw new BusinessException("Maximum featured reviews reached (" + MAX_FEATURED + ").");
            }
        }
        entity.setIsFeatured(featured);
        return toResponse(repository.save(entity));
    }

    private ReviewResponse toResponse(Review e) {
        var res = ReviewResponse.builder().id(e.getId()).name(e.getName()).designation(e.getDesignation())
                .rating(e.getRating()).description(e.getDescription()).mediaId(e.getMediaId())
                .isFeatured(e.getIsFeatured()).createdAt(e.getCreatedAt()).updatedAt(e.getUpdatedAt());
        if (e.getMediaId() != null)
            mediaRepository.findByIdAndDeletedAtIsNull(e.getMediaId()).ifPresent(m -> res.media(mediaService.toResponse(m)));
        return res.build();
    }
}
