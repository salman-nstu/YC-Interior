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
    private String categoryType;
    private String status;
    private LocalDateTime publishedAt;
    private Boolean isFeatured;
    private Integer displayOrder;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private MediaResponse coverMedia;
    private List<MediaResponse> images;
}
