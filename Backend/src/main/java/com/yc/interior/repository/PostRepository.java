package com.yc.interior.repository;

import com.yc.interior.entity.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

    @Query("SELECT p FROM Post p WHERE " +
           "(:keyword IS NULL OR LOWER(p.title) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
           "AND (:status IS NULL OR p.status = :status) " +
           "AND (:categoryId IS NULL OR p.categoryId = :categoryId)")
    Page<Post> findAllWithFilters(
        @Param("keyword") String keyword,
        @Param("status") Post.PostStatus status,
        @Param("categoryId") Long categoryId,
        Pageable pageable
    );

    boolean existsBySlug(String slug);
}
