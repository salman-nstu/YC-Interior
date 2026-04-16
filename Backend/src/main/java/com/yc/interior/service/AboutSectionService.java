package com.yc.interior.service;

import com.yc.interior.dto.request.AboutSectionRequest;
import com.yc.interior.dto.response.AboutSectionResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AboutSectionService {
    Page<AboutSectionResponse> getAll(Pageable pageable);
    AboutSectionResponse getById(Long id);
    AboutSectionResponse create(AboutSectionRequest request);
    AboutSectionResponse update(Long id, AboutSectionRequest request);
    void delete(Long id);
}
