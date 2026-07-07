package com.backend.job_tracker.service.priority.rules;

import com.backend.job_tracker.model.Job;
import com.backend.job_tracker.model.UserPreference;
import com.backend.job_tracker.service.priority.PriorityRule;
import org.springframework.stereotype.Component;

@Component
public class EmploymentTypeMatchRule implements PriorityRule {
    @Override
    public int evaluate(Job job, UserPreference preference) {
        if (job.getJobType() == null || preference.getPreferredEmploymentTypes() == null || preference.getPreferredEmploymentTypes().isEmpty()) {
            return 0;
        }
        for (String type : preference.getPreferredEmploymentTypes()) {
            if (job.getJobType().name().equalsIgnoreCase(type)) {
                return 10;
            }
        }
        return 0;
    }
}
