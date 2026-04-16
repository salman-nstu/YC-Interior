package com.yc.interior.dto.response;

import lombok.*;
import java.time.LocalDateTime;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class TeamMemberResponse {
    private Long id;
    private String name;
    private String designation;
    private Long mediaId;
    private Integer displayOrder;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private MediaResponse media;
}
