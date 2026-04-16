package com.yc.interior.service;

import com.yc.interior.dto.request.FaqRequest;
import com.yc.interior.dto.response.FaqResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface FaqService {
    Page<FaqResponse> getAll(String keyword, Pageable pageable);
    FaqResponse getById(Long id);
    FaqResponse create(FaqRequest request);
    FaqResponse update(Long id, FaqRequest request);
    void delete(Long id);
}
