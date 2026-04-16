package com.yc.interior.service;

import com.yc.interior.dto.response.MediaResponse;
import com.yc.interior.entity.Media;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

public interface MediaService {
    MediaResponse upload(MultipartFile file, String category, String subCategory, String altText, Long adminId);
    Page<MediaResponse> getAll(String category, String subCategory, Pageable pageable);
    MediaResponse getById(Long id);
    void delete(Long id);
    boolean existsById(Long id);
}
