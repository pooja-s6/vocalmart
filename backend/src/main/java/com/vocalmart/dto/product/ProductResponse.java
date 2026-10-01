package com.vocalmart.dto.product;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record ProductResponse(
        Long id,
        String name,
        String description,
        BigDecimal price,
        String imageUrl,
        int stockQuantity,
        Long categoryId,
        String categoryName,
        BigDecimal rating,
        LocalDateTime createdAt
) {
}
