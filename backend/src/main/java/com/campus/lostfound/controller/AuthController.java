package com.campus.lostfound.controller;

import com.campus.lostfound.dto.AuthResponse;
import com.campus.lostfound.dto.LoginRequest;
import com.campus.lostfound.dto.RegisterRequest;
import com.campus.lostfound.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest req) {
        AuthResponse response = authService.register(req);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest req) {
        AuthResponse response = authService.login(req);
        return ResponseEntity.ok(response);
    }
}
