package com.yc.interior.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data @NoArgsConstructor @AllArgsConstructor
public class TeamMemberRequest {
    @NotBlank(message = "Name is required")
    private String name;
    private String designation;
    private Long mediaId;
    private Integer displayOrder;
}
