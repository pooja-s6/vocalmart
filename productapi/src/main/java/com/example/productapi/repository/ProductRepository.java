package com.example.productapi.repository;

import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.example.productapi.model.Product;

public interface ProductRepository extends MongoRepository<Product, String> {
    
    // Find products by name (case-insensitive)
    List<Product> findByNameContainingIgnoreCase(String name);
    
    // ENHANCED: Find products by name OR description (case-insensitive)
    @Query("{'$or': [{'name': {'$regex': ?0, '$options': 'i'}}, {'description': {'$regex': ?0, '$options': 'i'}}]}")
    List<Product> findByNameOrDescriptionContainingIgnoreCase(String searchTerm);
    
    // Find products by price range
    List<Product> findByPriceBetween(double minPrice, double maxPrice);
}