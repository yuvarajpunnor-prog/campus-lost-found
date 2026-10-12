package com.campus.lostfound.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Entity representing a Campus User (Student, Staff, or Admin).
 */
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String studentId;

    @Column(nullable = false)
    private String phone;

    @JsonIgnore
    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String role; // "ROLE_STUDENT" or "ROLE_ADMIN"

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public User() {
    }

    public User(String name, String email, String studentId, String phone, String password, String role) {
        this.name = name;
        this.email = email;
        this.studentId = studentId;
        this.phone = phone;
        this.password = password;
        this.role = role;
    }

    @PrePersist
    public void prePersist() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        if (this.role == null) {
            this.role = "ROLE_STUDENT";
        }
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
