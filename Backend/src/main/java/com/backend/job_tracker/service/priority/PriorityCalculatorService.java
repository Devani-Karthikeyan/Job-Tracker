package com.backend.job_tracker.service.priority;

import com.backend.job_tracker.enumtype.PriorityLevel;
import com.backend.job_tracker.model.Job;
import com.backend.job_tracker.model.UserPreference;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PriorityCalculatorService {

    private final List<PriorityRule> rules;

    public void calculateAndSetPriority(Job job, UserPreference preference) {
        if (preference == null) {
            job.setPriorityScore(0);
            job.setPriorityLevel(PriorityLevel.LOW);
            return;
        }

        int totalScore = 0;
        for (PriorityRule rule : rules) {
            totalScore += rule.evaluate(job, preference);
        }

        // Cap at 100
        if (totalScore > 100) {
            totalScore = 100;
        }

        job.setPriorityScore(totalScore);

        if (totalScore >= 80) {
            job.setPriorityLevel(PriorityLevel.HIGH);
        } else if (totalScore >= 40) {
            job.setPriorityLevel(PriorityLevel.MEDIUM);
        } else {
            job.setPriorityLevel(PriorityLevel.LOW);
        }
    }
}
