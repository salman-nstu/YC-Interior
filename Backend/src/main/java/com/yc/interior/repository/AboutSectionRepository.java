package com.yc.interior.repository;

import com.yc.interior.entity.AboutSection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AboutSectionRepository extends JpaRepository<AboutSection, Long> {
}
