package com.backend.job_tracker.service.priority.rules;

import com.backend.job_tracker.model.Job;
import com.backend.job_tracker.model.UserPreference;
import com.backend.job_tracker.service.priority.PriorityRule;
import org.springframework.stereotype.Component;

@Component
public class LocationMatchRule implements PriorityRule {
    @Override
    public int evaluate(Job job, UserPreference preference) {
        if (job.getLocation() == null || preference.getPreferredLocations() == null || preference.getPreferredLocations().isEmpty()) {
            return 0;
        }
        for (String loc : preference.getPreferredLocations()) {
            if (job.getLocation().toLowerCase().contains(loc.toLowerCase())) {
                return 20;
            }
        }
        return 0;
    }
}
