package com.yc.interior.repository;

import com.yc.interior.entity.Faq;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface FaqRepository extends JpaRepository<Faq, Long> {

    @Query("SELECT f FROM Faq f WHERE " +
           "(:keyword IS NULL OR LOWER(f.question) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Faq> findAllWithFilter(@Param("keyword") String keyword, Pageable pageable);
}
