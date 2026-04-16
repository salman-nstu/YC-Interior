package com.yc.interior.controller;

import com.yc.interior.dto.request.PostCategoryRequest;
import com.yc.interior.dto.response.*;
import com.yc.interior.service.PostCategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/post-categories")
@RequiredArgsConstructor
@Tag(name = "Post Categories", description = "News & Events category management")
public class PostCategoryController {

    private final PostCategoryService service;

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<PostCategoryResponse>>> getAll(
            @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ApiResponse.ok(PageResponse.from(service.getAll(PageRequest.of(page, size)))));
    }

    @GetMapping("/list")
    @Operation(summary = "Get all post categories as list")
    public ResponseEntity<ApiResponse<List<PostCategoryResponse>>> getAllList() {
        return ResponseEntity.ok(ApiResponse.ok(service.getAllList()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PostCategoryResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(service.getById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<PostCategoryResponse>> create(@Valid @RequestBody PostCategoryRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Created", service.create(request)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<PostCategoryResponse>> update(@PathVariable Long id, @Valid @RequestBody PostCategoryRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Updated", service.update(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.ok("Deleted", null));
    }
}
