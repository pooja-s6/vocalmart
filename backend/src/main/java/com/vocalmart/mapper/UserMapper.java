package com.vocalmart.mapper;

import com.vocalmart.dto.auth.UserResponse;
import com.vocalmart.entity.User;

public final class UserMapper {

    private UserMapper() {
    }

    public static UserResponse toResponse(User user) {
        return new UserResponse(user.getId(), user.getName(), user.getEmail(), user.getRole(), user.getCreatedAt());
    }
}
