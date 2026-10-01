package com.vocalmart.security;

import com.vocalmart.entity.User;
import org.springframework.security.authentication.InsufficientAuthenticationException;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
public class CurrentUserService {

    public User require(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()
                || !(authentication.getPrincipal() instanceof SecurityUser securityUser)) {
            throw new InsufficientAuthenticationException("Authentication is required");
        }
        return securityUser.getUser();
    }
}
