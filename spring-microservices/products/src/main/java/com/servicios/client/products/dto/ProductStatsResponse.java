package com.servicios.client.products.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductStatsResponse {
    private long totalProducts;
    private long totalStock;
}
