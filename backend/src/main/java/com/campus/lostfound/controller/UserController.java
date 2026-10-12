package com.campus.lostfound.controller;

import com.campus.lostfound.entity.User;
import com.campus.lostfound.service.AuthService;
import com.campus.lostfound.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private AuthService authService;

    @Autowired
    private AdminService adminService;

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(authService.getUserById(id));
    }
}
