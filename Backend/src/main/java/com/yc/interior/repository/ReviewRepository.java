package com.yc.interior.repository;

import com.yc.interior.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    @Query("SELECT r FROM Review r WHERE " +
           "(:keyword IS NULL OR LOWER(r.name) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
           "AND (:featured IS NULL OR r.isFeatured = :featured)")
    Page<Review> findAllWithFilters(
        @Param("keyword") String keyword,
        @Param("featured") Boolean featured,
        Pageable pageable
    );

    long countByIsFeaturedTrue();
}
