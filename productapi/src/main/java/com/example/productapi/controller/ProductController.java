package com.example.productapi.controller;

import java.io.IOException;
import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

import org.bson.types.Binary;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.example.productapi.model.Product;
import com.example.productapi.repository.ProductRepository;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:3000")
public class ProductController {

    private final ProductRepository productRepository;

    public ProductController(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @PostMapping
    public Product addProduct(
            @RequestParam("name") String name,
            @RequestParam("description") String description,
            @RequestParam("price") double price,
            @RequestParam("image") MultipartFile file
    ) throws IOException {

        Product product = new Product();
        product.setName(name);
        product.setDescription(description);
        product.setPrice(price);

        // Convert uploaded file to Binary for MongoDB
        product.setImage(new Binary(file.getBytes()));
        product.setImageType(file.getContentType());

        Product savedProduct = productRepository.save(product);
        System.out.println("Product saved: " + savedProduct.getName() + " with image type: " + savedProduct.getImageType());

        return savedProduct;
    }

    @GetMapping("/{id}/image")
    public ResponseEntity<byte[]> getProductImage(@PathVariable String id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (product.getImage() == null || product.getImageType() == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_TYPE, product.getImageType())
                .body(product.getImage().getData());
    }

    @GetMapping
    public List<ProductDTO> getAllProducts() {
        List<Product> products = productRepository.findAll();
        System.out.println("Fetching " + products.size() + " products from database");

        return products.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    private ProductDTO convertToDTO(Product product) {
        ProductDTO dto = new ProductDTO();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        dto.setPrice(product.getPrice());

        if (product.getImage() != null) {
            byte[] imageBytes = product.getImage().getData();
            String base64Image = Base64.getEncoder().encodeToString(imageBytes);
            dto.setImageBase64(base64Image);
        } else {
            System.out.println("No image found for product: " + product.getName());
            dto.setImageBase64(null);
        }

        dto.setImageType(product.getImageType() != null ? product.getImageType() : null);

        return dto;
    }

    // DTO for frontend response
    public static class ProductDTO {
        private String id;
        private String name;
        private String description;
        private double price;
        private String imageBase64;
        private String imageType;

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }

        public double getPrice() { return price; }
        public void setPrice(double price) { this.price = price; }

        public String getImageBase64() { return imageBase64; }
        public void setImageBase64(String imageBase64) { this.imageBase64 = imageBase64; }

        public String getImageType() { return imageType; }
        public void setImageType(String imageType) { this.imageType = imageType; }
    }
}