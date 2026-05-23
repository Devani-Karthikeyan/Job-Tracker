package com.backend.job_tracker.controller;

import com.backend.job_tracker.dto.request.JobRequestDTO;
import com.backend.job_tracker.dto.response.JobResponseDTO;
import com.backend.job_tracker.model.Job;
import com.backend.job_tracker.service.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
public class JobController {
    @Autowired
    private JobService jobService;

    @PostMapping("/create")
    public JobResponseDTO addJob(
            @RequestBody JobRequestDTO jobRequestDTO,
            Authentication authentication
    ) {
        String email = authentication.getName();
        return jobService.addJob(email, jobRequestDTO);
    }

    @GetMapping
    public List<JobResponseDTO> getJobs(Authentication authentication) {

        String email = authentication.getName();

        return jobService.getJobsByUser(email);
    }

    @GetMapping("/{jobId}")
    public JobResponseDTO getJobById(
            @PathVariable Long jobId
    ) {
        return jobService.getJobById(jobId);
    }

    @PutMapping("/{jobId}")
    public JobResponseDTO updateJob(@PathVariable Long jobId, @RequestBody JobRequestDTO jobRequestDTO) {
        return jobService.updateJob(jobId, jobRequestDTO);
    }

    @DeleteMapping("/{jobId}")
    public String deleteJob(@PathVariable Long jobId) {
        return jobService.deleteJob(jobId);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Job>> searchJobs(
            @RequestParam String keyword,
            Authentication authentication
    ) {

        String email = authentication.getName();

        return ResponseEntity.ok(
                jobService.searchJobs(keyword, email)
        );
    }
}
