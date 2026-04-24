package com.yc.interior.service.impl;

import com.yc.interior.dto.response.MediaResponse;
import com.yc.interior.entity.Media;
import com.yc.interior.exception.ResourceNotFoundException;
import com.yc.interior.repository.MediaRepository;
import com.yc.interior.service.MediaService;
import com.yc.interior.storage.StorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class MediaServiceImpl implements MediaService {

    private final MediaRepository mediaRepository;
    private final StorageService storageService;

    @Value("${app.upload.base-url}")
    private String baseUrl;

    @Override
    public MediaResponse upload(MultipartFile file, String category, String subCategory, String altText, Long adminId) {
        Media.MediaCategory mediaCategory = parseCategory(category);
        String subDir = category != null ? category : "general";
        String filePath = storageService.store(file, subDir);

        // Calculate dimensions and aspect ratio
        Integer width = null;
        Integer height = null;
        String aspectRatio = null;
        
        try {
            java.awt.image.BufferedImage img = javax.imageio.ImageIO.read(file.getInputStream());
            if (img != null) {
                width = img.getWidth();
                height = img.getHeight();
                
                // Calculate aspect ratio
                double ratio = (double) width / height;
                if (ratio > 1.2) {
                    aspectRatio = "landscape";
                } else if (ratio < 0.8) {
                    aspectRatio = "portrait";
                } else {
                    aspectRatio = "square";
                }
            }
        } catch (Exception e) {
            // If image reading fails, continue without dimensions
            System.err.println("Could not read image dimensions: " + e.getMessage());
        }

        Media media = Media.builder()
                .url(baseUrl + "/" + filePath)
                .fileName(file.getOriginalFilename())
                .mimeType(file.getContentType())
                .category(mediaCategory)
                .subCategory(subCategory)
                .altText(altText)
                .width(width)
                .height(height)
                .aspectRatio(aspectRatio)
                .uploadedBy(adminId)
                .build();

        return toResponse(mediaRepository.save(media));
    }

    @Override
    public Page<MediaResponse> getAll(String category, String subCategory, Pageable pageable) {
        Media.MediaCategory mediaCategory = parseCategory(category);
        return mediaRepository.findAllActive(mediaCategory, subCategory, pageable)
                .map(this::toResponse);
    }

    @Override
    public MediaResponse getById(Long id) {
        return mediaRepository.findByIdAndDeletedAtIsNull(id)
                .map(this::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Media", id));
    }

    @Override
    public void delete(Long id) {
        Media media = mediaRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new ResourceNotFoundException("Media", id));
        
        // Extract file path from URL and delete physical file
        if (media.getUrl() != null && media.getUrl().startsWith(baseUrl)) {
            String filePath = media.getUrl().substring(baseUrl.length() + 1); // +1 for the "/"
            storageService.delete(filePath);
        }
        
        // Soft delete the media record
        media.setDeletedAt(LocalDateTime.now());
        mediaRepository.save(media);
    }

    @Override
    public boolean existsById(Long id) {
        return id == null || mediaRepository.existsByIdAndDeletedAtIsNull(id);
    }

    public MediaResponse toResponse(Media media) {
        if (media == null) return null;
        
        // Extract filePath from URL
        String filePath = null;
        if (media.getUrl() != null && media.getUrl().startsWith(baseUrl)) {
            filePath = media.getUrl().substring(baseUrl.length());
        }
        
        return MediaResponse.builder()
                .id(media.getId())
                .url(media.getUrl())
                .filePath(filePath)
                .fileName(media.getFileName())
                .mimeType(media.getMimeType())
                .category(media.getCategory() != null ? media.getCategory().name() : null)
                .subCategory(media.getSubCategory())
                .altText(media.getAltText())
                .width(media.getWidth())
                .height(media.getHeight())
                .aspectRatio(media.getAspectRatio())
                .uploadedBy(media.getUploadedBy())
                .createdAt(media.getCreatedAt())
                .build();
    }

    private Media.MediaCategory parseCategory(String category) {
        if (category == null) return null;
        try {
            return Media.MediaCategory.valueOf(category);
        } catch (IllegalArgumentException e) {
            return Media.MediaCategory.general;
        }
    }
}
