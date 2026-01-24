package com.example.backend.service;

import com.example.backend.exception.CartItemException;
import com.example.backend.exception.UserException;
import com.example.backend.modal.Cart;
import com.example.backend.modal.CartItem;
import com.example.backend.modal.Product;

public interface CartItemService {
	
	public CartItem createCartItem(CartItem cartItem);
	
	public CartItem updateCartItem(String userId, String id,CartItem cartItem) throws CartItemException, UserException;
	
	public CartItem isCartItemExist(Cart cart,Product product,String size, String userId);
	
	public void removeCartItem(String userId,String cartItemId) throws CartItemException, UserException;
	
	public CartItem findCartItemById(String cartItemId) throws CartItemException;
    
    public java.util.Set<CartItem> findCartItemsByCartId(String cartId);
    
    public void deleteAllCartItems(String cartId);
}
