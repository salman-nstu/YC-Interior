package com.yc.interior.controller;

import com.yc.interior.dto.request.TeamMemberRequest;
import com.yc.interior.dto.response.*;
import com.yc.interior.service.TeamMemberService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/team")
@RequiredArgsConstructor
@Tag(name = "Team Members", description = "Team member management")
public class TeamMemberController {

    private final TeamMemberService service;

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<TeamMemberResponse>>> getAll(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.ok(PageResponse.from(service.getAll(keyword,
                PageRequest.of(page, size, Sort.by("displayOrder").ascending())))));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TeamMemberResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(service.getById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<TeamMemberResponse>> create(@Valid @RequestBody TeamMemberRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Created", service.create(request)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TeamMemberResponse>> update(@PathVariable Long id, @Valid @RequestBody TeamMemberRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Updated", service.update(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.ok("Deleted", null));
    }
}
