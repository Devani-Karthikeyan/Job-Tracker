package com.backend.job_tracker.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name="user_preferences")
public class UserPreference {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonBackReference
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @ElementCollection
    @CollectionTable(name = "user_pref_companies", joinColumns = @JoinColumn(name = "user_pref_id"))
    @Column(name = "company")
    private Set<String> preferredCompanies = new HashSet<>();

    @ElementCollection
    @CollectionTable(name = "user_pref_locations", joinColumns = @JoinColumn(name = "user_pref_id"))
    @Column(name = "location")
    private Set<String> preferredLocations = new HashSet<>();

    @ElementCollection
    @CollectionTable(name = "user_pref_work_types", joinColumns = @JoinColumn(name = "user_pref_id"))
    @Column(name = "work_type")
    private Set<String> preferredWorkTypes = new HashSet<>();

    @ElementCollection
    @CollectionTable(name = "user_pref_employment_types", joinColumns = @JoinColumn(name = "user_pref_id"))
    @Column(name = "employment_type")
    private Set<String> preferredEmploymentTypes = new HashSet<>();

    @Column(name = "expected_min_salary")
    private Integer expectedMinimumSalary;

    @ElementCollection
    @CollectionTable(name = "user_pref_industries", joinColumns = @JoinColumn(name = "user_pref_id"))
    @Column(name = "industry")
    private Set<String> preferredIndustries = new HashSet<>();

    @ElementCollection
    @CollectionTable(name = "user_pref_skills", joinColumns = @JoinColumn(name = "user_pref_id"))
    @Column(name = "skill")
    private Set<String> skills = new HashSet<>();

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
