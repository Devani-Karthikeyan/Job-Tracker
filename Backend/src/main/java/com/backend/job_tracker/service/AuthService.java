package com.backend.job_tracker.service;

import com.backend.job_tracker.dto.UserDTO;

public interface AuthService {
    String registerUser(UserDTO userDTO);
    String loginUser(UserDTO userDTO);
}
