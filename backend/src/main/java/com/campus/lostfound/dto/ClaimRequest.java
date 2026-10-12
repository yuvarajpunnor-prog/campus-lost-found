package com.campus.lostfound.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class ClaimRequest {

    @NotNull(message = "Item ID is required")
    private Long itemId;

    @NotNull(message = "Claimant User ID is required")
    private Long claimantId;

    @NotBlank(message = "Claimant name is required")
    private String claimantName;

    @NotBlank(message = "Student ID is required")
    private String claimantStudentId;

    @NotBlank(message = "Contact phone is required")
    private String claimantPhone;

    @NotBlank(message = "Reason for claim is required")
    private String reason;

    private String additionalDetails;

    public ClaimRequest() {
    }

    public Long getItemId() {
        return itemId;
    }

    public void setItemId(Long itemId) {
        this.itemId = itemId;
    }

    public Long getClaimantId() {
        return claimantId;
    }

    public void setClaimantId(Long claimantId) {
        this.claimantId = claimantId;
    }

    public String getClaimantName() {
        return claimantName;
    }

    public void setClaimantName(String claimantName) {
        this.claimantName = claimantName;
    }

    public String getClaimantStudentId() {
        return claimantStudentId;
    }

    public void setClaimantStudentId(String claimantStudentId) {
        this.claimantStudentId = claimantStudentId;
    }

    public String getClaimantPhone() {
        return claimantPhone;
    }

    public void setClaimantPhone(String claimantPhone) {
        this.claimantPhone = claimantPhone;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getAdditionalDetails() {
        return additionalDetails;
    }

    public void setAdditionalDetails(String additionalDetails) {
        this.additionalDetails = additionalDetails;
    }
}
