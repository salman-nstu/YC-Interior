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
        // Auto-assign display order
        Integer displayOrder = request.getDisplayOrder();
        if (displayOrder == null) {
            displayOrder = repository.findAll().stream()
                    .mapToInt(t -> t.getDisplayOrder() != null ? t.getDisplayOrder() : 0)
                    .max()
                    .orElse(-1) + 1;
        } else {
            // Shift existing items if inserting in the middle
            shiftDisplayOrdersForInsertion(displayOrder);
        }
        
        TeamMember entity = TeamMember.builder().name(request.getName()).designation(request.getDesignation())
                .mediaId(request.getMediaId()).displayOrder(displayOrder).build();
        return toResponse(repository.save(entity));
    }
    
    private void shiftDisplayOrdersForInsertion(Integer insertOrder) {
        repository.findAll().stream()
                .filter(t -> t.getDisplayOrder() != null && t.getDisplayOrder() >= insertOrder)
                .forEach(t -> {
                    t.setDisplayOrder(t.getDisplayOrder() + 1);
                    repository.save(t);
                });
    }

    @Override
    public TeamMemberResponse update(Long id, TeamMemberRequest request) {
        TeamMember entity = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("TeamMember", id));
        entity.setName(request.getName()); 
        entity.setDesignation(request.getDesignation());
        entity.setMediaId(request.getMediaId());
        
        // Handle display order changes with shifting
        if (request.getDisplayOrder() != null) {
            Integer oldOrder = entity.getDisplayOrder();
            Integer newOrder = request.getDisplayOrder();
            
            if (oldOrder != null && !oldOrder.equals(newOrder)) {
                if (newOrder < oldOrder) {
                    // Shift items between newOrder and oldOrder up by 1
                    repository.findAll().stream()
                            .filter(t -> t.getDisplayOrder() != null && t.getDisplayOrder() >= newOrder && t.getDisplayOrder() < oldOrder && !t.getId().equals(id))
                            .forEach(t -> {
                                t.setDisplayOrder(t.getDisplayOrder() + 1);
                                repository.save(t);
                            });
                } else if (newOrder > oldOrder) {
                    // Shift items between oldOrder and newOrder down by 1
                    repository.findAll().stream()
                            .filter(t -> t.getDisplayOrder() != null && t.getDisplayOrder() > oldOrder && t.getDisplayOrder() <= newOrder && !t.getId().equals(id))
                            .forEach(t -> {
                                t.setDisplayOrder(t.getDisplayOrder() - 1);
                                repository.save(t);
                            });
                }
            }
            entity.setDisplayOrder(newOrder);
        }
        
        return toResponse(repository.save(entity));
    }

    @Override
    public void delete(Long id) {
        if (!repository.existsById(id)) throw new ResourceNotFoundException("TeamMember", id);
        
        TeamMember entity = repository.findById(id).orElseThrow();
        Integer deletedOrder = entity.getDisplayOrder();
        
        // Delete associated media
        if (entity.getMediaId() != null) {
            try {
                mediaService.delete(entity.getMediaId());
            } catch (Exception e) {
                System.err.println("Failed to delete media: " + e.getMessage());
            }
        }
        
        // Hard delete the team member
        repository.deleteById(id);
        
        // Reorder remaining team members
        if (deletedOrder != null) {
            reorderAfterDeletion(deletedOrder);
        }
    }
    
    private void reorderAfterDeletion(Integer deletedOrder) {
        repository.findAll().stream()
                .filter(t -> t.getDisplayOrder() != null && t.getDisplayOrder() > deletedOrder)
                .forEach(t -> {
                    t.setDisplayOrder(t.getDisplayOrder() - 1);
                    repository.save(t);
                });
    }

    private TeamMemberResponse toResponse(TeamMember e) {
        var res = TeamMemberResponse.builder().id(e.getId()).name(e.getName()).designation(e.getDesignation())
                .mediaId(e.getMediaId()).displayOrder(e.getDisplayOrder()).createdAt(e.getCreatedAt()).updatedAt(e.getUpdatedAt());
        if (e.getMediaId() != null)
            mediaRepository.findByIdAndDeletedAtIsNull(e.getMediaId()).ifPresent(m -> res.media(mediaService.toResponse(m)));
        return res.build();
    }
}
