package com.yc.interior.dto.response;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MediaResponse {
    private Long id;
    private String url;
    private String fileName;
    private String mimeType;
    private String category;
    private String subCategory;
    private String altText;
    private Long uploadedBy;
    private LocalDateTime createdAt;
}
