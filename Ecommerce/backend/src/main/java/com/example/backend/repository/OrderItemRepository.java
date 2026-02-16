package com.example.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.backend.modal.OrderItem;

public interface OrderItemRepository extends MongoRepository<OrderItem, String> {

}
