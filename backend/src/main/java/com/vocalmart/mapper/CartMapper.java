package com.vocalmart.mapper;

import com.vocalmart.dto.cart.CartItemResponse;
import com.vocalmart.dto.cart.CartResponse;
import com.vocalmart.entity.Cart;
import com.vocalmart.entity.CartItem;
import com.vocalmart.util.Pricing;
import java.math.BigDecimal;
import java.util.List;

public final class CartMapper {

    private CartMapper() {
    }

    public static CartResponse toResponse(Cart cart) {
        List<CartItemResponse> items = cart.getItems().stream().map(CartMapper::toItem).toList();
        BigDecimal subtotal = Pricing.money(items.stream()
                .map(CartItemResponse::lineTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add));
        BigDecimal shipping = Pricing.shippingFor(subtotal);
        BigDecimal total = Pricing.money(subtotal.add(shipping));
        int itemCount = items.stream().mapToInt(CartItemResponse::quantity).sum();
        return new CartResponse(cart.getId(), items, subtotal, shipping, total, itemCount, Pricing.shippingNote());
    }

    private static CartItemResponse toItem(CartItem item) {
        BigDecimal lineTotal = Pricing.money(item.getProduct().getPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
        return new CartItemResponse(
                item.getId(),
                item.getProduct().getId(),
                item.getProduct().getName(),
                item.getProduct().getImageUrl(),
                item.getProduct().getPrice(),
                item.getQuantity(),
                lineTotal,
                item.getProduct().getStockQuantity());
    }
}
