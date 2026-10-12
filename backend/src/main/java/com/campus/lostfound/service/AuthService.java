package com.campus.lostfound.service;

import com.campus.lostfound.dto.AuthResponse;
import com.campus.lostfound.dto.LoginRequest;
import com.campus.lostfound.dto.RegisterRequest;
import com.campus.lostfound.entity.User;
import com.campus.lostfound.exception.BadRequestException;
import com.campus.lostfound.exception.ResourceNotFoundException;
import com.campus.lostfound.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail().trim().toLowerCase())) {
            throw new BadRequestException("An account with email " + req.getEmail() + " already exists.");
        }

        if (userRepository.existsByStudentId(req.getStudentId().trim())) {
            throw new BadRequestException("An account with Student ID " + req.getStudentId() + " already exists.");
        }

        User user = new User();
        user.setName(req.getName().trim());
        user.setEmail(req.getEmail().trim().toLowerCase());
        user.setStudentId(req.getStudentId().trim());
        user.setPhone(req.getPhone().trim());
        user.setPassword(passwordEncoder.encode(req.getPassword()));

        if (req.getRole() != null && req.getRole().equalsIgnoreCase("ROLE_ADMIN")) {
            user.setRole("ROLE_ADMIN");
        } else {
            user.setRole("ROLE_STUDENT");
        }
        user.setCreatedAt(LocalDateTime.now());

        User savedUser = userRepository.save(user);

        return AuthResponse.success(
                "Registration successful! Welcome to Campus Lost & Found.",
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getEmail(),
                savedUser.getStudentId(),
                savedUser.getPhone(),
                savedUser.getRole()
        );
    }

    public AuthResponse login(LoginRequest req) {
        User user = userRepository.findByEmail(req.getEmail().trim().toLowerCase())
                .orElseThrow(() -> new BadRequestException("Invalid email or password."));

        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new BadRequestException("Invalid email or password.");
        }

        return AuthResponse.success(
                "Login successful! Welcome back, " + user.getName(),
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getStudentId(),
                user.getPhone(),
                user.getRole()
        );
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));
    }
}
