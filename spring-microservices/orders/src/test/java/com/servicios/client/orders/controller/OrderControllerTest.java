package com.servicios.client.orders.controller;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.times;
import static org.junit.jupiter.api.Assertions.assertSame;
import java.util.List;
import java.util.Arrays;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import com.servicios.client.orders.entity.Order;
import com.servicios.client.orders.repository.OrderRepository;
import com.servicios.client.orders.service.OrderService;

@ExtendWith(MockitoExtension.class)
class OrderControllerTest {

    @Mock
    OrderService orderService;

    @Mock
    OrderRepository orderRepository;

    @Captor
    ArgumentCaptor<Long> longCaptor;

    @Test
    void myOrders_callsServiceAndReturnsList() {
        OrderController controller = new OrderController(orderService, orderRepository);
        Order o = new Order();
        List<Order> expected = Arrays.asList(o);

        when(orderService.getOrdersByUser("alice")).thenReturn(expected);

        List<Order> result = controller.myOrders("alice");

        assertSame(expected, result);
        verify(orderService, times(1)).getOrdersByUser("alice");
    }

    @Test
    void createOrder_setsUsernameAndCallsService() {
        OrderController controller = new OrderController(orderService, orderRepository);

        // Use a Mockito mock for the incoming Order so we can verify setUsername was invoked.
        Order incoming = org.mockito.Mockito.mock(Order.class);
        Order created = new Order();
        when(orderService.createOrder(incoming)).thenReturn(created);

        Order result = controller.createOrder("bob", incoming);

        // verify controller set the username on the provided order
        verify(incoming, times(1)).setUsername("bob");
        // verify service was called with the same order instance
        verify(orderService, times(1)).createOrder(incoming);
        assertSame(created, result);
    }

    @Test
    void getOrderById_callsServiceWithIdAndUser() {
        OrderController controller = new OrderController(orderService, orderRepository);
        Order returned = new Order();
        when(orderService.getOrderById(42L, "carla")).thenReturn(returned);

        Order result = controller.getOrderById(42L, "carla");

        assertSame(returned, result);
        verify(orderService, times(1)).getOrderById(42L, "carla");
    }
}