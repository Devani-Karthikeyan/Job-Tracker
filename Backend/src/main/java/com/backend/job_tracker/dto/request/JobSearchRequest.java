package com.backend.job_tracker.dto.request;

import com.backend.job_tracker.enumtype.JobStatus;
import com.backend.job_tracker.enumtype.JobType;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

@Data
public class JobSearchRequest {
    private String keyword;
    private JobStatus status;
    private JobType jobType;
    private Integer salaryMin;
    private Integer salaryMax;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate applicationDateFrom;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate applicationDateTo;

    private String sortBy = "applicationDate"; // default sorting field
    private String sortDirection = "desc";      // default sorting direction (descending = newest first)
    private Integer page = 0;
    private Integer size = 10;
}
