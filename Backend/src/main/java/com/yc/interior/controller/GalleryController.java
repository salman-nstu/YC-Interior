package com.yc.interior.controller;

import com.yc.interior.dto.request.GalleryRequest;
import com.yc.interior.dto.response.*;
import com.yc.interior.service.GalleryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/gallery")
@RequiredArgsConstructor
@Tag(name = "Gallery", description = "Gallery management with featured logic")
public class GalleryController {

    private final GalleryService service;

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<GalleryResponse>>> getAll(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Boolean featured,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        return ResponseEntity.ok(ApiResponse.ok(PageResponse.from(service.getAll(keyword, featured,
                PageRequest.of(page, size, Sort.by("displayOrder").ascending())))));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<GalleryResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(service.getById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<GalleryResponse>> create(@Valid @RequestBody GalleryRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Gallery item created", service.create(request)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<GalleryResponse>> update(@PathVariable Long id, @Valid @RequestBody GalleryRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Gallery item updated", service.update(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.ok("Deleted", null));
    }

    @PatchMapping("/{id}/featured")
    @Operation(summary = "Set featured status for gallery item")
    public ResponseEntity<ApiResponse<GalleryResponse>> setFeatured(
            @PathVariable Long id,
            @RequestParam Boolean featured,
            @RequestParam(required = false) Integer displayOrder) {
        return ResponseEntity.ok(ApiResponse.ok("Updated", service.setFeatured(id, featured, displayOrder)));
    }
}
