package com.servicios.client.orders.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.servicios.client.orders.entity.Order;
import com.servicios.client.orders.entity.dto.MonthlySalesResponse;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUsername(String username);

    Optional<Order> findById(Long id);

    @Query("SELECT o FROM Order o JOIN FETCH o.items WHERE o.id = :id")
    Optional<Order> findByIdWithItems(Long id);

    @Query("SELECT COALESCE(SUM(o.total), 0) FROM Order o")
    double sumTotalRevenue();

    @Query("""
                SELECT new com.servicios.client.orders.entity.dto.MonthlySalesResponse(
                    YEAR(o.createdAt),
                    MONTH(o.createdAt),
                    SUM(o.total)
                )
                FROM Order o
                GROUP BY YEAR(o.createdAt), MONTH(o.createdAt)
                ORDER BY YEAR(o.createdAt), MONTH(o.createdAt)
            """)
    List<MonthlySalesResponse> getMonthlySales();

    @Query("SELECT SUM(o.total) FROM Order o")
    Double sumTotalSales();

}
