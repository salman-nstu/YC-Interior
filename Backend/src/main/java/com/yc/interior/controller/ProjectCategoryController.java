package com.yc.interior.controller;

import com.yc.interior.dto.request.ProjectCategoryRequest;
import com.yc.interior.dto.response.*;
import com.yc.interior.service.ProjectCategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/project-categories")
@RequiredArgsConstructor
@Tag(name = "Project Categories", description = "Project category management")
public class ProjectCategoryController {

    private final ProjectCategoryService service;

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<ProjectCategoryResponse>>> getAll(
            @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ApiResponse.ok(PageResponse.from(service.getAll(PageRequest.of(page, size)))));
    }

    @GetMapping("/list")
    @Operation(summary = "Get all categories as list (no pagination)")
    public ResponseEntity<ApiResponse<List<ProjectCategoryResponse>>> getAllList() {
        return ResponseEntity.ok(ApiResponse.ok(service.getAllList()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProjectCategoryResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(service.getById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ProjectCategoryResponse>> create(@Valid @RequestBody ProjectCategoryRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Category created", service.create(request)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ProjectCategoryResponse>> update(@PathVariable Long id, @Valid @RequestBody ProjectCategoryRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Category updated", service.update(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.ok("Category deleted", null));
    }
}
