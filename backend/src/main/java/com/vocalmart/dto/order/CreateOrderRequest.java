package com.vocalmart.dto.order;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CreateOrderRequest(
        @NotBlank @Size(max = 120) String fullName,
        @NotBlank @Pattern(regexp = "^[0-9]{10}$", message = "Enter a 10-digit phone number") String phone,
        @NotBlank @Size(max = 255) String addressLine,
        @NotBlank @Size(max = 100) String city,
        @NotBlank @Pattern(regexp = "^[0-9]{6}$", message = "Enter a 6-digit postal code") String postalCode
) {
}
