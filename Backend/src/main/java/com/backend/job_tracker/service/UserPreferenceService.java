package com.backend.job_tracker.service;

import com.backend.job_tracker.dto.UserPreferenceDto;
import com.backend.job_tracker.model.User;
import com.backend.job_tracker.model.UserPreference;
import com.backend.job_tracker.model.Job;
import com.backend.job_tracker.repository.UserPreferenceRepository;
import com.backend.job_tracker.repository.UserRepository;
import com.backend.job_tracker.repository.JobRepository;
import com.backend.job_tracker.service.priority.PriorityCalculatorService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserPreferenceService {

    private final UserPreferenceRepository userPreferenceRepository;
    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final PriorityCalculatorService priorityCalculatorService;


    public UserPreferenceDto getPreferences(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Optional<UserPreference> prefOpt = userPreferenceRepository.findByUserId(user.getId());
        if (prefOpt.isPresent()) {
            return mapToDto(prefOpt.get());
        }
        return new UserPreferenceDto();
    }

    public UserPreferenceDto updatePreferences(String email, UserPreferenceDto dto) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserPreference preference = userPreferenceRepository.findByUserId(user.getId())
                .orElse(new UserPreference());
        
        preference.setUser(user);
        preference.setPreferredCompanies(dto.getPreferredCompanies());
        preference.setPreferredLocations(dto.getPreferredLocations());
        preference.setPreferredWorkTypes(dto.getPreferredWorkTypes());
        preference.setPreferredEmploymentTypes(dto.getPreferredEmploymentTypes());
        preference.setExpectedMinimumSalary(dto.getExpectedMinimumSalary());
        preference.setPreferredIndustries(dto.getPreferredIndustries());
        preference.setSkills(dto.getSkills());

        UserPreference saved = userPreferenceRepository.save(preference);

        // Recalculate priority for all existing jobs of this user
        java.util.List<Job> userJobs = jobRepository.findByUserId(user.getId());
        for (Job job : userJobs) {
            priorityCalculatorService.calculateAndSetPriority(job, saved);
        }
        if (!userJobs.isEmpty()) {
            jobRepository.saveAll(userJobs);
        }

        return mapToDto(saved);
    }

    private UserPreferenceDto mapToDto(UserPreference pref) {
        UserPreferenceDto dto = new UserPreferenceDto();
        dto.setPreferredCompanies(pref.getPreferredCompanies());
        dto.setPreferredLocations(pref.getPreferredLocations());
        dto.setPreferredWorkTypes(pref.getPreferredWorkTypes());
        dto.setPreferredEmploymentTypes(pref.getPreferredEmploymentTypes());
        dto.setExpectedMinimumSalary(pref.getExpectedMinimumSalary());
        dto.setPreferredIndustries(pref.getPreferredIndustries());
        dto.setSkills(pref.getSkills());
        return dto;
    }
}
