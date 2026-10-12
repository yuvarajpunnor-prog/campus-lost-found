package com.campus.lostfound.controller;

import com.campus.lostfound.dto.ItemRequest;
import com.campus.lostfound.dto.MatchResult;
import com.campus.lostfound.dto.StatusUpdateRequest;
import com.campus.lostfound.entity.Item;
import com.campus.lostfound.service.ItemService;
import com.campus.lostfound.service.MatchingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/items")
public class ItemController {

    @Autowired
    private ItemService itemService;

    @Autowired
    private MatchingService matchingService;

    @GetMapping
    public ResponseEntity<List<Item>> getAllItems(@RequestParam(required = false) String type) {
        if (type != null && !type.isBlank()) {
            return ResponseEntity.ok(itemService.getItemsByType(type));
        }
        return ResponseEntity.ok(itemService.getAllItems());
    }

    @GetMapping("/recent-found")
    public ResponseEntity<List<Item>> getRecentFoundItems() {
        return ResponseEntity.ok(itemService.getRecentFoundItems());
    }

    @GetMapping("/search")
    public ResponseEntity<List<Item>> searchItems(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String keyword) {
        return ResponseEntity.ok(itemService.searchItems(type, category, status, location, keyword));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Item> getItemById(@PathVariable Long id) {
        return ResponseEntity.ok(itemService.getItemById(id));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Item>> getItemsByUser(
            @PathVariable Long userId,
            @RequestParam(required = false) String type) {
        if (type != null && !type.isBlank()) {
            return ResponseEntity.ok(itemService.getItemsByUserAndType(userId, type));
        }
        return ResponseEntity.ok(itemService.getItemsByUser(userId));
    }

    @GetMapping("/{id}/matches")
    public ResponseEntity<List<MatchResult>> getMatchesForItem(@PathVariable Long id) {
        Item item = itemService.getItemById(id);
        List<MatchResult> matches = matchingService.findMatches(item);
        return ResponseEntity.ok(matches);
    }

    @PostMapping
    public ResponseEntity<Item> createItem(@Valid @RequestBody ItemRequest req) {
        Item created = itemService.createItem(req);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PostMapping("/lost")
    public ResponseEntity<Item> reportLostItem(@Valid @RequestBody ItemRequest req) {
        req.setType("LOST");
        Item created = itemService.createItem(req);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PostMapping("/found")
    public ResponseEntity<Item> reportFoundItem(@Valid @RequestBody ItemRequest req) {
        req.setType("FOUND");
        Item created = itemService.createItem(req);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Item> updateItem(
            @PathVariable Long id,
            @Valid @RequestBody ItemRequest req,
            @RequestParam(required = false) Long userId) {
        Long requesterId = userId != null ? userId : req.getUserId();
        Item updated = itemService.updateItem(id, req, requesterId);
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Item> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody StatusUpdateRequest req) {
        Item updated = itemService.updateItemStatus(id, req.getStatus());
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteItem(
            @PathVariable Long id,
            @RequestParam Long userId) {
        itemService.deleteItem(id, userId);
        return ResponseEntity.ok(Map.of("message", "Item report deleted successfully"));
    }
}
