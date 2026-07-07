package com.backend.job_tracker.dto;

import lombok.Data;
import java.util.Set;

@Data
public class UserPreferenceDto {
    private Set<String> preferredCompanies;
    private Set<String> preferredLocations;
    private Set<String> preferredWorkTypes;
    private Set<String> preferredEmploymentTypes;
    private Integer expectedMinimumSalary;
    private Set<String> preferredIndustries;
    private Set<String> skills;
}
