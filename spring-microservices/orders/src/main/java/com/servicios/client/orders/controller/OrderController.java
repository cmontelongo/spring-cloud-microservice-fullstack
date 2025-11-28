package com.servicios.client.orders.controller;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.servicios.client.orders.entity.Order;
import com.servicios.client.orders.entity.dto.MonthlySalesResponse;
import com.servicios.client.orders.entity.dto.OrderStatsResponse;
import com.servicios.client.orders.repository.OrderRepository;
import com.servicios.client.orders.service.OrderService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final OrderRepository orderRepository;

    @GetMapping
    public List<Order> myOrders(@RequestHeader("X-User") String username) {
        return orderService.getOrdersByUser(username);
    }

    @PostMapping
    public Order createOrder(
            @RequestHeader("X-User") String username,
            @RequestBody Order order) {
        order.setUsername(username);
        return orderService.createOrder(order);
    }

    @GetMapping("/{id}")
    public Order getOrderById(
            @PathVariable Long id,
            @RequestHeader("X-User") String username) {
        return orderService.getOrderById(id, username);
    }

    @GetMapping("/stats")
    public OrderStatsResponse getOrderStats(
            @RequestHeader("X-User") String username) {
        // si quieres validar que solo ciertos roles puedan verlo, aquí es el lugar
        return orderService.getStats();
    }

    @GetMapping("/stats/monthly-sales")
    public List<MonthlySalesResponse> getMonthlySales(
            @RequestHeader("X-User") String username) {
        return orderService.getMonthlySales();
    }

    @GetMapping("/count")
    public long countOrders() {
        return orderService.count();
    }

    @GetMapping("/total-sales")
    public double totalSales() {
        return orderService.sumTotalSales();
    }

}
