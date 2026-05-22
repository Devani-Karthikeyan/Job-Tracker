package com.backend.job_tracker.repository;

import com.backend.job_tracker.model.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface JobRepository extends JpaRepository<Job,Long> {
    List<Job> findByUserId(Long userId);

    @Query("""
    SELECT j FROM Job j
    WHERE j.user.id = :userId
    AND (
        LOWER(j.type) LIKE LOWER(CONCAT('%', :keyword, '%'))
        OR LOWER(j.company) LIKE LOWER(CONCAT('%', :keyword, '%'))
    )
""")
    List<Job> searchJobs(
            @Param("keyword") String keyword,
            @Param("userId") Long userId
    );
}
