package com.example.backend.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.backend.modal.Order;
import com.example.backend.modal.User;

public interface OrderRepository extends MongoRepository<Order, String> {

	public List<Order> findByUser(User user);

	List<Order> findAllByOrderByCreatedAtDesc();
}
