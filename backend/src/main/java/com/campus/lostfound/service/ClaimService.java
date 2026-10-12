package com.campus.lostfound.service;

import com.campus.lostfound.dto.ClaimRequest;
import com.campus.lostfound.entity.Claim;
import com.campus.lostfound.entity.Item;
import com.campus.lostfound.entity.User;
import com.campus.lostfound.exception.BadRequestException;
import com.campus.lostfound.exception.ResourceNotFoundException;
import com.campus.lostfound.repository.ClaimRepository;
import com.campus.lostfound.repository.ItemRepository;
import com.campus.lostfound.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ClaimService {

    @Autowired
    private ClaimRepository claimRepository;

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private UserRepository userRepository;

    public Claim submitClaim(ClaimRequest req) {
        Item item = itemRepository.findById(req.getItemId())
                .orElseThrow(() -> new ResourceNotFoundException("Item not found with ID: " + req.getItemId()));

        if (!"FOUND".equalsIgnoreCase(item.getType())) {
            throw new BadRequestException("Claims can only be filed against FOUND items.");
        }

        if ("RETURNED".equalsIgnoreCase(item.getStatus()) || "CLOSED".equalsIgnoreCase(item.getStatus())) {
            throw new BadRequestException("This item has already been resolved or closed.");
        }

        User claimant = userRepository.findById(req.getClaimantId())
                .orElseThrow(() -> new ResourceNotFoundException("Claimant not found with ID: " + req.getClaimantId()));

        if (item.getUser().getId().equals(claimant.getId())) {
            throw new BadRequestException("You cannot claim an item that you reported yourself.");
        }

        if (claimRepository.existsByItemIdAndClaimantId(item.getId(), claimant.getId())) {
            throw new BadRequestException("You have already submitted a claim for this item.");
        }

        Claim claim = new Claim();
        claim.setItem(item);
        claim.setClaimant(claimant);
        claim.setClaimantName(req.getClaimantName().trim());
        claim.setClaimantStudentId(req.getClaimantStudentId().trim());
        claim.setClaimantPhone(req.getClaimantPhone().trim());
        claim.setReason(req.getReason().trim());
        claim.setAdditionalDetails(req.getAdditionalDetails());
        claim.setStatus("PENDING");
        claim.setCreatedAt(LocalDateTime.now());
        claim.setUpdatedAt(LocalDateTime.now());

        return claimRepository.save(claim);
    }

    public List<Claim> getClaimsByItem(Long itemId) {
        return claimRepository.findByItemIdOrderByCreatedAtDesc(itemId);
    }

    public List<Claim> getClaimsByClaimant(Long claimantId) {
        return claimRepository.findByClaimantIdOrderByCreatedAtDesc(claimantId);
    }

    public List<Claim> getClaimsForOwner(Long ownerId) {
        return claimRepository.findByItemUserIdOrderByCreatedAtDesc(ownerId);
    }

    public List<Claim> getAllClaims() {
        return claimRepository.findAll();
    }

    public Claim getClaimById(Long claimId) {
        return claimRepository.findById(claimId)
                .orElseThrow(() -> new ResourceNotFoundException("Claim not found with ID: " + claimId));
    }

    public Claim updateClaimStatus(Long claimId, String status, String adminNotes) {
        Claim claim = getClaimById(claimId);
        String upperStatus = status.toUpperCase();

        if (!upperStatus.equals("PENDING") && !upperStatus.equals("APPROVED") && !upperStatus.equals("REJECTED")) {
            throw new BadRequestException("Status must be PENDING, APPROVED, or REJECTED");
        }

        claim.setStatus(upperStatus);
        if (adminNotes != null) {
            claim.setAdminNotes(adminNotes);
        }
        claim.setUpdatedAt(LocalDateTime.now());

        Claim updatedClaim = claimRepository.save(claim);

        // If approved, update item status to CLAIMED
        if ("APPROVED".equals(upperStatus)) {
            Item item = claim.getItem();
            item.setStatus("CLAIMED");
            item.setUpdatedAt(LocalDateTime.now());
            itemRepository.save(item);
        }

        return updatedClaim;
    }
}
