package com.yc.interior.dto.request;

import lombok.*;

@Data @NoArgsConstructor @AllArgsConstructor
public class SettingsRequest {
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
}
