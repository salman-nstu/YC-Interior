package com.yc.interior.service;

import com.yc.interior.dto.request.GalleryRequest;
import com.yc.interior.dto.response.GalleryResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface GalleryService {
    Page<GalleryResponse> getAll(String keyword, Boolean featured, Pageable pageable);
    GalleryResponse getById(Long id);
    GalleryResponse create(GalleryRequest request);
    GalleryResponse update(Long id, GalleryRequest request);
    void delete(Long id);
    GalleryResponse setFeatured(Long id, Boolean featured, Integer displayOrder);
}
