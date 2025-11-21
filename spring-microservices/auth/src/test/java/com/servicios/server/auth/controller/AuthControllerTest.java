package com.servicios.server.auth.controller;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import com.servicios.server.auth.dto.AuthRequest;
import com.servicios.server.auth.dto.AuthResponse;
import com.servicios.server.auth.dto.RefreshRequest;
import com.servicios.server.auth.service.AuthService;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    @Mock
    private AuthService authService;

    @InjectMocks
    private AuthController controller;

    @Test
    void register_returnsAuthResponse() {
        AuthRequest req = mock(AuthRequest.class);
        AuthResponse respObj = mock(AuthResponse.class);

        when(authService.register(req)).thenReturn(respObj);

        ResponseEntity<AuthResponse> response = controller.register(req);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertSame(respObj, response.getBody());
        verify(authService, times(1)).register(req);
    }

    @Test
    void login_returnsAuthResponse() {
        AuthRequest req = mock(AuthRequest.class);
        AuthResponse respObj = mock(AuthResponse.class);

        when(authService.login(req)).thenReturn(respObj);

        ResponseEntity<AuthResponse> response = controller.login(req);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertSame(respObj, response.getBody());
        verify(authService, times(1)).login(req);
    }

    @Test
    void refresh_returnsAuthResponse() {
        RefreshRequest req = mock(RefreshRequest.class);
        AuthResponse respObj = mock(AuthResponse.class);

        when(authService.refresh(req)).thenReturn(respObj);

        ResponseEntity<AuthResponse> response = controller.refresh(req);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertSame(respObj, response.getBody());
        verify(authService, times(1)).refresh(req);
    }

    @Test
    void logout_callsServiceAndReturnsNoContent() {
        RefreshRequest req = mock(RefreshRequest.class);
        when(req.refreshToken()).thenReturn("refresh-token-123");

        ResponseEntity<Void> response = controller.logout(req);

        verify(authService, times(1)).logout("refresh-token-123");
        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        assertNull(response.getBody());
    }
}