package com.servicios.server.dashboard.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import com.servicios.server.dashboard.entity.dto.DashboardResponse;

import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
@Slf4j
public class DashboardService {

        private final WebClient.Builder webClient;

        public DashboardResponse getDashboardStats(String jwt) {

                if (jwt == null || !jwt.startsWith("Bearer ")) {
                        throw new IllegalArgumentException("JWT inválido o no enviado");
                }

                // Normalizar token
                String token = jwt.replace("Bearer ", "");

                // Cliente WebClient preconfigurado
                WebClient client = webClient.build();

                long totalProducts = fetchLong(client, "http://products-service:9001/products/count", token, 0L);
                long outOfStockProducts = fetchLong(client, "http://products-service:9001/products/out-of-stock", token,
                                0L);
                long totalOrders = fetchLong(client, "http://orders-service:9002/orders/count", token, 0L);
                double totalSales = fetchLong(client, "http://orders-service:9002/orders/total-sales", token, 0L);

                return new DashboardResponse(totalProducts, totalOrders, totalSales, outOfStockProducts);
        }

        @SuppressWarnings("null")
        private long fetchLong(WebClient client, String url, String token, long fallback) {
                try {
                        return client.get()
                                        .uri(url)
                                        .header("Authorization", "Bearer " + token)
                                        .retrieve()
                                        .onStatus(status -> status.isError(), response -> {
                                                log.error("Error HTTP {} al llamar {}", response.statusCode(), url);
                                                return Mono.error(new RuntimeException(
                                                                "Error en servicio remoto: " + url));
                                        })
                                        .bodyToMono(Long.class)
                                        .timeout(java.time.Duration.ofSeconds(5)) // prevenir cuelgues
                                        .doOnError(err -> log.error("Falló la petición a {}: {}", url,
                                                        err.getMessage()))
                                        .block();
                } catch (WebClientResponseException ex) {
                        log.error("Error del servicio {} - status {}, response: {}", url, ex.getStatusCode().value(),
                                        ex.getResponseBodyAsString());
                } catch (Exception ex) {
                        log.error("Error inesperado llamando a {}: {}", url, ex.getMessage());
                }

                log.warn("Usando fallback={} para {}", fallback, url);
                return fallback;
        }
}
