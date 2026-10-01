package com.vocalmart.controller;

import com.vocalmart.dto.order.CreateOrderRequest;
import com.vocalmart.dto.order.OrderResponse;
import com.vocalmart.security.CurrentUserService;
import com.vocalmart.service.OrderService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final CurrentUserService currentUserService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public OrderResponse place(Authentication authentication, @Valid @RequestBody CreateOrderRequest request) {
        return orderService.placeOrder(currentUserService.require(authentication), request);
    }

    @GetMapping
    public List<OrderResponse> list(Authentication authentication) {
        return orderService.findMine(currentUserService.require(authentication));
    }

    @GetMapping("/{id}")
    public OrderResponse get(Authentication authentication, @PathVariable Long id) {
        return orderService.findMineById(currentUserService.require(authentication), id);
    }
}
