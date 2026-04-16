package com.yc.interior.service.impl;

import com.yc.interior.dto.request.AboutSectionRequest;
import com.yc.interior.dto.response.AboutSectionResponse;
import com.yc.interior.entity.AboutSection;
import com.yc.interior.exception.ResourceNotFoundException;
import com.yc.interior.repository.AboutSectionRepository;
import com.yc.interior.repository.MediaRepository;
import com.yc.interior.service.AboutSectionService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AboutSectionServiceImpl implements AboutSectionService {

    private final AboutSectionRepository repository;
    private final MediaRepository mediaRepository;
    private final MediaServiceImpl mediaService;

    @Override
    public Page<AboutSectionResponse> getAll(Pageable pageable) {
        return repository.findAllByOrderByDisplayOrderAsc(pageable).map(this::toResponse);
    }

    @Override
    public AboutSectionResponse getById(Long id) {
        return toResponse(repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("AboutSection", id)));
    }

    @Override
    public AboutSectionResponse create(AboutSectionRequest request) {
        AboutSection entity = AboutSection.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .mediaId(request.getMediaId())
                .displayOrder(request.getDisplayOrder() != null ? request.getDisplayOrder() : 0)
                .isActive(request.getIsActive() != null ? request.getIsActive() : true)
                .build();
        return toResponse(repository.save(entity));
    }

    @Override
    public AboutSectionResponse update(Long id, AboutSectionRequest request) {
        AboutSection entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("AboutSection", id));
        entity.setTitle(request.getTitle());
        entity.setDescription(request.getDescription());
        entity.setMediaId(request.getMediaId());
        if (request.getDisplayOrder() != null) entity.setDisplayOrder(request.getDisplayOrder());
        if (request.getIsActive() != null) entity.setIsActive(request.getIsActive());
        return toResponse(repository.save(entity));
    }

    @Override
    public void delete(Long id) {
        if (!repository.existsById(id)) throw new ResourceNotFoundException("AboutSection", id);
        repository.deleteById(id);
    }

    private AboutSectionResponse toResponse(AboutSection e) {
        var res = AboutSectionResponse.builder()
                .id(e.getId()).title(e.getTitle()).description(e.getDescription())
                .mediaId(e.getMediaId()).displayOrder(e.getDisplayOrder())
                .isActive(e.getIsActive()).createdAt(e.getCreatedAt()).updatedAt(e.getUpdatedAt());
        if (e.getMediaId() != null)
            mediaRepository.findByIdAndDeletedAtIsNull(e.getMediaId()).ifPresent(m -> res.media(mediaService.toResponse(m)));
        return res.build();
    }
}
