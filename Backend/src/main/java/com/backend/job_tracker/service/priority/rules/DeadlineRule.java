package com.backend.job_tracker.service.priority.rules;

import com.backend.job_tracker.model.Job;
import com.backend.job_tracker.model.UserPreference;
import com.backend.job_tracker.service.priority.PriorityRule;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

@Component
public class DeadlineRule implements PriorityRule {
    @Override
    public int evaluate(Job job, UserPreference preference) {
        // We use reminderDate as a proxy for application deadline or next important date
        if (job.getReminderDate() == null) {
            return 0;
        }
        LocalDate now = LocalDate.now();
        long daysBetween = ChronoUnit.DAYS.between(now, job.getReminderDate());
        
        if (daysBetween >= 0 && daysBetween <= 7) {
            return 10;
        }
        return 0;
    }
}
