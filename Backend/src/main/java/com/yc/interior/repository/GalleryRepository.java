package com.yc.interior.repository;

import com.yc.interior.entity.Gallery;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface GalleryRepository extends JpaRepository<Gallery, Long> {

    @Query("SELECT g FROM Gallery g WHERE " +
           "(:keyword IS NULL OR LOWER(g.title) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
           "AND (:featured IS NULL OR g.isFeatured = :featured)")
    Page<Gallery> findAllWithFilters(
        @Param("keyword") String keyword,
        @Param("featured") Boolean featured,
        Pageable pageable
    );

    long countByIsFeaturedTrue();
    long count();
}
