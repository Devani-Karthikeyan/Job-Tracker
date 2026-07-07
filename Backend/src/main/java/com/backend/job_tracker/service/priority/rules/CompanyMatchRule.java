package com.backend.job_tracker.service.priority.rules;

import com.backend.job_tracker.model.Job;
import com.backend.job_tracker.model.UserPreference;
import com.backend.job_tracker.service.priority.PriorityRule;
import org.springframework.stereotype.Component;

@Component
public class CompanyMatchRule implements PriorityRule {
    @Override
    public int evaluate(Job job, UserPreference preference) {
        if (job.getCompanyName() == null || preference.getPreferredCompanies() == null || preference.getPreferredCompanies().isEmpty()) {
            return 0;
        }
        for (String company : preference.getPreferredCompanies()) {
            if (job.getCompanyName().trim().equalsIgnoreCase(company.trim())) {
                return 30;
            }
        }
        return 0;
    }
}
