package com.yc.interior.repository;

import com.yc.interior.entity.Media;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface MediaRepository extends JpaRepository<Media, Long> {

    @Query("SELECT m FROM Media m WHERE m.deletedAt IS NULL " +
           "AND (:category IS NULL OR m.category = :category) " +
           "AND (:subCategory IS NULL OR m.subCategory = :subCategory)")
    Page<Media> findAllActive(
        @Param("category") Media.MediaCategory category,
        @Param("subCategory") String subCategory,
        Pageable pageable
    );

    Optional<Media> findByIdAndDeletedAtIsNull(Long id);
    boolean existsByIdAndDeletedAtIsNull(Long id);
}
