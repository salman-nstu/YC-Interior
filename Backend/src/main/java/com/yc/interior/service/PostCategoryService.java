package com.yc.interior.service;

import com.yc.interior.dto.request.PostCategoryRequest;
import com.yc.interior.dto.response.PostCategoryResponse;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface PostCategoryService {
    Page<PostCategoryResponse> getAll(Pageable pageable);
    List<PostCategoryResponse> getAllList();
    PostCategoryResponse getById(Long id);
    PostCategoryResponse create(PostCategoryRequest request);
    PostCategoryResponse update(Long id, PostCategoryRequest request);
    void delete(Long id);
}
