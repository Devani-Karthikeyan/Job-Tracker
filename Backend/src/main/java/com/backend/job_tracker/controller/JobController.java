package com.backend.job_tracker.controller;

import com.backend.job_tracker.dto.request.JobRequestDTO;
import com.backend.job_tracker.dto.response.JobResponseDTO;
import com.backend.job_tracker.service.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/jobs")
public class JobController {
    @Autowired
    private JobService jobService;

    @PostMapping("/create/{userId}")
    public JobResponseDTO addJob(@PathVariable Long userId,
            @RequestBody JobRequestDTO jobRequestDTO){
        return jobService.addJob(userId,jobRequestDTO);
    }
}
