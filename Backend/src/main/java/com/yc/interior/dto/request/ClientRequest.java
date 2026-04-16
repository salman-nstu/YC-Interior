package com.yc.interior.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data @NoArgsConstructor @AllArgsConstructor
public class ClientRequest {
    @NotBlank(message = "Client name is required")
    private String name;
    private Long logoMediaId;
    private Integer displayOrder;
}
