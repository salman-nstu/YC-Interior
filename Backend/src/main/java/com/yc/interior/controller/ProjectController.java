package com.yc.interior.controller;

import com.yc.interior.dto.request.ProjectRequest;
import com.yc.interior.dto.response.*;
import com.yc.interior.service.ProjectService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
@Tag(name = "Projects", description = "Portfolio project management with featured logic")
public class ProjectController {

    private final ProjectService service;

    @GetMapping
    @Operation(summary = "List projects with filters")
    public ResponseEntity<ApiResponse<PageResponse<ProjectResponse>>> getAll(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String categoryType,
            @RequestParam(required = false) Boolean featured,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.ok(PageResponse.from(service.getAll(keyword, status, categoryType, featured,
                PageRequest.of(page, size, Sort.by("createdAt").descending())))));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProjectResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(service.getById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ProjectResponse>> create(@Valid @RequestBody ProjectRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Project created", service.create(request)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ProjectResponse>> update(@PathVariable Long id, @Valid @RequestBody ProjectRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Project updated", service.update(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.ok("Project deleted", null));
    }

    @GetMapping("/featured")
    @Operation(summary = "Get featured projects for homepage")
    public ResponseEntity<ApiResponse<PageResponse<ProjectResponse>>> getFeatured(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "4") int size) {
        return ResponseEntity.ok(ApiResponse.ok(PageResponse.from(service.getAll(null, "published", null, true,
                PageRequest.of(page, size, Sort.by("displayOrder").ascending().and(Sort.by("createdAt").descending()))))));
    }

    @PatchMapping("/{id}/featured")
    @Operation(summary = "Set featured status for a project")
    public ResponseEntity<ApiResponse<ProjectResponse>> setFeatured(
            @PathVariable Long id,
            @RequestParam Boolean featured,
            @RequestParam(required = false) Integer displayOrder) {
        return ResponseEntity.ok(ApiResponse.ok("Featured status updated", service.setFeatured(id, featured, displayOrder)));
    }
}
