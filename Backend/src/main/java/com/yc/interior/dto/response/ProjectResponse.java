package com.yc.interior.dto.response;

import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class ProjectResponse {
    private Long id;
    private String title;
    private String slug;
    private String description;
    private Long coverMediaId;
    private Long categoryId;
    private String status;
    private LocalDateTime publishedAt;
    private Boolean isFeatured;
    private Integer displayOrder;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private MediaResponse coverMedia;
    private ProjectCategoryResponse category;
    private List<MediaResponse> images;
}
