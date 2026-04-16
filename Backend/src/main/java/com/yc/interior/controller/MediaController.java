package com.yc.interior.controller;

import com.yc.interior.dto.response.ApiResponse;
import com.yc.interior.dto.response.MediaResponse;
import com.yc.interior.dto.response.PageResponse;
import com.yc.interior.security.JwtUtil;
import com.yc.interior.service.MediaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/media")
@RequiredArgsConstructor
@Tag(name = "Media", description = "Centralized media management")
public class MediaController {

    private final MediaService mediaService;
    private final JwtUtil jwtUtil;

    @PostMapping("/upload")
    @Operation(summary = "Upload a media file")
    public ResponseEntity<ApiResponse<MediaResponse>> upload(
            @RequestParam("file") MultipartFile file,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String subCategory,
            @RequestParam(required = false) String altText,
            HttpServletRequest request) {
        Long adminId = extractAdminId(request);
        return ResponseEntity.ok(ApiResponse.ok("File uploaded successfully",
                mediaService.upload(file, category, subCategory, altText, adminId)));
    }

    @GetMapping
    @Operation(summary = "List all media with optional filters")
    public ResponseEntity<ApiResponse<PageResponse<MediaResponse>>> getAll(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String subCategory,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Page<MediaResponse> result = mediaService.getAll(category, subCategory,
                PageRequest.of(page, size, Sort.by("createdAt").descending()));
        return ResponseEntity.ok(ApiResponse.ok(PageResponse.from(result)));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get media by ID")
    public ResponseEntity<ApiResponse<MediaResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(mediaService.getById(id)));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Soft delete a media file")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        mediaService.delete(id);
        return ResponseEntity.ok(ApiResponse.ok("Media deleted", null));
    }

    private Long extractAdminId(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            return jwtUtil.extractAdminId(header.substring(7));
        }
        return null;
    }
}
