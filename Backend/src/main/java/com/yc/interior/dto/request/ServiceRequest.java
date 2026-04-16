package com.yc.interior.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import java.util.List;

@Data @NoArgsConstructor @AllArgsConstructor
public class ServiceRequest {
    @NotBlank(message = "Title is required")
    private String title;
    private String description;
    private Long coverMediaId;
    private String status;
    private Integer displayOrder;
    private Boolean isActive;
    private List<Long> imageMediaIds;
}
