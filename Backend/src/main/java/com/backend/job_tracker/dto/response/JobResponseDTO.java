package com.backend.job_tracker.dto.response;

import com.backend.job_tracker.enumtype.JobStatus;
import com.backend.job_tracker.enumtype.JobType;
import com.backend.job_tracker.enumtype.PriorityLevel;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class JobResponseDTO {
    private Long id;
    private String jobTitle;
    private String companyName;
    private String location;
    private JobStatus status;
    private JobType jobType;
    private Integer salary;
    private LocalDate applicationDate;
    private LocalDate interviewDate;
    private LocalDate reminderDate;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long userId;
    private Integer priorityScore;
    private PriorityLevel priorityLevel;
}

