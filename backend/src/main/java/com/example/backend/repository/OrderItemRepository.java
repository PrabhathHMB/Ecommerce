package com.example.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.modal.OrderItem;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

}
