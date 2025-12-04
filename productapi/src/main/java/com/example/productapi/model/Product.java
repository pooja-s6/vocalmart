package com.example.productapi.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {
    
    @Id
    private String id;
    private String name;
    private String description;
    private Double price;
    private String imageId;
    private String category;
    private Double rating;
    private Integer reviewCount;
    private Integer stock;
    private String brand;
    
}
