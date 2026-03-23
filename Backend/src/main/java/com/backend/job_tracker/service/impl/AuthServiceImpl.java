package com.backend.job_tracker.service.impl;

import com.backend.job_tracker.dto.UserDTO;
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
    public String registerUser(@RequestBody UserDTO userDTO){
        if(userRepository.findByEmail(userDTO.getEmail()).isPresent()){
            return "Error: Email Already exists!";
        }
        User user = new User();
        user.setName(userDTO.getName());
        user.setEmail(userDTO.getEmail());
        user.setPassword(userDTO.getPassword());

        userRepository.save(user);
        return "User Registered Successfully!";

    }
    @Override
    public String loginUser(@RequestBody UserDTO userDTO){
        Optional<User> existingUser =userRepository.findByEmail(userDTO.getEmail());

        if(existingUser.isPresent() && existingUser.get().getPassword().equals(userDTO.getPassword())){
            return "Login Successful!";
        }
        return "Error : Invalid Email or Password";
    }
}
