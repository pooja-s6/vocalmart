package com.vocalmart.dto.product;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public record ProductRequest(
        @NotBlank @Size(max = 200) String name,
        @NotBlank String description,
        @NotNull @DecimalMin("0.0") @Digits(integer = 10, fraction = 2) BigDecimal price,
        @NotBlank @Size(max = 500) String imageUrl,
        @NotNull @Min(0) Integer stockQuantity,
        @NotNull Long categoryId,
        @NotNull @DecimalMin("0.0") @DecimalMax("5.0") BigDecimal rating
) {
}
