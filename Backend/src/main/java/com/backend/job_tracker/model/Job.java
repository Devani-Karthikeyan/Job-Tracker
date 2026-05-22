package com.backend.job_tracker.model;

import com.backend.job_tracker.enumtype.JobStatus;
import com.backend.job_tracker.enumtype.JobType;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name="jobs")
public class Job {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String title;

    private String company;

    @Enumerated(EnumType.STRING)
    private JobStatus status;

    @Enumerated(EnumType.STRING)
    private JobType type;

    private LocalDate appliedDate;

    private LocalDate interviewDate;

    private String notes;

}
