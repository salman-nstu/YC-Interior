package com.yc.interior.dto.response;

import lombok.*;
import java.time.LocalDateTime;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class SettingsResponse {
    private Long id;
    private String siteName;
    private Long logoMediaId;
    private Long faviconMediaId;
    private String email;
    private String phone;
    private String address;
    private String mapEmbedUrl;
    private String facebookUrl;
    private String instagramUrl;
    private String linkedinUrl;
    private String whatsappUrl;
    private String youtubeUrl;
    private LocalDateTime updatedAt;
    private MediaResponse logoMedia;
    private MediaResponse faviconMedia;
}
