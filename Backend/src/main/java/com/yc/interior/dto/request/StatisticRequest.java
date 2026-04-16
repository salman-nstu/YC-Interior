package com.yc.interior.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data @NoArgsConstructor @AllArgsConstructor
public class StatisticRequest {
    @NotBlank(message = "Label is required")
    private String label;
    private Integer value;
    private String icon;
    private Integer displayOrder;
}
