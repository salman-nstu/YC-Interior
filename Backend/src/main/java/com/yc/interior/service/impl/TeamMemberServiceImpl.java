package com.yc.interior.service.impl;

import com.yc.interior.dto.request.TeamMemberRequest;
import com.yc.interior.dto.response.TeamMemberResponse;
import com.yc.interior.entity.TeamMember;
import com.yc.interior.exception.ResourceNotFoundException;
import com.yc.interior.repository.MediaRepository;
import com.yc.interior.repository.TeamMemberRepository;
import com.yc.interior.service.TeamMemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TeamMemberServiceImpl implements TeamMemberService {

    private final TeamMemberRepository repository;
    private final MediaRepository mediaRepository;
    private final MediaServiceImpl mediaService;

    @Override
    public Page<TeamMemberResponse> getAll(String keyword, Pageable pageable) {
        return repository.findAllWithFilter(keyword, pageable).map(this::toResponse);
    }

    @Override
    public TeamMemberResponse getById(Long id) {
        return toResponse(repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("TeamMember", id)));
    }

    @Override
    public TeamMemberResponse create(TeamMemberRequest request) {
        TeamMember entity = TeamMember.builder().name(request.getName()).designation(request.getDesignation())
                .mediaId(request.getMediaId()).displayOrder(request.getDisplayOrder() != null ? request.getDisplayOrder() : 0).build();
        return toResponse(repository.save(entity));
    }

    @Override
    public TeamMemberResponse update(Long id, TeamMemberRequest request) {
        TeamMember entity = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("TeamMember", id));
        entity.setName(request.getName()); entity.setDesignation(request.getDesignation());
        entity.setMediaId(request.getMediaId());
        if (request.getDisplayOrder() != null) entity.setDisplayOrder(request.getDisplayOrder());
        return toResponse(repository.save(entity));
    }

    @Override
    public void delete(Long id) {
        if (!repository.existsById(id)) throw new ResourceNotFoundException("TeamMember", id);
        repository.deleteById(id);
    }

    private TeamMemberResponse toResponse(TeamMember e) {
        var res = TeamMemberResponse.builder().id(e.getId()).name(e.getName()).designation(e.getDesignation())
                .mediaId(e.getMediaId()).displayOrder(e.getDisplayOrder()).createdAt(e.getCreatedAt()).updatedAt(e.getUpdatedAt());
        if (e.getMediaId() != null)
            mediaRepository.findByIdAndDeletedAtIsNull(e.getMediaId()).ifPresent(m -> res.media(mediaService.toResponse(m)));
        return res.build();
    }
}
