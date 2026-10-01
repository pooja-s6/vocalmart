package com.vocalmart.service;

import com.vocalmart.dto.product.ProductRequest;
import com.vocalmart.dto.product.ProductResponse;
import com.vocalmart.entity.Category;
import com.vocalmart.entity.Product;
import com.vocalmart.exception.BadRequestException;
import com.vocalmart.exception.ResourceNotFoundException;
import com.vocalmart.mapper.ProductMapper;
import com.vocalmart.repository.CartItemRepository;
import com.vocalmart.repository.CategoryRepository;
import com.vocalmart.repository.ProductRepository;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final CartItemRepository cartItemRepository;

    public List<ProductResponse> findProducts(String query, Long categoryId, BigDecimal minPrice, BigDecimal maxPrice, String sort) {
        if (minPrice != null && maxPrice != null && minPrice.compareTo(maxPrice) > 0) {
            throw new BadRequestException("Minimum price cannot be greater than maximum price");
        }
        String normalized = (query == null || query.isBlank()) ? null : query.trim();
        List<Product> products = new ArrayList<>(productRepository.search(normalized, categoryId, minPrice, maxPrice));
        products.sort(comparator(sort));
        return products.stream().map(ProductMapper::toResponse).toList();
    }

    public ProductResponse findById(Long id) {
        return ProductMapper.toResponse(getProduct(id));
    }

    public List<ProductResponse> findByCategory(Long categoryId) {
        if (!categoryRepository.existsById(categoryId)) {
            throw new ResourceNotFoundException("Category not found");
        }
        return findProducts(null, categoryId, null, null, "newest");
    }

    @Transactional
    public ProductResponse create(ProductRequest request) {
        Product product = new Product();
        apply(product, request);
        return ProductMapper.toResponse(productRepository.save(product));
    }

    @Transactional
    public ProductResponse update(Long id, ProductRequest request) {
        Product product = getProduct(id);
        apply(product, request);
        return ProductMapper.toResponse(productRepository.save(product));
    }

    @Transactional
    public ProductResponse updateStock(Long id, int stockQuantity) {
        Product product = getProduct(id);
        product.setStockQuantity(stockQuantity);
        return ProductMapper.toResponse(productRepository.save(product));
    }

    @Transactional
    public void delete(Long id) {
        Product product = getProduct(id);
        cartItemRepository.deleteByProductId(product.getId());
        productRepository.delete(product);
    }

    private Product getProduct(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
    }

    private void apply(Product product, ProductRequest request) {
        Category category = categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        product.setName(request.name().trim());
        product.setDescription(request.description().trim());
        product.setPrice(request.price());
        product.setImageUrl(request.imageUrl().trim());
        product.setStockQuantity(request.stockQuantity());
        product.setCategory(category);
        product.setRating(request.rating());
    }

    private Comparator<Product> comparator(String sort) {
        String value = sort == null ? "newest" : sort;
        return switch (value) {
            case "price_asc" -> Comparator.comparing(Product::getPrice);
            case "price_desc" -> Comparator.comparing(Product::getPrice).reversed();
            case "rating" -> Comparator.comparing(Product::getRating).reversed();
            case "name" -> Comparator.comparing(Product::getName, String.CASE_INSENSITIVE_ORDER);
            default -> Comparator.comparing(Product::getCreatedAt).reversed();
        };
    }
}
