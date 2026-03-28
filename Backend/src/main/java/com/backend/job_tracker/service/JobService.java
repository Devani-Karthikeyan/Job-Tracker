package com.backend.job_tracker.service;

import com.backend.job_tracker.dto.request.JobRequestDTO;
import com.backend.job_tracker.dto.response.JobResponseDTO;

public interface JobService {

    JobResponseDTO addJob(Long userId, JobRequestDTO jobRequestDTO);

}
