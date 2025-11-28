package com.servicios.server.dashboard.entity.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DashboardResponse {
        private long totalProducts;
    private long totalOrders;
    private double totalSales;
    private long outOfStockProducts;
}
