package com.backend.job_tracker.service.priority;

import com.backend.job_tracker.model.Job;
import com.backend.job_tracker.model.UserPreference;

public interface PriorityRule {
    int evaluate(Job job, UserPreference preference);
}
