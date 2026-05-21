package com.backend.job_tracker.service.impl;

import org.springframework.security.crypto.password.PasswordEncoder;
import com.backend.job_tracker.dto.request.LoginRequestDTO;
import com.backend.job_tracker.dto.request.RegisterRequestDTO;
import com.backend.job_tracker.dto.response.AuthResponseDTO;
import com.backend.job_tracker.model.User;
import com.backend.job_tracker.repository.UserRepository;
import com.backend.job_tracker.security.JwtUtil;
import com.backend.job_tracker.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
@Service
public class AuthServiceImpl implements AuthService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;
    @Override

    public AuthResponseDTO registerUser(RegisterRequestDTO registerRequestDTO){
        if(userRepository.findByEmail(registerRequestDTO.getEmail()).isPresent()){
            return new AuthResponseDTO(
                    "Error: Email Already exists!",
                    null,
                    null,
                    null

            );
        }
        User user = new User();
        user.setName(registerRequestDTO.getName());
        user.setEmail(registerRequestDTO.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequestDTO.getPassword()));

        userRepository.save(user);

        return new AuthResponseDTO(
                "User Registered Successfully!",
                user.getId(),
                user.getName(),
                user.getEmail()
        );

    }
    @Override
    public AuthResponseDTO loginUser(LoginRequestDTO loginRequestDTO) {

        Optional<User> existingUser =
                userRepository.findByEmail(loginRequestDTO.getEmail());

        if (existingUser.isPresent() &&
                passwordEncoder.matches(
                        loginRequestDTO.getPassword(),
                        existingUser.get().getPassword()
                )) {

            User user = existingUser.get();

            String token = jwtUtil.generateToken(user.getEmail());

            return new AuthResponseDTO(
                    token,
                    user.getId(),
                    user.getName(),
                    user.getEmail()
            );
        }

        return new AuthResponseDTO(
                "Error : Invalid Email or Password",
                null,
                null,
                null
        );
    }
}
