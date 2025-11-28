package com.servicios.client.products.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.servicios.client.products.dto.ProductRequest;
import com.servicios.client.products.dto.ProductResponse;
import com.servicios.client.products.dto.ProductStatsResponse;
import com.servicios.client.products.service.ProductService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public ResponseEntity<List<ProductResponse>> all() {
        return ResponseEntity.ok(productService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> get(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getById(id));
    }

    @PostMapping
    public ResponseEntity<ProductResponse> create(@RequestBody ProductRequest req,
            @RequestHeader(value = "X-User", required = false) String user) {
        // opcion: auditar por user
        return ResponseEntity.ok(productService.create(req));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductResponse> update(
            @PathVariable Long id,
            @RequestBody ProductRequest req) {
        return ResponseEntity.ok(productService.update(id, req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        productService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/stats")
    public ProductStatsResponse getProductStats(
            @RequestHeader("X-User") String username) {
        return productService.getStats();
    }

    @GetMapping("/stock-summary")
    public List<ProductResponse> getStockSummary(
            @RequestHeader("X-User") String username) {
        // ejemplo simple: regresar todos y filtras en el front, o
        // aquí podrías ordenar por stock asc y limitar (top 5 con menos stock)
        return productService.getAll();
    }

    @GetMapping("/count")
    public long countProducts() {
        return productService.count();
    }

    @GetMapping("/out-of-stock")
    public long outOfStock() {
        return productService.countByStockLessThanEqual(0);
    }

}
