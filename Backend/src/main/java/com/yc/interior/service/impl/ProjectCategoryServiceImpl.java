package com.yc.interior.service.impl;

import com.yc.interior.dto.request.ProjectCategoryRequest;
import com.yc.interior.dto.response.ProjectCategoryResponse;
import com.yc.interior.entity.ProjectCategory;
import com.yc.interior.exception.BusinessException;
import com.yc.interior.exception.ResourceNotFoundException;
import com.yc.interior.repository.ProjectCategoryRepository;
import com.yc.interior.service.ProjectCategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectCategoryServiceImpl implements ProjectCategoryService {

    private final ProjectCategoryRepository repository;

    @Override
    public Page<ProjectCategoryResponse> getAll(Pageable pageable) {
        return repository.findAll(pageable).map(this::toResponse);
    }

    @Override
    public List<ProjectCategoryResponse> getAllList() {
        return repository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Override
    public ProjectCategoryResponse getById(Long id) {
        return toResponse(repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("ProjectCategory", id)));
    }

    @Override
    public ProjectCategoryResponse create(ProjectCategoryRequest request) {
        if (repository.existsByName(request.getName())) throw new BusinessException("Category name already exists");
        return toResponse(repository.save(ProjectCategory.builder().name(request.getName()).build()));
    }

    @Override
    public ProjectCategoryResponse update(Long id, ProjectCategoryRequest request) {
        ProjectCategory entity = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("ProjectCategory", id));
        entity.setName(request.getName());
        return toResponse(repository.save(entity));
    }

    @Override
    public void delete(Long id) {
        if (!repository.existsById(id)) throw new ResourceNotFoundException("ProjectCategory", id);
        repository.deleteById(id);
    }

    private ProjectCategoryResponse toResponse(ProjectCategory e) {
        return ProjectCategoryResponse.builder()
                .id(e.getId()).name(e.getName())
                .createdAt(e.getCreatedAt()).updatedAt(e.getUpdatedAt()).build();
    }
}
