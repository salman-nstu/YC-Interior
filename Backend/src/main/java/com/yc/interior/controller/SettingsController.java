package com.yc.interior.controller;

import com.yc.interior.dto.request.SettingsRequest;
import com.yc.interior.dto.response.ApiResponse;
import com.yc.interior.dto.response.SettingsResponse;
import com.yc.interior.service.SettingsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/settings")
@RequiredArgsConstructor
@Tag(name = "Settings", description = "Site settings management")
public class SettingsController {

    private final SettingsService settingsService;

    @GetMapping
    @Operation(summary = "Get site settings")
    public ResponseEntity<ApiResponse<SettingsResponse>> get() {
        return ResponseEntity.ok(ApiResponse.ok(settingsService.get()));
    }

    @PutMapping
    @Operation(summary = "Update site settings")
    public ResponseEntity<ApiResponse<SettingsResponse>> update(@RequestBody SettingsRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Settings updated", settingsService.update(request)));
    }
}
