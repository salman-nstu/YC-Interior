package com.yc.interior.service.impl;

import com.yc.interior.dto.request.PostCategoryRequest;
import com.yc.interior.dto.response.PostCategoryResponse;
import com.yc.interior.entity.PostCategory;
import com.yc.interior.exception.BusinessException;
import com.yc.interior.exception.ResourceNotFoundException;
import com.yc.interior.repository.PostCategoryRepository;
import com.yc.interior.service.PostCategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostCategoryServiceImpl implements PostCategoryService {

    private final PostCategoryRepository repository;

    @Override
    public Page<PostCategoryResponse> getAll(Pageable pageable) {
        return repository.findAll(pageable).map(this::toResponse);
    }

    @Override
    public List<PostCategoryResponse> getAllList() {
        return repository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Override
    public PostCategoryResponse getById(Long id) {
        return toResponse(repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("PostCategory", id)));
    }

    @Override
    public PostCategoryResponse create(PostCategoryRequest request) {
        if (repository.existsByName(request.getName())) throw new BusinessException("Category name already exists");
        return toResponse(repository.save(PostCategory.builder().name(request.getName()).build()));
    }

    @Override
    public PostCategoryResponse update(Long id, PostCategoryRequest request) {
        PostCategory entity = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("PostCategory", id));
        entity.setName(request.getName());
        return toResponse(repository.save(entity));
    }

    @Override
    public void delete(Long id) {
        if (!repository.existsById(id)) throw new ResourceNotFoundException("PostCategory", id);
        repository.deleteById(id);
    }

    private PostCategoryResponse toResponse(PostCategory e) {
        return PostCategoryResponse.builder().id(e.getId()).name(e.getName())
                .createdAt(e.getCreatedAt()).updatedAt(e.getUpdatedAt()).build();
    }
}
