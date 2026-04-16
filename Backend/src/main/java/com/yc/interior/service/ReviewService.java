package com.yc.interior.service;

import com.yc.interior.dto.request.ReviewRequest;
import com.yc.interior.dto.response.ReviewResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ReviewService {
    Page<ReviewResponse> getAll(String keyword, Boolean featured, Pageable pageable);
    ReviewResponse getById(Long id);
    ReviewResponse create(ReviewRequest request);
    ReviewResponse update(Long id, ReviewRequest request);
    void delete(Long id);
    ReviewResponse setFeatured(Long id, Boolean featured);
    ReviewResponse setFeatured(Long id, Boolean featured, boolean ignored);
}
