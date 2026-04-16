package com.yc.interior.service;

import com.yc.interior.dto.request.TeamMemberRequest;
import com.yc.interior.dto.response.TeamMemberResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface TeamMemberService {
    Page<TeamMemberResponse> getAll(String keyword, Pageable pageable);
    TeamMemberResponse getById(Long id);
    TeamMemberResponse create(TeamMemberRequest request);
    TeamMemberResponse update(Long id, TeamMemberRequest request);
    void delete(Long id);
}
