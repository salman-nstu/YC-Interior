package com.yc.interior.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data @NoArgsConstructor @AllArgsConstructor
public class GalleryRequest {
    private String title;
    @NotNull(message = "media_id is required")
    private Long mediaId;
    private Boolean isFeatured;
    private Integer displayOrder;
}
