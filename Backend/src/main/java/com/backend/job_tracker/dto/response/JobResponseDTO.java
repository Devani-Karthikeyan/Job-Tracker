package com.backend.job_tracker.dto.response;

import com.backend.job_tracker.enumtype.JobStatus;
import com.backend.job_tracker.enumtype.JobType;
import lombok.Data;

import java.sql.Date;
@Data
public class JobResponseDTO {
    private Long id;
    private String title;
    private String company;
    private JobStatus status;
    private JobType type;
    private Date appliedDate;
    private Date interviewDate;
    private String notes;
    private Long userId;
}
