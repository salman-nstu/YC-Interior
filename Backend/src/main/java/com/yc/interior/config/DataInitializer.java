package com.yc.interior.config;

import com.yc.interior.entity.Admin;
import com.yc.interior.repository.AdminRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (!adminRepository.existsByEmail("admin@yc.com")) {
            Admin admin = Admin.builder()
                    .name("Admin")
                    .email("admin@yc.com")
                    .password(passwordEncoder.encode("admin123"))
                    .isActive(true)
                    .loginAttempts(0)
                    .build();
            adminRepository.save(admin);
            log.info("✅ Default admin created — email: admin@yc.com | password: admin123");
        } else {
            log.info("ℹ️  Admin already exists, skipping seed.");
        }
        
        long count = adminRepository.count();
        log.info("ℹ️  Found {} admin(s) in database", count);
    }
}
