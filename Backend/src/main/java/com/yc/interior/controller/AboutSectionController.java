package com.yc.interior.controller;

import com.yc.interior.dto.request.AboutSectionRequest;
import com.yc.interior.dto.response.*;
import com.yc.interior.service.AboutSectionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/about")
@RequiredArgsConstructor
@Tag(name = "About Sections", description = "About section content management")
public class AboutSectionController {

    private final AboutSectionService service;

    @GetMapping
    @Operation(summary = "List about sections")
    public ResponseEntity<ApiResponse<PageResponse<AboutSectionResponse>>> getAll(
            @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.ok(PageResponse.from(service.getAll(PageRequest.of(page, size)))));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get about section by ID")
    public ResponseEntity<ApiResponse<AboutSectionResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(service.getById(id)));
    }

    @PostMapping
    @Operation(summary = "Create about section")
    public ResponseEntity<ApiResponse<AboutSectionResponse>> create(@Valid @RequestBody AboutSectionRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Created", service.create(request)));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update about section")
    public ResponseEntity<ApiResponse<AboutSectionResponse>> update(@PathVariable Long id, @Valid @RequestBody AboutSectionRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Updated", service.update(id, request)));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete about section")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.ok("Deleted", null));
    }
}
