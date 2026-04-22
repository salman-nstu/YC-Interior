package com.yc.interior.service.impl;

import com.yc.interior.dto.request.ProjectRequest;
import com.yc.interior.dto.response.*;
import com.yc.interior.entity.Project;
import com.yc.interior.entity.ProjectImage;
import com.yc.interior.exception.BusinessException;
import com.yc.interior.exception.ResourceNotFoundException;
import com.yc.interior.repository.*;
import com.yc.interior.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectServiceImpl implements ProjectService {

    private static final int MAX_FEATURED = 6;

    private final ProjectRepository projectRepository;
    private final ProjectImageRepository projectImageRepository;
    private final ProjectCategoryRepository categoryRepository;
    private final MediaRepository mediaRepository;
    private final MediaServiceImpl mediaService;

    @Override
    public Page<ProjectResponse> getAll(String keyword, String status, Long categoryId, Boolean featured, Pageable pageable) {
        Project.ProjectStatus ps = parseStatus(status);
        return projectRepository.findAllWithFilters(keyword, ps, categoryId, featured, pageable).map(this::toResponse);
    }

    @Override
    public ProjectResponse getById(Long id) {
        return toResponse(findActive(id));
    }

    @Override
    @Transactional
    public ProjectResponse create(ProjectRequest request) {
        String slug = resolveSlug(request.getSlug(), request.getTitle());
        
        // Auto-assign display order (0-3 for projects, max 4 featured)
        Integer displayOrder = request.getDisplayOrder();
        long currentCount = projectRepository.count();
        
        if (displayOrder == null) {
            // Auto-increment: find max and add 1
            displayOrder = (int) Math.min(currentCount, 3); // Max order is 3 (0-3 = 4 items)
        } else if (displayOrder >= 0 && displayOrder <= 3) {
            // If order is in featured range, shift existing items
            shiftDisplayOrdersForInsertion(displayOrder);
        } else {
            // Order is beyond featured range, just use it
            displayOrder = (int) Math.max(displayOrder, 4);
        }
        
        Project entity = Project.builder()
                .title(request.getTitle()).slug(slug).description(request.getDescription())
                .coverMediaId(request.getCoverMediaId()).categoryId(request.getCategoryId())
                .status(parseStatus(request.getStatus()) != null ? parseStatus(request.getStatus()) : Project.ProjectStatus.published)
                .isFeatured(request.getIsFeatured() != null ? request.getIsFeatured() : false)
                .displayOrder(displayOrder)
                .build();
        if (entity.getStatus() == Project.ProjectStatus.published) entity.setPublishedAt(LocalDateTime.now());
        Project saved = projectRepository.save(entity);
        saveImages(saved.getId(), request.getImageMediaIds());
        return toResponse(saved);
    }
    
    private void shiftDisplayOrdersForInsertion(Integer insertOrder) {
        // Get all projects with order >= insertOrder and increment their order
        projectRepository.findAll().stream()
                .filter(p -> p.getDisplayOrder() != null && p.getDisplayOrder() >= insertOrder)
                .forEach(p -> {
                    p.setDisplayOrder(p.getDisplayOrder() + 1);
                    projectRepository.save(p);
                });
    }

    @Override
    @Transactional
    public ProjectResponse update(Long id, ProjectRequest request) {
        Project entity = findActive(id);
        entity.setTitle(request.getTitle());
        if (request.getSlug() != null) entity.setSlug(request.getSlug());
        entity.setDescription(request.getDescription());
        entity.setCoverMediaId(request.getCoverMediaId());
        entity.setCategoryId(request.getCategoryId());
        Project.ProjectStatus status = parseStatus(request.getStatus());
        if (status != null) { 
            entity.setStatus(status); 
            if (status == Project.ProjectStatus.published && entity.getPublishedAt() == null) 
                entity.setPublishedAt(LocalDateTime.now()); 
        }
        
        // Handle display order changes with shifting
        if (request.getDisplayOrder() != null) {
            Integer oldOrder = entity.getDisplayOrder();
            Integer newOrder = request.getDisplayOrder();
            
            if (oldOrder != null && !oldOrder.equals(newOrder)) {
                if (newOrder < oldOrder) {
                    // Shift items between newOrder and oldOrder up by 1
                    projectRepository.findAll().stream()
                            .filter(p -> p.getDisplayOrder() != null && p.getDisplayOrder() >= newOrder && p.getDisplayOrder() < oldOrder && !p.getId().equals(id))
                            .forEach(p -> {
                                p.setDisplayOrder(p.getDisplayOrder() + 1);
                                projectRepository.save(p);
                            });
                } else if (newOrder > oldOrder) {
                    // Shift items between oldOrder and newOrder down by 1
                    projectRepository.findAll().stream()
                            .filter(p -> p.getDisplayOrder() != null && p.getDisplayOrder() > oldOrder && p.getDisplayOrder() <= newOrder && !p.getId().equals(id))
                            .forEach(p -> {
                                p.setDisplayOrder(p.getDisplayOrder() - 1);
                                projectRepository.save(p);
                            });
                }
            }
            entity.setDisplayOrder(newOrder);
        }
        
        projectImageRepository.deleteByProjectId(id);
        saveImages(id, request.getImageMediaIds());
        return toResponse(projectRepository.save(entity));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        Project entity = findActive(id);
        Integer deletedOrder = entity.getDisplayOrder();
        
        // Get all project images
        List<ProjectImage> projectImages = projectImageRepository.findByProjectIdOrderByDisplayOrderAsc(id);
        
        // Delete all associated media files (cover + gallery images) using MediaService
        if (entity.getCoverMediaId() != null) {
            try {
                mediaService.delete(entity.getCoverMediaId());
            } catch (Exception e) {
                // Continue even if media deletion fails
                System.err.println("Failed to delete cover media: " + e.getMessage());
            }
        }
        
        // Delete all gallery images
        for (ProjectImage projectImage : projectImages) {
            try {
                mediaService.delete(projectImage.getMediaId());
            } catch (Exception e) {
                // Continue even if media deletion fails
                System.err.println("Failed to delete gallery image: " + e.getMessage());
            }
        }
        
        // Delete project image records
        projectImageRepository.deleteByProjectId(id);
        
        // Hard delete the project (completely remove from database)
        projectRepository.deleteById(id);
        
        // Reorder remaining projects
        if (deletedOrder != null) {
            reorderAfterDeletion(deletedOrder);
        }
    }
    
    private void reorderAfterDeletion(Integer deletedOrder) {
        // Get all projects with order > deletedOrder and decrement their order
        projectRepository.findAll().stream()
                .filter(p -> p.getDisplayOrder() != null && p.getDisplayOrder() > deletedOrder)
                .forEach(p -> {
                    p.setDisplayOrder(p.getDisplayOrder() - 1);
                    projectRepository.save(p);
                });
    }

    @Override
    @Transactional
    public ProjectResponse setFeatured(Long id, Boolean featured, Integer displayOrder) {
        Project entity = findActive(id);
        if (featured != null && featured) {
            long currentFeatured = projectRepository.countByIsFeaturedTrue();
            long total = projectRepository.countByDeletedAtIsNull();
            if (total <= MAX_FEATURED) {
                // Auto-feature all — just set this one
            } else if (currentFeatured >= MAX_FEATURED && !Boolean.TRUE.equals(entity.getIsFeatured())) {
                throw new BusinessException("Maximum featured projects reached (" + MAX_FEATURED + "). Unfeature another project first.");
            }
        }
        entity.setIsFeatured(featured);
        if (displayOrder != null) entity.setDisplayOrder(displayOrder);
        return toResponse(projectRepository.save(entity));
    }

    private Project findActive(Long id) {
        return projectRepository.findById(id)
                .filter(p -> p.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Project", id));
    }

    private void saveImages(Long projectId, List<Long> mediaIds) {
        if (mediaIds == null) return;
        for (int i = 0; i < mediaIds.size(); i++) {
            projectImageRepository.save(ProjectImage.builder().projectId(projectId).mediaId(mediaIds.get(i)).displayOrder(i).build());
        }
    }

    private String resolveSlug(String slug, String title) {
        if (slug != null && !slug.isBlank()) return slug;
        return title.toLowerCase().replaceAll("[^a-z0-9]+", "-").replaceAll("^-|-$", "");
    }

    private ProjectResponse toResponse(Project e) {
        List<MediaResponse> images = projectImageRepository.findByProjectIdOrderByDisplayOrderAsc(e.getId()).stream()
                .map(pi -> mediaRepository.findByIdAndDeletedAtIsNull(pi.getMediaId()).map(mediaService::toResponse).orElse(null))
                .filter(m -> m != null).collect(Collectors.toList());

        var res = ProjectResponse.builder()
                .id(e.getId()).title(e.getTitle()).slug(e.getSlug()).description(e.getDescription())
                .coverMediaId(e.getCoverMediaId()).categoryId(e.getCategoryId())
                .status(e.getStatus() != null ? e.getStatus().name() : null)
                .publishedAt(e.getPublishedAt()).isFeatured(e.getIsFeatured())
                .displayOrder(e.getDisplayOrder()).createdAt(e.getCreatedAt()).updatedAt(e.getUpdatedAt())
                .images(images);
        if (e.getCoverMediaId() != null)
            mediaRepository.findByIdAndDeletedAtIsNull(e.getCoverMediaId()).ifPresent(m -> res.coverMedia(mediaService.toResponse(m)));
        if (e.getCategoryId() != null)
            categoryRepository.findById(e.getCategoryId()).ifPresent(c -> res.category(ProjectCategoryResponse.builder().id(c.getId()).name(c.getName()).build()));
        return res.build();
    }

    private Project.ProjectStatus parseStatus(String s) {
        if (s == null) return null;
        try { return Project.ProjectStatus.valueOf(s); } catch (Exception e) { return null; }
    }
}
