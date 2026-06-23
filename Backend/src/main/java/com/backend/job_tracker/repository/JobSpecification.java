package com.backend.job_tracker.repository;

import com.backend.job_tracker.enumtype.JobStatus;
import com.backend.job_tracker.enumtype.JobType;
import com.backend.job_tracker.model.Job;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class JobSpecification {

    public static Specification<Job> filterJobs(
            String keyword,
            JobStatus status,
            JobType jobType,
            Integer salaryMin,
            Integer salaryMax,
            LocalDate applicationDateFrom,
            LocalDate applicationDateTo,
            Long userId
    ) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            // 1. Ownership Filter (CRITICAL: Users must only see their own jobs)
            predicates.add(criteriaBuilder.equal(root.get("user").get("id"), userId));

            // 2. Keyword Search (ignores case, partial matching across companyName, jobTitle, location, notes)
            if (keyword != null && !keyword.trim().isEmpty()) {
                String pattern = "%" + keyword.trim().toLowerCase() + "%";
                Predicate companyNamePred = criteriaBuilder.like(criteriaBuilder.lower(root.get("companyName")), pattern);
                Predicate jobTitlePred = criteriaBuilder.like(criteriaBuilder.lower(root.get("jobTitle")), pattern);
                
                // Location and notes can be null in the DB, so we handle null check safely or use lower() directly
                Predicate locationPred = criteriaBuilder.like(criteriaBuilder.lower(root.get("location")), pattern);
                Predicate notesPred = criteriaBuilder.like(criteriaBuilder.lower(root.get("notes")), pattern);

                predicates.add(criteriaBuilder.or(companyNamePred, jobTitlePred, locationPred, notesPred));
            }

            // 3. Status Filter
            if (status != null) {
                predicates.add(criteriaBuilder.equal(root.get("status"), status));
            }

            // 4. Job Type Filter
            if (jobType != null) {
                predicates.add(criteriaBuilder.equal(root.get("jobType"), jobType));
            }

            // 5. Salary Range Filters
            if (salaryMin != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("salary"), salaryMin));
            }
            if (salaryMax != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("salary"), salaryMax));
            }

            // 6. Application Date Range Filters
            if (applicationDateFrom != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("applicationDate"), applicationDateFrom));
            }
            if (applicationDateTo != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("applicationDate"), applicationDateTo));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
