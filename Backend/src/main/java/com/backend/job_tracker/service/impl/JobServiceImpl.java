package com.backend.job_tracker.service.impl;

import com.backend.job_tracker.dto.request.JobRequestDTO;
import com.backend.job_tracker.dto.response.JobResponseDTO;
import com.backend.job_tracker.model.Job;
import com.backend.job_tracker.model.User;
import com.backend.job_tracker.repository.JobRepository;
import com.backend.job_tracker.repository.UserRepository;
import com.backend.job_tracker.service.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class JobServiceImpl implements JobService {
    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public JobResponseDTO addJob(Long userId, JobRequestDTO jobRequestDTO) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Job job = new Job();
        job.setTitle(jobRequestDTO.getTitle());
        job.setCompany(jobRequestDTO.getCompany());
        job.setStatus(jobRequestDTO.getStatus());
        job.setType(jobRequestDTO.getType());
        job.setAppliedDate(jobRequestDTO.getAppliedDate());
        job.setInterviewDate(jobRequestDTO.getInterviewDate());
        job.setNotes(jobRequestDTO.getNotes());
        job.setUser(user);

        Job savedJob = jobRepository.save(job);

        JobResponseDTO responseDTO = new JobResponseDTO();
        responseDTO.setId(savedJob.getId());
        responseDTO.setTitle(savedJob.getTitle());
        responseDTO.setCompany(savedJob.getCompany());
        responseDTO.setStatus(savedJob.getStatus());
        responseDTO.setType(savedJob.getType());
        responseDTO.setAppliedDate(java.sql.Date.valueOf(savedJob.getAppliedDate()));
        responseDTO.setInterviewDate(java.sql.Date.valueOf(savedJob.getInterviewDate()));
        responseDTO.setNotes(savedJob.getNotes());
        responseDTO.setUserId(savedJob.getUser().getId());

        return responseDTO;
    }

}


