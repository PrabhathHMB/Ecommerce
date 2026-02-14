package com.example.backend.service;

import com.example.backend.exception.ProductException;
import com.example.backend.modal.Cart;
import com.example.backend.modal.CartItem;
import com.example.backend.modal.User;
import com.example.backend.request.AddItemRequest;

public interface CartService {
	
	public Cart createCart(User user);
	
	public CartItem addCartItem(String userId,AddItemRequest req) throws ProductException;
	
	public Cart findUserCart(String userId);
	
	public void clearCart(String userId);

}
