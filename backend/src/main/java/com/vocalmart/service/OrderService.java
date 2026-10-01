package com.vocalmart.service;

import com.vocalmart.dto.order.CreateOrderRequest;
import com.vocalmart.dto.order.OrderResponse;
import com.vocalmart.entity.Cart;
import com.vocalmart.entity.CartItem;
import com.vocalmart.entity.Order;
import com.vocalmart.entity.OrderItem;
import com.vocalmart.entity.OrderStatus;
import com.vocalmart.entity.Product;
import com.vocalmart.entity.User;
import com.vocalmart.exception.BadRequestException;
import com.vocalmart.exception.ResourceNotFoundException;
import com.vocalmart.mapper.OrderMapper;
import com.vocalmart.repository.CartRepository;
import com.vocalmart.repository.OrderRepository;
import com.vocalmart.repository.UserRepository;
import com.vocalmart.util.Pricing;
import java.math.BigDecimal;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final UserRepository userRepository;

    @Transactional
    public OrderResponse placeOrder(User currentUser, CreateOrderRequest request) {
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseThrow(() -> new BadRequestException("Your cart is empty"));
        if (cart.getItems().isEmpty()) {
            throw new BadRequestException("Your cart is empty");
        }

        for (CartItem item : cart.getItems()) {
            Product product = item.getProduct();
            if (item.getQuantity() > product.getStockQuantity()) {
                throw new BadRequestException(product.getName() + " has only " + product.getStockQuantity() + " left in stock");
            }
        }

        Order order = new Order();
        order.setUser(user);
        order.setStatus(OrderStatus.PLACED);
        order.setShippingName(request.fullName().trim());
        order.setPhone(request.phone().trim());
        order.setAddressLine(request.addressLine().trim());
        order.setCity(request.city().trim());
        order.setPostalCode(request.postalCode().trim());

        BigDecimal subtotal = BigDecimal.ZERO;
        for (CartItem item : cart.getItems()) {
            Product product = item.getProduct();
            OrderItem line = new OrderItem();
            line.setOrder(order);
            line.setProduct(product);
            line.setProductName(product.getName());
            line.setImageUrl(product.getImageUrl());
            line.setPrice(product.getPrice());
            line.setQuantity(item.getQuantity());
            order.getItems().add(line);
            subtotal = subtotal.add(product.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
            product.setStockQuantity(product.getStockQuantity() - item.getQuantity());
        }

        subtotal = Pricing.money(subtotal);
        BigDecimal shipping = Pricing.shippingFor(subtotal);
        order.setSubtotal(subtotal);
        order.setShippingAmount(shipping);
        order.setTotalAmount(Pricing.money(subtotal.add(shipping)));

        cart.getItems().clear();
        return OrderMapper.toResponse(orderRepository.save(order));
    }

    public List<OrderResponse> findMine(User user) {
        return orderRepository.findByUserIdOrderByOrderDateDesc(user.getId()).stream()
                .map(OrderMapper::toResponse)
                .toList();
    }

    public OrderResponse findMineById(User user, Long id) {
        Order order = orderRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        return OrderMapper.toResponse(order);
    }
}
