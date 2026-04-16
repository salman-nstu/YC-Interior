package com.yc.interior.dto.request;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MediaUploadRequest {
    private String category;
    private String subCategory;
    private String altText;
}
