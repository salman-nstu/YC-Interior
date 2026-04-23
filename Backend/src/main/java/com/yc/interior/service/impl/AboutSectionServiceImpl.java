package com.yc.interior.service.impl;

import com.yc.interior.dto.request.AboutSectionRequest;
import com.yc.interior.dto.response.AboutSectionResponse;
import com.yc.interior.entity.AboutSection;
import com.yc.interior.exception.ResourceNotFoundException;
import com.yc.interior.repository.AboutSectionRepository;
import com.yc.interior.service.AboutSectionService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AboutSectionServiceImpl implements AboutSectionService {

    private final AboutSectionRepository repository;

    @Override
    public Page<AboutSectionResponse> getAll(Pageable pageable) {
        return repository.findAll(pageable).map(this::toResponse);
    }

    @Override
    public AboutSectionResponse getById(Long id) {
        return toResponse(repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("AboutSection", id)));
    }

    @Override
    public AboutSectionResponse create(AboutSectionRequest request) {
        AboutSection entity = AboutSection.builder()
                .description(request.getDescription())
                .build();
        return toResponse(repository.save(entity));
    }

    @Override
    public AboutSectionResponse update(Long id, AboutSectionRequest request) {
        AboutSection entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("AboutSection", id));
        
        if (request.getDescription() != null) {
            entity.setDescription(request.getDescription());
        }
        
        return toResponse(repository.save(entity));
    }

    @Override
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("AboutSection", id);
        }
        repository.deleteById(id);
    }

    private AboutSectionResponse toResponse(AboutSection e) {
        return AboutSectionResponse.builder()
                .id(e.getId())
                .description(e.getDescription())
                .createdAt(e.getCreatedAt())
                .updatedAt(e.getUpdatedAt())
                .build();
    }
}
