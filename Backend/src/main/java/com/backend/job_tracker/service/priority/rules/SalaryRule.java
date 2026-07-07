package com.backend.job_tracker.service.priority.rules;

import com.backend.job_tracker.model.Job;
import com.backend.job_tracker.model.UserPreference;
import com.backend.job_tracker.service.priority.PriorityRule;
import org.springframework.stereotype.Component;

@Component
public class SalaryRule implements PriorityRule {
    @Override
    public int evaluate(Job job, UserPreference preference) {
        if (job.getSalary() == null || preference.getExpectedMinimumSalary() == null) {
            return 0;
        }
        if (job.getSalary() >= preference.getExpectedMinimumSalary()) {
            return 15;
        }
        return 0;
    }
}
