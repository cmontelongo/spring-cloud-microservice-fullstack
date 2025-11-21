package com.servicios.server.gateway.config;

import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import reactor.core.publisher.Mono;

@Component
public class UserContextFilter implements GlobalFilter {

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {

        String header = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);

        if (header == null || !header.startsWith("Bearer ")) {
            return chain.filter(exchange);
        }
        System.out.println("TOKEN RECIBIDO: >" + header + "<");

        String token = header.substring(7).trim();  // ← importante

        return chain.filter(
            exchange.mutate()
                .request(builder -> builder.header("X-User", extractSubject(token)))
                .build()
        );
    }

    private String extractSubject(String token) {
        return Jwts.parserBuilder()
                .setSigningKey("xqVubEv4q6e4IwbGfmPk5uJRvbgYQfaWsPplfAE4eUc=".getBytes())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }
    

    public Mono<Void> filterOLD(ServerWebExchange exchange, GatewayFilterChain chain) {
        String authHeader = exchange.getRequest().getHeaders().getFirst("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);

            // Extraer el "sub"
            Claims claims = Jwts.parserBuilder()
                .setSigningKey("xqVubEv4q6e4IwbGfmPk5uJRvbgYQfaWsPplfAE4eUc=".getBytes())
                .build()
                .parseClaimsJws(token)
                .getBody();

            String username = claims.getSubject();

            // Añadir header para los microservicios
            exchange = exchange.mutate()
                .request(r -> r.header("X-User", username))
                .build();
        }

        return chain.filter(exchange);
    }
}
