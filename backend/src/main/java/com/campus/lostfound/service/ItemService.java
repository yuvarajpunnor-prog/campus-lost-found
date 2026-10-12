package com.campus.lostfound.service;

import com.campus.lostfound.dto.ItemRequest;
import com.campus.lostfound.entity.Item;
import com.campus.lostfound.entity.User;
import com.campus.lostfound.exception.BadRequestException;
import com.campus.lostfound.exception.ResourceNotFoundException;
import com.campus.lostfound.repository.ItemRepository;
import com.campus.lostfound.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ItemService {

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private UserRepository userRepository;

    public Item createItem(ItemRequest req) {
        User user = userRepository.findById(req.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + req.getUserId()));

        String type = req.getType().toUpperCase();
        if (!type.equals("LOST") && !type.equals("FOUND")) {
            throw new BadRequestException("Item type must be either LOST or FOUND");
        }

        Item item = new Item();
        item.setItemName(req.getItemName().trim());
        item.setType(type);
        item.setCategory(req.getCategory());
        item.setDescription(req.getDescription());
        item.setDate(req.getDate());
        item.setTime(req.getTime());
        item.setLocation(req.getLocation().trim());
        item.setColor(req.getColor());
        item.setBrand(req.getBrand());
        item.setIdentifyingDetails(req.getIdentifyingDetails());
        item.setCurrentLocation(req.getCurrentLocation());
        item.setContactInfo(req.getContactInfo() != null && !req.getContactInfo().isBlank() ? req.getContactInfo() : user.getPhone());
        item.setImageUrl(req.getImageUrl());
        item.setStatus("ACTIVE");
        item.setUser(user);
        item.setCreatedAt(LocalDateTime.now());
        item.setUpdatedAt(LocalDateTime.now());

        return itemRepository.save(item);
    }

    public Item getItemById(Long id) {
        return itemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item report not found with ID: " + id));
    }

    public List<Item> getAllItems() {
        return itemRepository.findAll();
    }

    public List<Item> getItemsByType(String type) {
        return itemRepository.findByTypeOrderByCreatedAtDesc(type.toUpperCase());
    }

    public List<Item> getRecentFoundItems() {
        return itemRepository.findTop6ByTypeAndStatusOrderByCreatedAtDesc("FOUND", "ACTIVE");
    }

    public List<Item> getItemsByUser(Long userId) {
        return itemRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public List<Item> getItemsByUserAndType(Long userId, String type) {
        return itemRepository.findByUserIdAndTypeOrderByCreatedAtDesc(userId, type.toUpperCase());
    }

    public List<Item> searchItems(String type, String category, String status, String location, String keyword) {
        // Sanitize empty strings to null for query flexibility
        String t = (type != null && !type.isBlank()) ? type.toUpperCase() : null;
        String c = (category != null && !category.isBlank() && !category.equalsIgnoreCase("All")) ? category : null;
        String s = (status != null && !status.isBlank() && !status.equalsIgnoreCase("All")) ? status.toUpperCase() : null;
        String l = (location != null && !location.isBlank()) ? location.trim() : null;
        String k = (keyword != null && !keyword.isBlank()) ? keyword.trim() : null;

        return itemRepository.searchItems(t, c, s, l, k);
    }

    public Item updateItem(Long id, ItemRequest req, Long currentUserId) {
        Item item = getItemById(id);

        // Security check: Only original poster or admin can update
        User user = userRepository.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + currentUserId));

        if (!item.getUser().getId().equals(currentUserId) && !"ROLE_ADMIN".equals(user.getRole())) {
            throw new BadRequestException("You do not have permission to edit this item.");
        }

        item.setItemName(req.getItemName());
        item.setCategory(req.getCategory());
        item.setDescription(req.getDescription());
        item.setDate(req.getDate());
        item.setTime(req.getTime());
        item.setLocation(req.getLocation());
        item.setColor(req.getColor());
        item.setBrand(req.getBrand());
        item.setIdentifyingDetails(req.getIdentifyingDetails());
        if (req.getCurrentLocation() != null) {
            item.setCurrentLocation(req.getCurrentLocation());
        }
        if (req.getContactInfo() != null) {
            item.setContactInfo(req.getContactInfo());
        }
        if (req.getImageUrl() != null && !req.getImageUrl().isBlank()) {
            item.setImageUrl(req.getImageUrl());
        }
        item.setUpdatedAt(LocalDateTime.now());

        return itemRepository.save(item);
    }

    public Item updateItemStatus(Long id, String status) {
        Item item = getItemById(id);
        item.setStatus(status.toUpperCase());
        item.setUpdatedAt(LocalDateTime.now());
        return itemRepository.save(item);
    }

    public void deleteItem(Long id, Long currentUserId) {
        Item item = getItemById(id);

        User user = userRepository.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + currentUserId));

        if (!item.getUser().getId().equals(currentUserId) && !"ROLE_ADMIN".equals(user.getRole())) {
            throw new BadRequestException("You do not have permission to delete this item.");
        }

        itemRepository.delete(item);
    }
}
