package com.yc.interior.service.impl;

import com.yc.interior.dto.request.SettingsRequest;
import com.yc.interior.dto.response.MediaResponse;
import com.yc.interior.dto.response.SettingsResponse;
import com.yc.interior.entity.Settings;
import com.yc.interior.repository.MediaRepository;
import com.yc.interior.repository.SettingsRepository;
import com.yc.interior.service.SettingsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SettingsServiceImpl implements SettingsService {

    private final SettingsRepository settingsRepository;
    private final MediaRepository mediaRepository;
    private final MediaServiceImpl mediaService;

    @Override
    public SettingsResponse get() {
        Settings s = settingsRepository.findFirstByOrderByIdAsc()
                .orElseGet(() -> settingsRepository.save(new Settings()));
        return toResponse(s);
    }

    @Override
    public SettingsResponse update(SettingsRequest request) {
        Settings s = settingsRepository.findFirstByOrderByIdAsc()
                .orElseGet(() -> settingsRepository.save(new Settings()));
        s.setSiteName(request.getSiteName());
        s.setLogoMediaId(request.getLogoMediaId());
        s.setFaviconMediaId(request.getFaviconMediaId());
        s.setEmail(request.getEmail());
        s.setPhone(request.getPhone());
        s.setAddress(request.getAddress());
        s.setMapEmbedUrl(request.getMapEmbedUrl());
        s.setFacebookUrl(request.getFacebookUrl());
        s.setInstagramUrl(request.getInstagramUrl());
        s.setLinkedinUrl(request.getLinkedinUrl());
        s.setWhatsappUrl(request.getWhatsappUrl());
        s.setYoutubeUrl(request.getYoutubeUrl());
        return toResponse(settingsRepository.save(s));
    }

    private SettingsResponse toResponse(Settings s) {
        MediaResponse logoMedia = null;
        MediaResponse faviconMedia = null;

        if (s.getLogoMediaId() != null) {
            logoMedia = mediaRepository.findByIdAndDeletedAtIsNull(s.getLogoMediaId())
                    .map(mediaService::toResponse).orElse(null);
        }
        if (s.getFaviconMediaId() != null) {
            faviconMedia = mediaRepository.findByIdAndDeletedAtIsNull(s.getFaviconMediaId())
                    .map(mediaService::toResponse).orElse(null);
        }

        return SettingsResponse.builder()
                .id(s.getId())
                .siteName(s.getSiteName())
                .logoMediaId(s.getLogoMediaId())
                .faviconMediaId(s.getFaviconMediaId())
                .email(s.getEmail())
                .phone(s.getPhone())
                .address(s.getAddress())
                .mapEmbedUrl(s.getMapEmbedUrl())
                .facebookUrl(s.getFacebookUrl())
                .instagramUrl(s.getInstagramUrl())
                .linkedinUrl(s.getLinkedinUrl())
                .whatsappUrl(s.getWhatsappUrl())
                .youtubeUrl(s.getYoutubeUrl())
                .updatedAt(s.getUpdatedAt())
                .logoMedia(logoMedia)
                .faviconMedia(faviconMedia)
                .build();
    }
}
