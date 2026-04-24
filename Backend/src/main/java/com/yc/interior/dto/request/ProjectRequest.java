package com.yc.interior.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import java.util.List;

@Data @NoArgsConstructor @AllArgsConstructor
public class ProjectRequest {
    @NotBlank(message = "Title is required")
    private String title;
    private String slug;
    private String description;
    private Long coverMediaId;
    
    @NotBlank(message = "Category is required")
    private String categoryType;
    
    private String status;
    private Boolean isFeatured;
    private Integer displayOrder;
    private List<Long> imageMediaIds;
}
