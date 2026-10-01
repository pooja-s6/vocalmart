package com.vocalmart.mapper;

import com.vocalmart.dto.order.OrderItemResponse;
import com.vocalmart.dto.order.OrderResponse;
import com.vocalmart.entity.Order;
import com.vocalmart.entity.OrderItem;
import com.vocalmart.util.Pricing;
import java.math.BigDecimal;
import java.util.List;

public final class OrderMapper {

    private OrderMapper() {
    }

    public static OrderResponse toResponse(Order order) {
        List<OrderItemResponse> items = order.getItems().stream().map(OrderMapper::toItem).toList();
        return new OrderResponse(
                order.getId(),
                order.getOrderDate(),
                order.getSubtotal(),
                order.getShippingAmount(),
                order.getTotalAmount(),
                order.getStatus(),
                order.getShippingName(),
                order.getPhone(),
                order.getAddressLine(),
                order.getCity(),
                order.getPostalCode(),
                items);
    }

    private static OrderItemResponse toItem(OrderItem item) {
        Long productId = item.getProduct() == null ? null : item.getProduct().getId();
        BigDecimal lineTotal = Pricing.money(item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
        return new OrderItemResponse(
                item.getId(),
                productId,
                item.getProductName(),
                item.getImageUrl(),
                item.getPrice(),
                item.getQuantity(),
                lineTotal);
    }
}
