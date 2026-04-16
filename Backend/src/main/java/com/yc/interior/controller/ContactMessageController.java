package com.yc.interior.controller;

import com.yc.interior.dto.response.*;
import com.yc.interior.service.ContactMessageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contact-messages")
@RequiredArgsConstructor
@Tag(name = "Contact Messages", description = "Incoming contact form messages — read and delete only")
public class ContactMessageController {

    private final ContactMessageService service;

    @GetMapping
    @Operation(summary = "List contact messages")
    public ResponseEntity<ApiResponse<PageResponse<ContactMessageResponse>>> getAll(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Boolean isRead,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.ok(PageResponse.from(service.getAll(keyword, isRead,
                PageRequest.of(page, size, Sort.by("createdAt").descending())))));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ContactMessageResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(service.getById(id)));
    }

    @PatchMapping("/{id}/read")
    @Operation(summary = "Mark a message as read")
    public ResponseEntity<ApiResponse<ContactMessageResponse>> markAsRead(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok("Marked as read", service.markAsRead(id)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.ok("Deleted", null));
    }
}
