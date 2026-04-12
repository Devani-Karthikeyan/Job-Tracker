package com.backend.job_tracker.service.impl;

import com.backend.job_tracker.dto.request.LoginRequestDTO;
import com.backend.job_tracker.dto.request.RegisterRequestDTO;
import com.backend.job_tracker.dto.response.AuthResponseDTO;
import com.backend.job_tracker.model.User;
import com.backend.job_tracker.repository.UserRepository;
import com.backend.job_tracker.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Optional;
@Service
public class AuthServiceImpl implements AuthService {
    @Autowired
    private UserRepository userRepository;

    @Override
<<<<<<< HEAD
    public String registerUser(UserDTO userDTO){
=======
<<<<<<< Updated upstream
    public String registerUser(@RequestBody UserDTO userDTO){
>>>>>>> dcd362b (refactor: replace UserDTO with request/response DTOs for authentication)
        if(userRepository.findByEmail(userDTO.getEmail()).isPresent()){
            return "Error: Email Already exists!";
=======
    public AuthResponseDTO registerUser(RegisterRequestDTO registerRequestDTO){
        if(userRepository.findByEmail(registerRequestDTO.getEmail()).isPresent()){
            return new AuthResponseDTO(
                    "Error: Email Already exists!",
                    null,
                    null,
                    null

            );
>>>>>>> Stashed changes
        }
        User user = new User();
        user.setName(registerRequestDTO.getName());
        user.setEmail(registerRequestDTO.getEmail());
        user.setPassword(registerRequestDTO.getPassword());

        userRepository.save(user);

        return new AuthResponseDTO(
                "User Registered Successfully!",
                user.getId(),
                user.getName(),
                user.getEmail()
        );

    }
    @Override
    public AuthResponseDTO loginUser(@RequestBody LoginRequestDTO loginRequestDTO){
        Optional<User> existingUser =userRepository.findByEmail(loginRequestDTO.getEmail());

        if(existingUser.isPresent() && existingUser.get().getPassword().equals(loginRequestDTO.getPassword())){
            User user = existingUser.get();
            return new AuthResponseDTO(
                    "Login Successful!",
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
