package com.backend.job_tracker.controller;

import com.backend.job_tracker.dto.UserPreferenceDto;
import com.backend.job_tracker.service.UserPreferenceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/preferences")
@RequiredArgsConstructor
public class UserPreferenceController {

    private final UserPreferenceService userPreferenceService;

    @GetMapping
    public ResponseEntity<UserPreferenceDto> getPreferences(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(userPreferenceService.getPreferences(email));
    }

    @PutMapping
    public ResponseEntity<UserPreferenceDto> updatePreferences(
            @RequestBody UserPreferenceDto dto,
            Authentication authentication
    ) {
        String email = authentication.getName();
        return ResponseEntity.ok(userPreferenceService.updatePreferences(email, dto));
    }
}
