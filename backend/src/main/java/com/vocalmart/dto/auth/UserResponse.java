package com.vocalmart.dto.auth;

import com.vocalmart.entity.Role;
import java.time.LocalDateTime;

public record UserResponse(Long id, String name, String email, Role role, LocalDateTime createdAt) {
}
