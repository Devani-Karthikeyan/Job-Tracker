package com.backend.job_tracker.controller;

import com.backend.job_tracker.dto.UserDTO;
import com.backend.job_tracker.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public String registerUser(@RequestBody UserDTO userDTO){

        return authService.registerUser(userDTO);
    }

    @PostMapping("/login")
    public String loginUser(@RequestBody UserDTO userDTO){
        return  authService.loginUser(userDTO);
    }
}
