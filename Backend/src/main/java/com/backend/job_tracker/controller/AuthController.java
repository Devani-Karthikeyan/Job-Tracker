package com.backend.job_tracker.controller;

import com.backend.job_tracker.dto.request.LoginRequestDTO;
import com.backend.job_tracker.dto.request.RegisterRequestDTO;
import com.backend.job_tracker.dto.response.AuthResponseDTO;
import com.backend.job_tracker.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public AuthResponseDTO registerUser(@RequestBody RegisterRequestDTO registerRequestDTO){

        return authService.registerUser(registerRequestDTO);
    }

    @PostMapping("/login")
    public AuthResponseDTO loginUser(@RequestBody LoginRequestDTO loginRequestDTO){
        return  authService.loginUser(loginRequestDTO);
    }
}
