package com.campus.lostfound.controller;

import com.campus.lostfound.dto.ClaimRequest;
import com.campus.lostfound.dto.StatusUpdateRequest;
import com.campus.lostfound.entity.Claim;
import com.campus.lostfound.service.ClaimService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/claims")
public class ClaimController {

    @Autowired
    private ClaimService claimService;

    @PostMapping
    public ResponseEntity<Claim> submitClaim(@Valid @RequestBody ClaimRequest req) {
        Claim created = claimService.submitClaim(req);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Claim>> getAllClaims() {
        return ResponseEntity.ok(claimService.getAllClaims());
    }

    @GetMapping("/item/{itemId}")
    public ResponseEntity<List<Claim>> getClaimsByItem(@PathVariable Long itemId) {
        return ResponseEntity.ok(claimService.getClaimsByItem(itemId));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Claim>> getClaimsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(claimService.getClaimsByClaimant(userId));
    }

    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<List<Claim>> getClaimsForOwner(@PathVariable Long ownerId) {
        return ResponseEntity.ok(claimService.getClaimsForOwner(ownerId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Claim> updateClaimStatus(
            @PathVariable Long id,
            @Valid @RequestBody StatusUpdateRequest req) {
        Claim updated = claimService.updateClaimStatus(id, req.getStatus(), req.getNotes());
        return ResponseEntity.ok(updated);
    }
}
