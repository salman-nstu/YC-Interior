package com.yc.interior.service.impl;

import com.yc.interior.dto.request.LoginRequest;
import com.yc.interior.dto.response.LoginResponse;
import com.yc.interior.entity.Admin;
import com.yc.interior.exception.BusinessException;
import com.yc.interior.repository.AdminRepository;
import com.yc.interior.security.JwtUtil;
import com.yc.interior.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AdminRepository adminRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    @Override
    public LoginResponse login(LoginRequest request, String ipAddress) {
        // 1. Find admin by email
        Admin admin = adminRepository.findByEmailAndDeletedAtIsNull(request.getEmail())
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));

        // 2. Check active
        if (!Boolean.TRUE.equals(admin.getIsActive())) {
            throw new BusinessException("Account is disabled");
        }

        // 3. Check lock
        if (admin.getLockedUntil() != null && admin.getLockedUntil().isAfter(LocalDateTime.now())) {
            throw new BusinessException("Account is temporarily locked. Try again later.");
        }

        // 4. Verify password directly with BCrypt
        if (!passwordEncoder.matches(request.getPassword(), admin.getPassword())) {
            int attempts = admin.getLoginAttempts() == null ? 0 : admin.getLoginAttempts();
            attempts++;
            admin.setLoginAttempts(attempts);
            
            // Progressive lockout: 5 attempts = 15 min, 10 attempts = 1 hour, 15+ = 24 hours
            if (attempts >= 15) {
                admin.setLockedUntil(LocalDateTime.now().plusHours(24));
                log.warn("Admin account locked for 24 hours after {} failed attempts: {}", attempts, admin.getEmail());
            } else if (attempts >= 10) {
                admin.setLockedUntil(LocalDateTime.now().plusHours(1));
                log.warn("Admin account locked for 1 hour after {} failed attempts: {}", attempts, admin.getEmail());
            } else if (attempts >= 5) {
                admin.setLockedUntil(LocalDateTime.now().plusMinutes(15));
                log.warn("Admin account locked for 15 minutes after {} failed attempts: {}", attempts, admin.getEmail());
            }
            
            adminRepository.save(admin);
            throw new BadCredentialsException("Invalid email or password");
        }

        // 5. Reset on success
        admin.setLoginAttempts(0);
        admin.setLockedUntil(null);
        admin.setLastLoginAt(LocalDateTime.now());
        admin.setLastLoginIp(ipAddress);
        adminRepository.save(admin);

        String token = jwtUtil.generateToken(admin.getId(), admin.getEmail());
        log.info("Admin logged in: {}", admin.getEmail());

        return LoginResponse.builder()
                .token(token)
                .email(admin.getEmail())
                .name(admin.getName())
                .adminId(admin.getId())
                .avatarMediaId(admin.getAvatarMediaId())
                .build();
    }
}
