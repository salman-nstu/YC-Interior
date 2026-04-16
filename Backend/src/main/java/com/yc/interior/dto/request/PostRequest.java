package com.yc.interior.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data @NoArgsConstructor @AllArgsConstructor
public class PostRequest {
    @NotBlank(message = "Title is required")
    private String title;
    private String slug;
    private String description;
    private Long coverMediaId;
    private Long categoryId;
    private String status;
}
