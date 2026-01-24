package com.example.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.backend.modal.CartItem;

public interface CartItemRepository extends MongoRepository<CartItem, String> {

	public CartItem findByCart_IdAndProduct_IdAndSizeAndUserId(String cartId, String productId, String size, String userId);
	
	public java.util.Set<CartItem> findByCart_Id(String cartId);
}
