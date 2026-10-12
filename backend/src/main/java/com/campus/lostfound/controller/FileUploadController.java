package com.campus.lostfound.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/upload")
public class FileUploadController {

    private final Path uploadDir = Paths.get("uploads").toAbsolutePath().normalize();

    public FileUploadController() {
        try {
            if (!Files.exists(uploadDir)) {
                Files.createDirectories(uploadDir);
            }
        } catch (IOException e) {
            System.err.println("Could not create upload directory: " + e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<Map<String, String>> uploadFile(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return new ResponseEntity<>(Map.of("error", "Please select a file to upload"), HttpStatus.BAD_REQUEST);
        }

        try {
            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }

            String newFilename = UUID.randomUUID().toString() + extension;
            Path targetLocation = this.uploadDir.resolve(newFilename);

            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            String fileUrl = "/uploads/" + newFilename;
            return ResponseEntity.ok(Map.of(
                    "imageUrl", fileUrl,
                    "filename", newFilename,
                    "message", "Image uploaded successfully"
            ));
        } catch (IOException ex) {
            return new ResponseEntity<>(Map.of("error", "Could not upload file: " + ex.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
