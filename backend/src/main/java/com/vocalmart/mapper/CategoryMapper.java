package com.vocalmart.mapper;

import com.vocalmart.dto.category.CategoryResponse;
import com.vocalmart.entity.Category;

public final class CategoryMapper {

    private CategoryMapper() {
    }

    public static CategoryResponse toResponse(Category category, long productCount) {
        return new CategoryResponse(category.getId(), category.getName(), category.getDescription(), productCount);
    }
}
