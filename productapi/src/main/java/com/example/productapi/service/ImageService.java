package com.example.productapi.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class ImageService {

    private final String uploadDir = "uploads/images/";

    public ImageService() {
        try {
            Files.createDirectories(Paths.get(uploadDir));
        } catch (IOException e) {
            throw new RuntimeException("Could not create upload directory!", e);
        }
    }

    public String storeImage(MultipartFile file) throws IOException {
        String imageId = UUID.randomUUID().toString();
        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename != null ? originalFilename.substring(originalFilename.lastIndexOf(".")) : ".jpg";
        String filename = imageId + extension;
        
        Path filePath = Paths.get(uploadDir + filename);
        Files.write(filePath, file.getBytes());
        
        return imageId;
    }

    public byte[] getImage(String imageId) throws IOException {
        Path imagePath = findImagePath(imageId);
        if (imagePath != null && Files.exists(imagePath)) {
            return Files.readAllBytes(imagePath);
        }
        return null;
    }

    public void deleteImage(String imageId) {
        try {
            Path imagePath = findImagePath(imageId);
            if (imagePath != null && Files.exists(imagePath)) {
                Files.delete(imagePath);
            }
        } catch (IOException e) {
            // Log error but don't throw exception
        }
    }

    private Path findImagePath(String imageId) throws IOException {
        Path directory = Paths.get(uploadDir);
        return Files.list(directory)
                .filter(path -> path.getFileName().toString().startsWith(imageId))
                .findFirst()
                .orElse(null);
    }
}
