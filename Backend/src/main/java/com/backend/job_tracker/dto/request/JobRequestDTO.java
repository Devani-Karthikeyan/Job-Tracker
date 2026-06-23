package com.backend.job_tracker.dto.request;

import com.backend.job_tracker.enumtype.JobStatus;
import com.backend.job_tracker.enumtype.JobType;
import lombok.Data;

import java.time.LocalDate;

@Data
public class JobRequestDTO {
    private String jobTitle;
    private String companyName;
    private String location;
    private JobStatus status;
    private JobType jobType;
    private Integer salary;
    private LocalDate applicationDate;
    private LocalDate interviewDate;
    private String notes;
    private Long userId;
}
