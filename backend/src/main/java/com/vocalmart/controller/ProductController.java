package com.vocalmart.controller;

import com.vocalmart.dto.product.ProductResponse;
import com.vocalmart.exception.BadRequestException;
import com.vocalmart.service.ProductService;
import java.math.BigDecimal;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public List<ProductResponse> list(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false, defaultValue = "newest") String sort) {
        return productService.findProducts(query, categoryId, minPrice, maxPrice, sort);
    }

    @GetMapping("/search")
    public List<ProductResponse> search(@RequestParam String query) {
        if (query == null || query.isBlank()) {
            throw new BadRequestException("Search query is required");
        }
        return productService.findProducts(query, null, null, null, "newest");
    }

    @GetMapping("/category/{categoryId}")
    public List<ProductResponse> byCategory(@PathVariable Long categoryId) {
        return productService.findByCategory(categoryId);
    }

    @GetMapping("/{id}")
    public ProductResponse get(@PathVariable Long id) {
        return productService.findById(id);
    }
}
