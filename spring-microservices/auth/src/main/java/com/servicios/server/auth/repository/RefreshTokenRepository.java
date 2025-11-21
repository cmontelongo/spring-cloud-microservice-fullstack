package com.servicios.server.auth.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.servicios.server.auth.entity.AppUser;
import com.servicios.server.auth.entity.RefreshToken;

import java.util.Optional;
import java.util.List;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByToken(String token);
    List<RefreshToken> findAllByUser(AppUser user);
    void deleteAllByUser(AppUser user);
}