package com.servicios.server.auth.service;

import com.servicios.server.auth.dto.AuthRequest;
import com.servicios.server.auth.dto.AuthResponse;
import com.servicios.server.auth.dto.RefreshRequest;

public interface AuthService {
    AuthResponse register(AuthRequest request);
    AuthResponse login(AuthRequest request);
    AuthResponse refresh(RefreshRequest request);
    void logout(String refreshToken);
}