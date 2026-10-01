package com.vocalmart.mapper;

import com.vocalmart.dto.product.ProductResponse;
import com.vocalmart.entity.Product;

public final class ProductMapper {

    private ProductMapper() {
    }

    public static ProductResponse toResponse(Product product) {
        return new ProductResponse(
                product.getId(),
                product.getName(),
                product.getDescription(),
                product.getPrice(),
                product.getImageUrl(),
                product.getStockQuantity(),
                product.getCategory().getId(),
                product.getCategory().getName(),
                product.getRating(),
                product.getCreatedAt());
    }
}
