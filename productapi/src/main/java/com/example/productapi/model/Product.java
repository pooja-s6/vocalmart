package com.example.productapi.model;

import org.bson.types.Binary;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Data // Lombok generates getters/setters for you
@Document(collection = "products")
public class Product {

    @Id
    private String id;

    private String name;
    private String description;
    private double price;

    private Binary image;     // Store image as binary BLOB
    private String imageType; // e.g. image/jpeg, image/png

    /**
     * @return String return the id
     */
    public String getId() {
        return id;
    }

    /**
     * @param id the id to set
     */
    public void setId(String id) {
        this.id = id;
    }

    /**
     * @return String return the name
     */
    public String getName() {
        return name;
    }

    /**
     * @param name the name to set
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * @return String return the description
     */
    public String getDescription() {
        return description;
    }

    /**
     * @param description the description to set
     */
    public void setDescription(String description) {
        this.description = description;
    }

    /**
     * @return double return the price
     */
    public double getPrice() {
        return price;
    }

    /**
     * @param price the price to set
     */
    public void setPrice(double price) {
        this.price = price;
    }
    public String getImageType() {
    return imageType;
}

public void setImageType(String imageType) {
    this.imageType = imageType;
}


}