package com.yc.interior.service;

import com.yc.interior.dto.request.PostRequest;
import com.yc.interior.dto.response.PostResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface PostService {
    Page<PostResponse> getAll(String keyword, String status, Long categoryId, Pageable pageable);
    PostResponse getById(Long id);
    PostResponse create(PostRequest request);
    PostResponse update(Long id, PostRequest request);
    void delete(Long id);
}
