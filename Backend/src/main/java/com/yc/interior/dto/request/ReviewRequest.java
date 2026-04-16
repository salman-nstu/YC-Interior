package com.yc.interior.dto.request;

import jakarta.validation.constraints.*;
import lombok.*;

@Data @NoArgsConstructor @AllArgsConstructor
public class ReviewRequest {
    @NotBlank(message = "Name is required")
    private String name;
    private String designation;
    @NotNull(message = "Rating is required")
    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating must not exceed 5")
    private Integer rating;
    private String description;
    private Long mediaId;
    private Boolean isFeatured;
}
