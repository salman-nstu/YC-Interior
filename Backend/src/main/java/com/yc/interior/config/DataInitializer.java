package com.yc.interior.config;

import com.yc.interior.entity.Admin;
import com.yc.interior.entity.AboutSection;
import com.yc.interior.repository.AdminRepository;
import com.yc.interior.repository.AboutSectionRepository;
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
    private final AboutSectionRepository aboutSectionRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Initialize admin
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
        
        // Initialize 4 about sections with fixed IDs
        initializeAboutSections();
    }
    
    private void initializeAboutSections() {
        for (int i = 1; i <= 4; i++) {
            if (!aboutSectionRepository.existsById((long) i)) {
                AboutSection section = AboutSection.builder()
                        .description("")
                        .build();
                aboutSectionRepository.save(section);
                log.info("✅ Created about section with ID: {}", i);
            }
        }
        log.info("ℹ️  About sections initialized");
    }
}
