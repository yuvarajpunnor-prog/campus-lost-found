package com.campus.lostfound.controller;

import com.campus.lostfound.dto.DashboardStats;
import com.campus.lostfound.entity.Item;
import com.campus.lostfound.entity.User;
import com.campus.lostfound.service.AdminService;
import com.campus.lostfound.service.ItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private ItemService itemService;

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardStats> getDashboardStats(@RequestParam(required = false) Long userId) {
        return ResponseEntity.ok(adminService.getStats(userId));
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @GetMapping("/items")
    public ResponseEntity<List<Item>> getAllItems() {
        return ResponseEntity.ok(itemService.getAllItems());
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Map<String, String>> deleteUser(@PathVariable Long id) {
        adminService.deleteUser(id);
        return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
    }

    @DeleteMapping("/items/{id}")
    public ResponseEntity<Map<String, String>> deleteItemAdmin(
            @PathVariable Long id,
            @RequestParam(required = false, defaultValue = "1") Long adminUserId) {
        itemService.deleteItem(id, adminUserId);
        return ResponseEntity.ok(Map.of("message", "Item deleted by admin successfully"));
    }
}
