package com.yc.interior.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data @NoArgsConstructor @AllArgsConstructor
public class AboutSectionRequest {
    @NotBlank(message = "Title is required")
    private String title;
    private String description;
    private Long mediaId;
    private Integer displayOrder;
    private Boolean isActive;
}
