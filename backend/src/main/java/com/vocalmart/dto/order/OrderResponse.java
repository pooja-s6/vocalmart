package com.vocalmart.dto.order;

import com.vocalmart.entity.OrderStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record OrderResponse(
        Long id,
        LocalDateTime orderDate,
        BigDecimal subtotal,
        BigDecimal shippingAmount,
        BigDecimal totalAmount,
        OrderStatus status,
        String shippingName,
        String phone,
        String addressLine,
        String city,
        String postalCode,
        List<OrderItemResponse> items
) {
}
