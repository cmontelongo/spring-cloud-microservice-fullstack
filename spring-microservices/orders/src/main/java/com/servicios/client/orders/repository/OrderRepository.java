package com.servicios.client.orders.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.servicios.client.orders.entity.Order;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUsername(String username);
    Optional<Order> findById(Long id);

    @Query("SELECT o FROM Order o JOIN FETCH o.items WHERE o.id = :id")
    Optional<Order> findByIdWithItems(Long id);

}
