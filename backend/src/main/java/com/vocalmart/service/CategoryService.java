package com.vocalmart.service;

import com.vocalmart.dto.category.CategoryResponse;
import com.vocalmart.entity.Category;
import com.vocalmart.exception.ResourceNotFoundException;
import com.vocalmart.mapper.CategoryMapper;
import com.vocalmart.repository.CategoryRepository;
import com.vocalmart.repository.ProductRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    public List<CategoryResponse> findAll() {
        return categoryRepository.findAll().stream()
                .map(category -> CategoryMapper.toResponse(category, productRepository.countByCategory_Id(category.getId())))
                .toList();
    }

    public CategoryResponse findById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        return CategoryMapper.toResponse(category, productRepository.countByCategory_Id(category.getId()));
    }
}
