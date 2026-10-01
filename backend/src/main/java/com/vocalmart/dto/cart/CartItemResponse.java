package com.vocalmart.dto.cart;

import java.math.BigDecimal;

public record CartItemResponse(
        Long id,
        Long productId,
        String productName,
        String imageUrl,
        BigDecimal price,
        int quantity,
        BigDecimal lineTotal,
        int stockQuantity
) {
}
