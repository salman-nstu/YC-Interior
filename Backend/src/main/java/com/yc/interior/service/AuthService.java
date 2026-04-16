package com.yc.interior.service;

import com.yc.interior.dto.request.LoginRequest;
import com.yc.interior.dto.response.LoginResponse;

public interface AuthService {
    LoginResponse login(LoginRequest request, String ipAddress);
}
