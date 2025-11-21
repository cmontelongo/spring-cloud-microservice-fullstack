package com.servicios.server.auth.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "app_user")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AppUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable=false, unique=true)
    private String email;

    @Column(nullable=false)
    private String password; // almacenar hash BCrypt

    @Column
    private String role; // e.g. "ROLE_USER"
}