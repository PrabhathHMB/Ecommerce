package com.example.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.backend.modal.CartItem;

public interface CartItemRepository extends MongoRepository<CartItem, String> {

<<<<<<< HEAD
	public CartItem findByCart_IdAndProduct_IdAndSizeAndUserIdAndColor(String cartId, String productId, String size, String userId, String color);
	
=======
	public CartItem findByCart_IdAndProduct_IdAndSizeAndUserIdAndColor(String cartId, String productId, String size,
			String userId, String color);

>>>>>>> f3b6a345980233ed739f0533bd19c64770bd705a
	public java.util.Set<CartItem> findByCart_Id(String cartId);
}
