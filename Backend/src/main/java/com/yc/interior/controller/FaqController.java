package com.yc.interior.controller;

import com.yc.interior.dto.request.FaqRequest;
import com.yc.interior.dto.response.*;
import com.yc.interior.service.FaqService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/faqs")
@RequiredArgsConstructor
@Tag(name = "FAQs", description = "Frequently asked questions management")
public class FaqController {

    private final FaqService service;

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<FaqResponse>>> getAll(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.ok(PageResponse.from(service.getAll(keyword,
                PageRequest.of(page, size, Sort.by("displayOrder").ascending())))));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<FaqResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(service.getById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<FaqResponse>> create(@Valid @RequestBody FaqRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Created", service.create(request)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<FaqResponse>> update(@PathVariable Long id, @Valid @RequestBody FaqRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Updated", service.update(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.ok("Deleted", null));
    }
}
