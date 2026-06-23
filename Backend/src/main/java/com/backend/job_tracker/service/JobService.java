package com.backend.job_tracker.service;

import com.backend.job_tracker.dto.request.JobRequestDTO;
import com.backend.job_tracker.dto.request.JobSearchRequest;
import com.backend.job_tracker.dto.response.JobResponseDTO;
import org.springframework.data.domain.Page;

import java.util.List;

public interface JobService {

    JobResponseDTO addJob(String email, JobRequestDTO jobRequestDTO);

    List<JobResponseDTO> getJobsByUser(String email);

    JobResponseDTO getJobById(Long jobId);

    JobResponseDTO updateJob(Long jobId, JobRequestDTO jobRequestDTO);

    String deleteJob(Long jobId);

    Page<JobResponseDTO> getJobs(String email, JobSearchRequest searchRequest);
}
