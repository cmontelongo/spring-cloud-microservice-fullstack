package com.servicios.server.auth.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;

import com.servicios.server.auth.dto.AuthRequest;
import com.servicios.server.auth.dto.AuthResponse;
import com.servicios.server.auth.dto.RefreshRequest;
import com.servicios.server.auth.entity.AppUser;
import com.servicios.server.auth.entity.RefreshToken;
import com.servicios.server.auth.repository.RefreshTokenRepository;
import com.servicios.server.auth.repository.UserRepository;
import com.servicios.server.auth.security.JwtService;

@ExtendWith(MockitoExtension.class)
class AuthServiceImplTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private RefreshTokenRepository refreshTokenRepository;
    @Mock
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;
    @Mock
    private AuthenticationManager authenticationManager;
    @Mock
    private JwtService jwtService;
    @Mock
    private JwtUserDetailsService userDetailsService;

    @InjectMocks
    private AuthServiceImpl authService;

    @Test
    void register_success_callsSaveAndReturnsAuthResponse() {
        AuthRequest req = new AuthRequest("test@example.com", "secret");
        when(userRepository.existsByEmail(req.username())).thenReturn(false);
        when(passwordEncoder.encode(req.password())).thenReturn("encoded");
        // Setup login internals
        when(userDetailsService.loadUserByUsername(req.username()))
                .thenReturn(new User(req.username(), "encoded", List.of(new SimpleGrantedAuthority("ROLE_USER"))));
        when(jwtService.generateAccessToken(req.username())).thenReturn("access-token");
        when(jwtService.generateRefreshToken(req.username())).thenReturn("refresh-token");
        when(jwtService.getRefreshTokenMs()).thenReturn(3600000L);
        AppUser savedUser = AppUser.builder().email(req.username()).password("encoded").role("ROLE_USER").build();
        when(userRepository.findByEmail(req.username())).thenReturn(Optional.of(savedUser));
        when(refreshTokenRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        AuthResponse resp = authService.register(req);

        assertEquals("access-token", resp.accessToken());
        assertEquals("refresh-token", resp.refreshToken());

        ArgumentCaptor<AppUser> userCaptor = ArgumentCaptor.forClass(AppUser.class);
        verify(userRepository).save(userCaptor.capture());
        AppUser captured = userCaptor.getValue();
        assertEquals(req.username(), captured.getEmail());
        assertEquals("encoded", captured.getPassword());

        verify(refreshTokenRepository).save(any(RefreshToken.class));
    }

    @Test
    void register_whenEmailExists_throws() {
        AuthRequest req = new AuthRequest("exists@example.com", "p");
        when(userRepository.existsByEmail(req.username())).thenReturn(true);

        RuntimeException ex = assertThrows(RuntimeException.class, () -> authService.register(req));
        assertEquals("Email already exists", ex.getMessage());
    }

    @Test
    void login_success_generatesTokensAndSavesRefreshToken() {
        AuthRequest req = new AuthRequest("u@example.com", "pw");
        // Authenticate does not throw
        //doNothing().when(authenticationManager).authenticate(any());
        when(userDetailsService.loadUserByUsername(req.username()))
                .thenReturn(new User(req.username(), "pw", List.of(new SimpleGrantedAuthority("ROLE_USER"))));
        when(jwtService.generateAccessToken(req.username())).thenReturn("a");
        when(jwtService.generateRefreshToken(req.username())).thenReturn("r");
        when(jwtService.getRefreshTokenMs()).thenReturn(1000L);
        AppUser user = AppUser.builder().email(req.username()).password("pw").role("ROLE_USER").build();
        when(userRepository.findByEmail(req.username())).thenReturn(Optional.of(user));
        when(refreshTokenRepository.save(any())).thenAnswer(i -> i.getArgument(0));

        AuthResponse resp = authService.login(req);

        assertEquals("a", resp.accessToken());
        assertEquals("r", resp.refreshToken());
        verify(authenticationManager).authenticate(any());
        verify(refreshTokenRepository).save(any(RefreshToken.class));
    }

    @Test
    void refresh_withValidToken_returnsNewAccess() {
        String token = "refresh123";
        RefreshRequest req = new RefreshRequest(token);
        when(jwtService.isTokenValid(token)).thenReturn(true);
        when(jwtService.extractUsername(token)).thenReturn("user1");
        AppUser user = AppUser.builder().email("user1").password("x").role("ROLE_USER").build();
        when(userRepository.findByEmail("user1")).thenReturn(Optional.of(user));
        RefreshToken rt = RefreshToken.builder()
                .token(token)
                .expiryDate(Instant.now().plusSeconds(60))
                .revoked(false)
                .user(user)
                .build();
        when(refreshTokenRepository.findByToken(token)).thenReturn(Optional.of(rt));
        when(jwtService.generateAccessToken("user1")).thenReturn("new-access");

        AuthResponse resp = authService.refresh(req);

        assertEquals("new-access", resp.accessToken());
        assertEquals(token, resp.refreshToken());
    }

    @Test
    void refresh_withInvalidToken_throws() {
        String token = "bad";
        RefreshRequest req = new RefreshRequest(token);
        when(jwtService.isTokenValid(token)).thenReturn(false);

        RuntimeException ex = assertThrows(RuntimeException.class, () -> authService.refresh(req));
        assertEquals("Invalid refresh token", ex.getMessage());
    }

    @Test
    void refresh_withRevokedOrExpired_throws() {
        String token = "t";
        RefreshRequest req = new RefreshRequest(token);
        when(jwtService.isTokenValid(token)).thenReturn(true);
        when(jwtService.extractUsername(token)).thenReturn("u");
        AppUser user = AppUser.builder().email("u").password("p").role("ROLE_USER").build();
        when(userRepository.findByEmail("u")).thenReturn(Optional.of(user));
        RefreshToken rt = RefreshToken.builder()
                .token(token)
                .expiryDate(Instant.now().minusSeconds(10))
                .revoked(false)
                .user(user)
                .build();
        when(refreshTokenRepository.findByToken(token)).thenReturn(Optional.of(rt));

        RuntimeException ex = assertThrows(RuntimeException.class, () -> authService.refresh(req));
        assertEquals("Refresh token invalid or expired", ex.getMessage());
    }

    @Test
    void logout_revokesTokenWhenFound() {
        String token = "tok";
        AppUser user = AppUser.builder().email("x").password("p").role("ROLE_USER").build();
        RefreshToken rt = RefreshToken.builder().token(token).revoked(false).expiryDate(Instant.now().plusSeconds(10)).user(user).build();
        when(refreshTokenRepository.findByToken(token)).thenReturn(Optional.of(rt));
        when(refreshTokenRepository.save(any())).thenAnswer(i -> i.getArgument(0));

        authService.logout(token);

        assertTrue(rt.isRevoked());
        verify(refreshTokenRepository).save(rt);
    }
}