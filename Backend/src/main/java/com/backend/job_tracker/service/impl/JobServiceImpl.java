package com.backend.job_tracker.service.impl;

import com.backend.job_tracker.dto.request.JobRequestDTO;
import com.backend.job_tracker.dto.request.JobSearchRequest;
import com.backend.job_tracker.dto.response.JobResponseDTO;
import com.backend.job_tracker.model.Job;
import com.backend.job_tracker.model.User;
import com.backend.job_tracker.repository.JobRepository;
import com.backend.job_tracker.repository.JobSpecification;
import com.backend.job_tracker.repository.UserRepository;
import com.backend.job_tracker.service.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
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
        job.setJobTitle(jobRequestDTO.getJobTitle());
        job.setCompanyName(jobRequestDTO.getCompanyName());
        job.setLocation(jobRequestDTO.getLocation());
        job.setStatus(jobRequestDTO.getStatus());
        job.setJobType(jobRequestDTO.getJobType());
        job.setSalary(jobRequestDTO.getSalary());
        job.setApplicationDate(jobRequestDTO.getApplicationDate());
        job.setInterviewDate(jobRequestDTO.getInterviewDate());
        job.setNotes(jobRequestDTO.getNotes());
        job.setUser(user);

        Job savedJob = jobRepository.save(job);
        return mapToResponseDTO(savedJob);
    }

    private JobResponseDTO mapToResponseDTO(Job job) {
        JobResponseDTO responseDTO = new JobResponseDTO();
        responseDTO.setId(job.getId());
        responseDTO.setJobTitle(job.getJobTitle());
        responseDTO.setCompanyName(job.getCompanyName());
        responseDTO.setLocation(job.getLocation());
        responseDTO.setStatus(job.getStatus());
        responseDTO.setJobType(job.getJobType());
        responseDTO.setSalary(job.getSalary());
        responseDTO.setApplicationDate(job.getApplicationDate());
        responseDTO.setInterviewDate(job.getInterviewDate());
        responseDTO.setNotes(job.getNotes());
        responseDTO.setCreatedAt(job.getCreatedAt());
        responseDTO.setUpdatedAt(job.getUpdatedAt());
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
                .orElseThrow(() -> new RuntimeException("Job not found"));
        return mapToResponseDTO(job);
    }

    @Override
    public JobResponseDTO updateJob(Long jobId, JobRequestDTO jobRequestDTO) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not Found"));

        job.setJobTitle(jobRequestDTO.getJobTitle());
        job.setCompanyName(jobRequestDTO.getCompanyName());
        job.setLocation(jobRequestDTO.getLocation());
        job.setStatus(jobRequestDTO.getStatus());
        job.setJobType(jobRequestDTO.getJobType());
        job.setSalary(jobRequestDTO.getSalary());
        job.setApplicationDate(jobRequestDTO.getApplicationDate());
        job.setInterviewDate(jobRequestDTO.getInterviewDate());
        job.setNotes(jobRequestDTO.getNotes());

        Job updateJob = jobRepository.save(job);
        return mapToResponseDTO(updateJob);
    }

    @Override
    public String deleteJob(Long jobId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not Found"));
        jobRepository.delete(job);
        return "Job deleted successfully";
    }

    @Override
    public Page<JobResponseDTO> getJobs(String email, JobSearchRequest searchRequest) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Build Sort parameters
        String sortBy = searchRequest.getSortBy();
        if (sortBy == null || sortBy.isEmpty()) {
            sortBy = "applicationDate";
        }
        
        // Map conceptual sorting parameters from UI/DTO to entity properties
        if ("companyName".equalsIgnoreCase(sortBy)) {
            sortBy = "companyName";
        } else if ("jobTitle".equalsIgnoreCase(sortBy)) {
            sortBy = "jobTitle";
        } else if ("salary".equalsIgnoreCase(sortBy)) {
            sortBy = "salary";
        } else if ("status".equalsIgnoreCase(sortBy)) {
            sortBy = "status";
        } else {
            sortBy = "applicationDate"; // fallback
        }

        Sort.Direction direction = Sort.Direction.DESC;
        if ("asc".equalsIgnoreCase(searchRequest.getSortDirection())) {
            direction = Sort.Direction.ASC;
        }

        Sort sort = Sort.by(direction, sortBy);
        Pageable pageable = PageRequest.of(searchRequest.getPage(), searchRequest.getSize(), sort);

        // Build specifications
        Specification<Job> spec = JobSpecification.filterJobs(
                searchRequest.getKeyword(),
                searchRequest.getStatus(),
                searchRequest.getJobType(),
                searchRequest.getSalaryMin(),
                searchRequest.getSalaryMax(),
                searchRequest.getApplicationDateFrom(),
                searchRequest.getApplicationDateTo(),
                user.getId()
        );

        Page<Job> jobPage = jobRepository.findAll(spec, pageable);
        return jobPage.map(this::mapToResponseDTO);
    }
}
