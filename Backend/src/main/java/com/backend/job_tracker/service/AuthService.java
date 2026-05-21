package com.backend.job_tracker.service;

import com.backend.job_tracker.dto.request.LoginRequestDTO;
import com.backend.job_tracker.dto.request.RegisterRequestDTO;
import com.backend.job_tracker.dto.response.AuthResponseDTO;

public interface AuthService {
    AuthResponseDTO registerUser(RegisterRequestDTO registerRequestDTO);
    AuthResponseDTO loginUser(LoginRequestDTO loginRequestDTO);
}
