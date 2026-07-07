package com.backend.job_tracker.service.priority.rules;

import com.backend.job_tracker.model.Job;
import com.backend.job_tracker.model.UserPreference;
import com.backend.job_tracker.service.priority.PriorityRule;
import org.springframework.stereotype.Component;

@Component
public class WorkTypeMatchRule implements PriorityRule {
    @Override
    public int evaluate(Job job, UserPreference preference) {
        // Assume jobType in Job refers to something like Remote/Hybrid/On-site or similar
        // Adjust if jobType enum means something else (like FULL_TIME)
        if (job.getJobType() == null || preference.getPreferredWorkTypes() == null || preference.getPreferredWorkTypes().isEmpty()) {
            return 0;
        }
        for (String type : preference.getPreferredWorkTypes()) {
            if (job.getJobType().name().equalsIgnoreCase(type)) {
                return 15;
            }
        }
        return 0;
    }
}
