package com.example.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.example.backend.modal.Cart;

public interface CartRepository extends MongoRepository<Cart, String> {

	public Cart findByUser_Id(String userId);
}
