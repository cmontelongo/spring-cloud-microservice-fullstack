package com.servicios.client.orders.entity.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderStatsResponse {
    private long totalOrders;
    private double totalRevenue;
}
