package com.vocalmart.service;

import com.vocalmart.dto.cart.AddCartItemRequest;
import com.vocalmart.dto.cart.CartResponse;
import com.vocalmart.dto.cart.UpdateCartItemRequest;
import com.vocalmart.entity.Cart;
import com.vocalmart.entity.CartItem;
import com.vocalmart.entity.Product;
import com.vocalmart.entity.User;
import com.vocalmart.exception.BadRequestException;
import com.vocalmart.exception.ResourceNotFoundException;
import com.vocalmart.mapper.CartMapper;
import com.vocalmart.repository.CartRepository;
import com.vocalmart.repository.ProductRepository;
import com.vocalmart.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CartService {

    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Transactional
    public CartResponse getCart(User user) {
        return CartMapper.toResponse(getOrCreate(user));
    }

    @Transactional
    public CartResponse addItem(User user, AddCartItemRequest request) {
        Product product = productRepository.findById(request.productId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        if (product.getStockQuantity() <= 0) {
            throw new BadRequestException("This product is out of stock");
        }
        Cart cart = getOrCreate(user);
        CartItem item = cart.getItems().stream()
                .filter(existing -> existing.getProduct().getId().equals(product.getId()))
                .findFirst()
                .orElse(null);
        int nextQuantity = request.quantity() + (item == null ? 0 : item.getQuantity());
        ensureStock(product, nextQuantity);
        if (item == null) {
            item = new CartItem();
            item.setCart(cart);
            item.setProduct(product);
            item.setQuantity(request.quantity());
            cart.getItems().add(item);
        } else {
            item.setQuantity(nextQuantity);
        }
        return CartMapper.toResponse(cartRepository.save(cart));
    }

    @Transactional
    public CartResponse updateItem(User user, Long itemId, UpdateCartItemRequest request) {
        Cart cart = getOrCreate(user);
        CartItem item = findItem(cart, itemId);
        ensureStock(item.getProduct(), request.quantity());
        item.setQuantity(request.quantity());
        return CartMapper.toResponse(cartRepository.save(cart));
    }

    @Transactional
    public CartResponse removeItem(User user, Long itemId) {
        Cart cart = getOrCreate(user);
        CartItem item = findItem(cart, itemId);
        cart.getItems().remove(item);
        return CartMapper.toResponse(cartRepository.save(cart));
    }

    @Transactional
    public CartResponse clear(User user) {
        Cart cart = getOrCreate(user);
        cart.getItems().clear();
        return CartMapper.toResponse(cartRepository.save(cart));
    }

    private Cart getOrCreate(User user) {
        return cartRepository.findByUserId(user.getId()).orElseGet(() -> {
            User managed = userRepository.findById(user.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));
            Cart cart = new Cart();
            cart.setUser(managed);
            return cartRepository.save(cart);
        });
    }

    private CartItem findItem(Cart cart, Long itemId) {
        return cart.getItems().stream()
                .filter(item -> item.getId().equals(itemId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));
    }

    private void ensureStock(Product product, int quantity) {
        if (quantity > product.getStockQuantity()) {
            throw new BadRequestException("Only " + product.getStockQuantity() + " items available for " + product.getName());
        }
    }
}
