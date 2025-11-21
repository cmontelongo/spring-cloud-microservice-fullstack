package com.servicios.server.auth.security;


import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;

@Service
public class JwtService {

    private String secretKey;
    private final Key key;
    private long accessTokenMs;
    private long refreshTokenMs;

    public JwtService(@Value("${security.jwt.secret-key}") String secret,
                      @Value("${security.jwt.access-token-ms}") long accessTokenMs,
                      @Value("${security.jwt.refresh-token-ms}") long refreshTokenMs) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes());
        this.accessTokenMs = accessTokenMs;
        this.refreshTokenMs = refreshTokenMs;
    }

    public String generateAccessToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + accessTokenMs))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public String generateRefreshToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + refreshTokenMs))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public String extractUsername(String token) {
        return Jwts.parserBuilder().setSigningKey(key).build()
                .parseClaimsJws(token).getBody().getSubject();
    }

    public boolean isTokenValid(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException ex) {
            return false;
        }
    }

    public void setSecretKey(String secretKey) { this.secretKey = secretKey; }
    public void setAccessTokenMs(long accessTokenMs) { this.accessTokenMs = accessTokenMs; }
    public void setRefreshTokenMs(long refreshTokenMs) { this.refreshTokenMs = refreshTokenMs; }

    public long getAccessTokenMs() { return accessTokenMs; }
    public long getRefreshTokenMs() { return refreshTokenMs; }
    
}
