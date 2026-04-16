package com.yc.interior.service;

import com.yc.interior.dto.request.SettingsRequest;
import com.yc.interior.dto.response.SettingsResponse;

public interface SettingsService {
    SettingsResponse get();
    SettingsResponse update(SettingsRequest request);
}
