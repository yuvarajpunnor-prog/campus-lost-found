package com.campus.lostfound.service;

import com.campus.lostfound.dto.DashboardStats;
import com.campus.lostfound.entity.User;
import com.campus.lostfound.exception.ResourceNotFoundException;
import com.campus.lostfound.repository.ClaimRepository;
import com.campus.lostfound.repository.ItemRepository;
import com.campus.lostfound.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private ClaimRepository claimRepository;

    public DashboardStats getStats(Long userId) {
        DashboardStats stats = new DashboardStats();

        // System-wide metrics
        stats.setTotalUsers(userRepository.count());
        stats.setTotalLostItems(itemRepository.countByType("LOST"));
        stats.setTotalFoundItems(itemRepository.countByType("FOUND"));
        stats.setTotalClaims(claimRepository.count());
        stats.setItemsReturned(itemRepository.countByStatus("RETURNED"));
        stats.setActiveReports(itemRepository.countByStatus("ACTIVE"));

        // User-specific metrics (if userId is provided)
        if (userId != null) {
            stats.setMyLostItems(itemRepository.countByUserIdAndType(userId, "LOST"));
            stats.setMyFoundItems(itemRepository.countByUserIdAndType(userId, "FOUND"));
            stats.setMyActiveClaims(claimRepository.countByClaimantId(userId));
            stats.setMyResolvedItems(itemRepository.countByUserIdAndStatus(userId, "RETURNED"));
        }

        return stats;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found with ID: " + id);
        }
        userRepository.deleteById(id);
    }
}
