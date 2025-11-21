package com.servicios.server.auth.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.servicios.server.auth.entity.AppUser;

import java.util.Optional;

public interface UserRepository extends JpaRepository<AppUser, Long> {
    Optional<AppUser> findByEmail(String email);
    boolean existsByEmail(String email);
}
