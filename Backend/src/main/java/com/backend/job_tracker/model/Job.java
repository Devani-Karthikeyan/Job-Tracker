package com.backend.job_tracker.model;

import com.backend.job_tracker.enumtype.JobStatus;
import com.backend.job_tracker.enumtype.JobType;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

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

    @Column(name = "title")
    private String jobTitle;

    @Column(name = "company")
    private String companyName;

    private String location;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private JobStatus status;

    @Enumerated(EnumType.STRING)
    @Column(name = "type")
    private JobType jobType;

    private Integer salary;

    @Column(name = "applied_date")
    private LocalDate applicationDate;

    private LocalDate interviewDate;

    private String notes;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
