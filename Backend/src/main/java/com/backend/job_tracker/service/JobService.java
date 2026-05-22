package com.backend.job_tracker.service;

import com.backend.job_tracker.dto.request.JobRequestDTO;
import com.backend.job_tracker.dto.response.JobResponseDTO;
import com.backend.job_tracker.model.Job;

import java.util.List;

public interface JobService {

    JobResponseDTO addJob(Long userId, JobRequestDTO jobRequestDTO);

    List<JobResponseDTO> getJobsByUserId(Long userId);

    JobResponseDTO updateJob(Long jobId, JobRequestDTO jobRequestDTO);

    String deleteJob(Long jobId);

    List<Job> searchJobs(String keyword, String email);
}
