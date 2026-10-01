package com.example.productapi.service;

import com.example.productapi.model.Product;
import com.example.productapi.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ImageService imageService;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Optional<Product> getProductById(String id) {
        return productRepository.findById(id);
    }

    public Product createProduct(String name, String description, Double price, MultipartFile image) throws IOException {
        Product product = new Product();
        product.setName(name);
        product.setDescription(description);
        product.setPrice(price);
        product.setRating(4.5); // Default rating
        product.setReviewCount(0);
        product.setStock(100);
        
        // Auto-categorize based on name/description
        product.setCategory(categorizeProduct(name, description));

        if (image != null && !image.isEmpty()) {
            String imageId = imageService.storeImage(image);
            product.setImageId(imageId);
        }

        return productRepository.save(product);
    }
    
    public String categorizeProduct(String name, String description) {
        String text = (name + " " + description).toLowerCase();
        if (text.contains("laptop") || text.contains("computer")) return "Computing";
        if (text.contains("phone") || text.contains("smartphone")) return "Mobile";
        if (text.contains("headphone") || text.contains("earphone") || text.contains("speaker")) return "Audio";
        if (text.contains("watch") || text.contains("fitness")) return "Wearables";
        if (text.contains("mouse") || text.contains("keyboard") || text.contains("cable")) return "Accessories";
        if (text.contains("monitor") || text.contains("tv") || text.contains("display")) return "Electronics";
        if (text.contains("tablet")) return "Mobile";
        return "Electronics";
    }

    public Product updateProduct(String id, String name, String description, Double price, MultipartFile image) throws IOException {
        Optional<Product> existingProduct = productRepository.findById(id);
        if (existingProduct.isPresent()) {
            Product product = existingProduct.get();
            product.setName(name);
            product.setDescription(description);
            product.setPrice(price);

            if (image != null && !image.isEmpty()) {
                // Delete old image if exists
                if (product.getImageId() != null) {
                    imageService.deleteImage(product.getImageId());
                }
                String imageId = imageService.storeImage(image);
                product.setImageId(imageId);
            }

            return productRepository.save(product);
        }
        return null;
    }

    public void deleteProduct(String id) {
        Optional<Product> product = productRepository.findById(id);
        if (product.isPresent() && product.get().getImageId() != null) {
            imageService.deleteImage(product.get().getImageId());
        }
        productRepository.deleteById(id);
    }

    public List<Product> searchProducts(String query) {
        List<Product> byName = productRepository.findByNameContainingIgnoreCase(query);
        List<Product> byDescription = productRepository.findByDescriptionContainingIgnoreCase(query);
        byName.addAll(byDescription);
        return byName.stream().distinct().toList();
    }
    
    public List<Product> getProductsByCategory(String category) {
        return productRepository.findByCategoryIgnoreCase(category);
    }
    
    public List<Product> getProductsByPriceRange(Double minPrice, Double maxPrice) {
        return productRepository.findByPriceBetween(minPrice, maxPrice);
    }
    
    public Product saveProduct(Product product) {
        return productRepository.save(product);
    }
}
