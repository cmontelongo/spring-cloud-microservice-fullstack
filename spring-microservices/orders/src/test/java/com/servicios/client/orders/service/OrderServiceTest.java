package com.servicios.client.orders.service;

import com.servicios.client.orders.entity.Order;
import com.servicios.client.orders.repository.OrderRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @InjectMocks
    private OrderService orderService;

    @Test
    void getOrdersByUser_returnsOrdersForGivenUsername() {
        String username = "testuser";
        Order order1 = Order.builder().id(1L).build();
        Order order2 = Order.builder().id(2L).build();
        List<Order> orders = Arrays.asList(order1, order2);

        when(orderRepository.findByUsername(username)).thenReturn(orders);

        List<Order> result = orderService.getOrdersByUser(username);

        assertEquals(2, result.size());
        assertTrue(result.contains(order1));
        assertTrue(result.contains(order2));
        verify(orderRepository, times(1)).findByUsername(username);
    }

    @Test
    void getOrdersByUser_returnsEmptyListWhenNoOrdersFound() {
        String username = "nouser";
        when(orderRepository.findByUsername(username)).thenReturn(Collections.emptyList());

        List<Order> result = orderService.getOrdersByUser(username);

        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(orderRepository, times(1)).findByUsername(username);
    }
}