package com.servicios.client.products.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.servicios.client.products.dto.ProductRequest;
import com.servicios.client.products.dto.ProductResponse;
import com.servicios.client.products.entity.Product;
import com.servicios.client.products.repository.ProductRepository;
import com.servicios.client.products.service.ProductService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository repo;

    private ProductResponse toResponse(Product p) {
        return new ProductResponse(p.getId(), p.getSku(), p.getName(), p.getDescription(), p.getPrice(), p.getStock());
    }

    @Override
    public ProductResponse create(ProductRequest req) {
        Product p = Product.builder()
                .sku(req.getSku())
                .name(req.getName())
                .description(req.getDescription())
                .price(req.getPrice())
                .stock(req.getStock())
                .build();
        Product saved = repo.save(p);
        return toResponse(saved);
    }

    @Override
    public ProductResponse update(Long id, ProductRequest req) {
        Product p = repo.findById(id).orElseThrow(() -> new RuntimeException("Product not found"));
        p.setName(req.getName());
        p.setDescription(req.getDescription());
        p.setPrice(req.getPrice());
        p.setStock(req.getStock());
        Product updated = repo.save(p);
        return toResponse(updated);
    }

    @Override
    public void delete(Long id) {
        repo.deleteById(id);
    }

    @Override
    public ProductResponse getById(Long id) {
        Product p = repo.findById(id).orElseThrow(() -> new RuntimeException("Product not found"));
        return toResponse(p);
    }

    @Override
    public List<ProductResponse> getAll() {
        return repo.findAll().stream().map(this::toResponse).toList();
    }
    
}
