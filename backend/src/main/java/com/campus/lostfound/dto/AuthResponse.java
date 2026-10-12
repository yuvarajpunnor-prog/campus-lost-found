package com.campus.lostfound.dto;

public class AuthResponse {
    private String message;
    private boolean success;
    private Long id;
    private String name;
    private String email;
    private String studentId;
    private String phone;
    private String role;
    private String token;

    public AuthResponse() {
    }

    public AuthResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    public static AuthResponse success(String message, Long id, String name, String email, String studentId, String phone, String role) {
        AuthResponse res = new AuthResponse();
        res.setSuccess(true);
        res.setMessage(message);
        res.setId(id);
        res.setName(name);
        res.setEmail(email);
        res.setStudentId(studentId);
        res.setPhone(phone);
        res.setRole(role);
        res.setToken("session_" + id + "_" + System.currentTimeMillis());
        return res;
    }

    public static AuthResponse failure(String message) {
        AuthResponse res = new AuthResponse();
        res.setSuccess(false);
        res.setMessage(message);
        return res;
    }

    // Getters and Setters
    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

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

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
