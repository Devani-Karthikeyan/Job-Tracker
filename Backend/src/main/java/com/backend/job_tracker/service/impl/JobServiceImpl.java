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

import java.util.List;
import java.util.stream.Collectors;

@Service
public class JobServiceImpl implements JobService {
    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public JobResponseDTO addJob(String email, JobRequestDTO jobRequestDTO) {

        User user = userRepository.findByEmail(email)
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

        return mapToResponseDTO(savedJob);
    }

    private JobResponseDTO mapToResponseDTO(Job job){
        JobResponseDTO responseDTO = new JobResponseDTO();
        responseDTO.setId(job.getId());
        responseDTO.setTitle(job.getTitle());
        responseDTO.setCompany(job.getCompany());
        responseDTO.setStatus(job.getStatus());
        responseDTO.setType(job.getType());
        responseDTO.setAppliedDate(java.sql.Date.valueOf(job.getAppliedDate()));
        responseDTO.setInterviewDate(java.sql.Date.valueOf(job.getInterviewDate()));
        responseDTO.setNotes(job.getNotes());
        responseDTO.setUserId(job.getUser().getId());

        return responseDTO;

    }

    @Override
    public List<JobResponseDTO> getJobsByUser(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Job> jobs = jobRepository.findByUserId(user.getId());

        return jobs.stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public JobResponseDTO getJobById(Long jobId) {

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() ->
                        new RuntimeException("Job not found"));

        return mapToResponseDTO(job);
    }
    @Override
    public JobResponseDTO updateJob(Long jobId, JobRequestDTO jobRequestDTO) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(()-> new RuntimeException("Job not Found"));

        job.setTitle(jobRequestDTO.getTitle());
        job.setCompany(jobRequestDTO.getCompany());
        job.setStatus(jobRequestDTO.getStatus());
        job.setType(jobRequestDTO.getType());
        job.setAppliedDate(jobRequestDTO.getAppliedDate());
        job.setInterviewDate(jobRequestDTO.getInterviewDate());
        job.setNotes(jobRequestDTO.getNotes());

        Job updateJob = jobRepository.save(job);

        return mapToResponseDTO(updateJob);
    }

    @Override
    public String deleteJob(Long jobId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(()->new RuntimeException("Job not Found"));
        jobRepository.delete(job);
        return "Job deleted successfully";
    }

    @Override
    public List<Job> searchJobs(String keyword, String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        return jobRepository.searchJobs(keyword, user.getId());
    }

}


