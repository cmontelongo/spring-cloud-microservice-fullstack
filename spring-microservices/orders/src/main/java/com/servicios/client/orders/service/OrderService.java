package com.servicios.client.orders.service;

import java.util.List;
import org.springframework.stereotype.Service;
import com.servicios.client.orders.entity.Order;
import com.servicios.client.orders.entity.dto.MonthlySalesResponse;
import com.servicios.client.orders.entity.dto.OrderStatsResponse;
import com.servicios.client.orders.repository.OrderRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrderService {

	private final OrderRepository orderRepository;

	public List<Order> getOrdersByUser(String username) {
		return orderRepository.findByUsername(username);
	}

	public Order createOrder(String username, Double total) {
		return orderRepository.save(
				Order.builder()
						.id(1L)
						.total(total)
						.build());
	}

	public Order createOrder(Order order) {
		order.getItems().forEach(item -> item.setOrder(order));
		return orderRepository.save(order);
	}

	public Order getOrderById(Long id, String username) {
		Order order = orderRepository.findByIdWithItems(id)
				.orElseThrow(() -> new RuntimeException("Order not found"));

		if (!order.getUsername().equals(username)) {
			throw new RuntimeException("Access denied: you do not own this order");
		}

		return order;
	}

	public OrderStatsResponse getStats() {
		long totalOrders = orderRepository.count();
		double totalRevenue = orderRepository.sumTotalRevenue();
		return new OrderStatsResponse(totalOrders, totalRevenue);
	}

	public List<MonthlySalesResponse> getMonthlySales() {
		return orderRepository.getMonthlySales();
	}

    public long count() {
		return orderRepository.count();
    }

    public double sumTotalSales() {
		return orderRepository.sumTotalSales();
	}

}