package com.yc.interior.dto.response;

import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class ServiceResponse {
    private Long id;
    private String title;
    private String description;
    private Long coverMediaId;
    private String status;
    private LocalDateTime publishedAt;
    private Integer displayOrder;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private MediaResponse coverMedia;
    private List<MediaResponse> images;
}
