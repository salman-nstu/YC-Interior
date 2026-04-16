package com.yc.interior.service.impl;

import com.yc.interior.dto.request.LoginRequest;
import com.yc.interior.dto.response.LoginResponse;
import com.yc.interior.entity.Admin;
import com.yc.interior.exception.BusinessException;
import com.yc.interior.repository.AdminRepository;
import com.yc.interior.security.JwtUtil;
import com.yc.interior.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AdminRepository adminRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    @Override
    public LoginResponse login(LoginRequest request, String ipAddress) {
        Admin admin = adminRepository.findByEmailAndDeletedAtIsNull(request.getEmail())
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));

        if (!admin.getIsActive()) {
            throw new BusinessException("Account is disabled");
        }

        if (admin.getLockedUntil() != null && admin.getLockedUntil().isAfter(LocalDateTime.now())) {
            throw new BusinessException("Account is temporarily locked. Try again later.");
        }

        try {
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
        } catch (BadCredentialsException e) {
            // Increment login attempts
            admin.setLoginAttempts(admin.getLoginAttempts() + 1);
            if (admin.getLoginAttempts() >= 5) {
                admin.setLockedUntil(LocalDateTime.now().plusMinutes(15));
            }
            adminRepository.save(admin);
            throw e;
        }

        // Reset on success
        admin.setLoginAttempts(0);
        admin.setLockedUntil(null);
        admin.setLastLoginAt(LocalDateTime.now());
        admin.setLastLoginIp(ipAddress);
        adminRepository.save(admin);

        String token = jwtUtil.generateToken(admin.getId(), admin.getEmail());

        return LoginResponse.builder()
                .token(token)
                .email(admin.getEmail())
                .name(admin.getName())
                .adminId(admin.getId())
                .avatarMediaId(admin.getAvatarMediaId())
                .build();
    }
}
