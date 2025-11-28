package com.servicios.client.products.service;

import java.util.List;

import com.servicios.client.products.dto.ProductRequest;
import com.servicios.client.products.dto.ProductResponse;
import com.servicios.client.products.dto.ProductStatsResponse;

public interface ProductService {
    ProductResponse create(ProductRequest req);
    ProductResponse update(Long id, ProductRequest req);
    void delete(Long id);
    ProductResponse getById(Long id);
    List<ProductResponse> getAll();
    public ProductStatsResponse getStats();
    public long count();
    public long countByStockLessThanEqual(int i);
}
