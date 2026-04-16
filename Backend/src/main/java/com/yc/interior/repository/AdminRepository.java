package com.yc.interior.repository;

import com.yc.interior.entity.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface AdminRepository extends JpaRepository<Admin, Long> {
    Optional<Admin> findByEmailAndDeletedAtIsNull(String email);
    Optional<Admin> findByEmail(String email);
    boolean existsByEmail(String email);
}
