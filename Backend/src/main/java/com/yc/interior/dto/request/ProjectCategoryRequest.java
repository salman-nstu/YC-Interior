package com.yc.interior.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data @NoArgsConstructor @AllArgsConstructor
public class ProjectCategoryRequest {
    @NotBlank(message = "Category name is required")
    private String name;
}
