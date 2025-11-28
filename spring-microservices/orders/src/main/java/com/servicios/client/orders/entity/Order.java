package com.servicios.client.orders.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;  // viene del header X-User
    
    private String customerId;
    
    private Double total;
    
    @OneToMany(
            mappedBy = "order",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.EAGER  // 👈 Para que cargue los items automáticamente
        )
    @JsonManagedReference
    private List<OrderItemEntity> items = new ArrayList<>();

    // MÉTODO DE AYUDA
    public void addItem(OrderItemEntity item) {
        item.setOrder(this);
        items.add(item);
    }

    private LocalDateTime createdAt;
    
}
