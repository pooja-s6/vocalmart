package com.vocalmart.service;

import com.vocalmart.dto.auth.AuthResponse;
import com.vocalmart.dto.auth.LoginRequest;
import com.vocalmart.dto.auth.RegisterRequest;
import com.vocalmart.dto.auth.UserResponse;
import com.vocalmart.entity.Cart;
import com.vocalmart.entity.Role;
import com.vocalmart.entity.User;
import com.vocalmart.exception.ConflictException;
import com.vocalmart.exception.ResourceNotFoundException;
import com.vocalmart.mapper.UserMapper;
import com.vocalmart.repository.CartRepository;
import com.vocalmart.repository.UserRepository;
import com.vocalmart.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final CartRepository cartRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String email = request.email().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            throw new ConflictException("An account with this email already exists");
        }
        User user = new User();
        user.setName(request.name().trim());
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setRole(Role.USER);
        userRepository.save(user);

        Cart cart = new Cart();
        cart.setUser(user);
        cartRepository.save(cart);

        return new AuthResponse(jwtService.generateToken(user.getEmail()), UserMapper.toResponse(user));
    }

    public AuthResponse login(LoginRequest request) {
        String email = request.email().trim().toLowerCase();
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, request.password()));
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return new AuthResponse(jwtService.generateToken(user.getEmail()), UserMapper.toResponse(user));
    }

    @Transactional(readOnly = true)
    public UserResponse me(User user) {
        User managed = userRepository.findById(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return UserMapper.toResponse(managed);
    }
}
