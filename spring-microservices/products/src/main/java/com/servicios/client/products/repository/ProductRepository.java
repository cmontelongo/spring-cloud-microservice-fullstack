package com.servicios.client.products.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.servicios.client.products.entity.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {
    Optional<Product> findBySku(String sku);

    @Query("SELECT COALESCE(SUM(p.stock), 0) FROM Product p")
    long sumStock();

        // Contar todos los productos
    long count();

    // Contar productos sin stock (o stock <= 0)
    long countByStockLessThanEqual(Integer stock);
}
