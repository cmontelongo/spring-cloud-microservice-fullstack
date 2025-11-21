package com.servicios.server.auth.service;

import java.time.Instant;
import java.util.Optional;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.servicios.server.auth.dto.AuthRequest;
import com.servicios.server.auth.dto.AuthResponse;
import com.servicios.server.auth.dto.RefreshRequest;
import com.servicios.server.auth.entity.AppUser;
import com.servicios.server.auth.entity.RefreshToken;
import com.servicios.server.auth.repository.RefreshTokenRepository;
import com.servicios.server.auth.repository.UserRepository;
import com.servicios.server.auth.security.JwtService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final JwtUserDetailsService userDetailsService;

    @Override
    public AuthResponse register(AuthRequest request) {
    	System.out.println(request.username());
    	System.out.println(request.password());
        if (userRepository.existsByEmail(request.username())) {
            throw new RuntimeException("Email already exists");
        }
        AppUser user = AppUser.builder()
                .email(request.username())
                .password(passwordEncoder.encode(request.password()))
                .role("ROLE_USER")
                .build();
        userRepository.save(user);
        return login(request);
    }

    @Override
    public AuthResponse login(AuthRequest request) {
    	System.out.println(request.username());
    	System.out.println(request.password());
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.username(), request.password())
        );
        System.out.println(request.username());
        System.out.println(request.password());
        UserDetails ud = userDetailsService.loadUserByUsername(request.username());
        String access = jwtService.generateAccessToken(ud.getUsername());
        String refresh = jwtService.generateRefreshToken(ud.getUsername());

        AppUser user = userRepository.findByEmail(ud.getUsername()).orElseThrow();

        RefreshToken rt = RefreshToken.builder()
                .token(refresh)
                .expiryDate(Instant.now().plusMillis(jwtService.getRefreshTokenMs()))
                .user(user)
                .revoked(false)
                .build();
        refreshTokenRepository.save(rt);

        return new AuthResponse(access, refresh);
    }

    @Override
    public AuthResponse refresh(RefreshRequest request) {
        String token = request.refreshToken();
        if (!jwtService.isTokenValid(token)) throw new RuntimeException("Invalid refresh token");
        String username = jwtService.extractUsername(token);
        AppUser user = userRepository.findByEmail(username).orElseThrow();
        Optional<RefreshToken> stored = refreshTokenRepository.findByToken(token);
        if (stored.isEmpty() || stored.get().isRevoked() || stored.get().getExpiryDate().isBefore(Instant.now()))
            throw new RuntimeException("Refresh token invalid or expired");

        String newAccess = jwtService.generateAccessToken(username);
        return new AuthResponse(newAccess, token);
    }

    @Override
    public void logout(String refreshToken) {
        refreshTokenRepository.findByToken(refreshToken).ifPresent(rt -> {
            rt.setRevoked(true);
            refreshTokenRepository.save(rt);
        });
    }
}
