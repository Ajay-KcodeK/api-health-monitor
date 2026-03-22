package com.codewithaz.backend.controller;

import com.codewithaz.backend.dto.AuthResponse;
import com.codewithaz.backend.dto.LoginRequest;
import com.codewithaz.backend.dto.RegisterRequest;
import com.codewithaz.backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController               // Marks this as a REST API controller
@RequestMapping("/api/auth")  // Base URL for all methods in this class
@RequiredArgsConstructor
@CrossOrigin(origins = "*")   // Allow React frontend to call this API
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        AuthResponse response = authService.login(loginRequest);
        return ResponseEntity.ok(response);
    }
}
