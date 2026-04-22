package com.yc.interior.service.impl;

import com.yc.interior.dto.request.PostRequest;
import com.yc.interior.dto.response.PostCategoryResponse;
import com.yc.interior.dto.response.PostResponse;
import com.yc.interior.entity.Post;
import com.yc.interior.exception.ResourceNotFoundException;
import com.yc.interior.repository.MediaRepository;
import com.yc.interior.repository.PostCategoryRepository;
import com.yc.interior.repository.PostRepository;
import com.yc.interior.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class PostServiceImpl implements PostService {

    private final PostRepository repository;
    private final PostCategoryRepository categoryRepository;
    private final MediaRepository mediaRepository;
    private final MediaServiceImpl mediaService;

    @Override
    public Page<PostResponse> getAll(String keyword, String status, Long categoryId, Pageable pageable) {
        Post.PostStatus ps = parseStatus(status);
        return repository.findAllWithFilters(keyword, ps, categoryId, pageable).map(this::toResponse);
    }

    @Override
    public PostResponse getById(Long id) {
        return toResponse(repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Post", id)));
    }

    @Override
    public PostResponse create(PostRequest request) {
        String slug = resolveSlug(request.getSlug(), request.getTitle());
        Post entity = Post.builder().title(request.getTitle()).slug(slug).description(request.getDescription())
                .coverMediaId(request.getCoverMediaId()).categoryId(request.getCategoryId())
                .status(parseStatus(request.getStatus()) != null ? parseStatus(request.getStatus()) : Post.PostStatus.published)
                .build();
        if (entity.getStatus() == Post.PostStatus.published) entity.setPublishedAt(LocalDateTime.now());
        return toResponse(repository.save(entity));
    }

    @Override
    public PostResponse update(Long id, PostRequest request) {
        Post entity = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Post", id));
        entity.setTitle(request.getTitle());
        if (request.getSlug() != null) entity.setSlug(request.getSlug());
        entity.setDescription(request.getDescription());
        entity.setCoverMediaId(request.getCoverMediaId());
        entity.setCategoryId(request.getCategoryId());
        Post.PostStatus status = parseStatus(request.getStatus());
        if (status != null) { entity.setStatus(status); if (status == Post.PostStatus.published && entity.getPublishedAt() == null) entity.setPublishedAt(LocalDateTime.now()); }
        return toResponse(repository.save(entity));
    }

    @Override
    public void delete(Long id) {
        if (!repository.existsById(id)) throw new ResourceNotFoundException("Post", id);
        
        Post entity = repository.findById(id).orElseThrow();
        
        // Delete cover media
        if (entity.getCoverMediaId() != null) {
            try {
                mediaService.delete(entity.getCoverMediaId());
            } catch (Exception e) {
                System.err.println("Failed to delete cover media: " + e.getMessage());
            }
        }
        
        // Hard delete the post
        repository.deleteById(id);
    }

    private PostResponse toResponse(Post e) {
        var res = PostResponse.builder().id(e.getId()).title(e.getTitle()).slug(e.getSlug())
                .description(e.getDescription()).coverMediaId(e.getCoverMediaId()).categoryId(e.getCategoryId())
                .status(e.getStatus() != null ? e.getStatus().name() : null)
                .publishedAt(e.getPublishedAt()).createdAt(e.getCreatedAt()).updatedAt(e.getUpdatedAt());
        if (e.getCoverMediaId() != null)
            mediaRepository.findByIdAndDeletedAtIsNull(e.getCoverMediaId()).ifPresent(m -> res.coverMedia(mediaService.toResponse(m)));
        if (e.getCategoryId() != null)
            categoryRepository.findById(e.getCategoryId()).ifPresent(c -> res.category(PostCategoryResponse.builder().id(c.getId()).name(c.getName()).build()));
        return res.build();
    }

    private String resolveSlug(String slug, String title) {
        if (slug != null && !slug.isBlank()) return slug;
        return title.toLowerCase().replaceAll("[^a-z0-9]+", "-").replaceAll("^-|-$", "");
    }

    private Post.PostStatus parseStatus(String s) {
        if (s == null) return null;
        try { return Post.PostStatus.valueOf(s); } catch (Exception e) { return null; }
    }
}
