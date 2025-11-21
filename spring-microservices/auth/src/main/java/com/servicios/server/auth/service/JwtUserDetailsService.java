package com.servicios.server.auth.service;

import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import com.servicios.server.auth.entity.AppUser;
import com.servicios.server.auth.repository.UserRepository;

@Service
public class JwtUserDetailsService implements UserDetailsService {

    private final UserRepository repo;

    public JwtUserDetailsService(UserRepository repo) {
        this.repo = repo;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        AppUser u = repo.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return org.springframework.security.core.userdetails.User
                .withUsername(u.getEmail())
                .password(u.getPassword())
                .authorities(u.getRole())
                .build();
    }
}
