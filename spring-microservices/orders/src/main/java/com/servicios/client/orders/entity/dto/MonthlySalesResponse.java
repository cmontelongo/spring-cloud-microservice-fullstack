package com.servicios.client.orders.entity.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class MonthlySalesResponse {
    private int year;
    private int month;
    private double total;
}
