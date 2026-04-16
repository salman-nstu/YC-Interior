package com.yc.interior.service;

import com.yc.interior.dto.request.ProjectCategoryRequest;
import com.yc.interior.dto.response.ProjectCategoryResponse;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ProjectCategoryService {
    Page<ProjectCategoryResponse> getAll(Pageable pageable);
    List<ProjectCategoryResponse> getAllList();
    ProjectCategoryResponse getById(Long id);
    ProjectCategoryResponse create(ProjectCategoryRequest request);
    ProjectCategoryResponse update(Long id, ProjectCategoryRequest request);
    void delete(Long id);
}
