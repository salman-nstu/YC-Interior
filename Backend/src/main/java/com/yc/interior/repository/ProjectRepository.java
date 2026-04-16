package com.yc.interior.repository;

import com.yc.interior.entity.Project;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {

    @Query("SELECT p FROM Project p WHERE p.deletedAt IS NULL " +
           "AND (:keyword IS NULL OR LOWER(p.title) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
           "AND (:status IS NULL OR p.status = :status) " +
           "AND (:categoryId IS NULL OR p.categoryId = :categoryId) " +
           "AND (:featured IS NULL OR p.isFeatured = :featured)")
    Page<Project> findAllWithFilters(
        @Param("keyword") String keyword,
        @Param("status") Project.ProjectStatus status,
        @Param("categoryId") Long categoryId,
        @Param("featured") Boolean featured,
        Pageable pageable
    );

    long countByDeletedAtIsNull();
    long countByIsFeaturedAndDeletedAtIsNull(Boolean featured);
    long countByStatusAndDeletedAtIsNull(Project.ProjectStatus status);
    long countByIsFeaturedTrue();
    boolean existsBySlugAndDeletedAtIsNull(String slug);
}
