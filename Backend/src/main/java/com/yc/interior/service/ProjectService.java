package com.yc.interior.service;

import com.yc.interior.dto.request.ProjectRequest;
import com.yc.interior.dto.response.ProjectResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ProjectService {
    Page<ProjectResponse> getAll(String keyword, String status, String categoryType, Boolean featured, Pageable pageable);
    ProjectResponse getById(Long id);
    ProjectResponse create(ProjectRequest request);
    ProjectResponse update(Long id, ProjectRequest request);
    void delete(Long id);
    ProjectResponse setFeatured(Long id, Boolean featured, Integer displayOrder);
}
