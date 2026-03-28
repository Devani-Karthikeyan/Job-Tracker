package com.backend.job_tracker.dto.request;

import com.backend.job_tracker.enumtype.JobStatus;
import com.backend.job_tracker.enumtype.JobType;
import lombok.Data;

import java.time.LocalDate;

@Data
public class JobRequestDTO {
    private String title;
    private String company;
    private JobStatus status;
    private JobType type;
    private LocalDate appliedDate;
    private LocalDate interviewDate;
    private String notes;

}
