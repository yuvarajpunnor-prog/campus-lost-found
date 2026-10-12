package com.campus.lostfound.dto;

import jakarta.validation.constraints.NotBlank;

public class StatusUpdateRequest {

    @NotBlank(message = "Status cannot be empty")
    private String status;

    private String notes;

    public StatusUpdateRequest() {
    }

    public StatusUpdateRequest(String status) {
        this.status = status;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
