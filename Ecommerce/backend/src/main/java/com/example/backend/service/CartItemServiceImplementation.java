package com.example.backend.service;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.backend.exception.CartItemException;
import com.example.backend.exception.UserException;
import com.example.backend.modal.Cart;
import com.example.backend.modal.CartItem;
import com.example.backend.modal.Product;
import com.example.backend.modal.User;
import com.example.backend.repository.CartItemRepository;
import com.example.backend.repository.CartRepository;

@Service
public class CartItemServiceImplementation implements CartItemService {
	
	private final CartItemRepository cartItemRepository;
	private final UserService userService;
	private final CartRepository cartRepository;
	
	public CartItemServiceImplementation(CartItemRepository cartItemRepository,UserService userService, CartRepository cartRepository) {
		this.cartItemRepository=cartItemRepository;
		this.userService=userService;
		this.cartRepository=cartRepository;
	}

	@Override
	public CartItem createCartItem(CartItem cartItem) {
		
		cartItem.setQuantity(cartItem.getQuantity());
		cartItem.setPrice(cartItem.getProduct().getPrice()*cartItem.getQuantity());
		cartItem.setDiscountedPrice(cartItem.getProduct().getDiscountedPrice()*cartItem.getQuantity());
		cartItem.setDiscountedPrice(cartItem.getProduct().getDiscountedPrice()*cartItem.getQuantity());
		
		CartItem createdCartItem=cartItemRepository.save(cartItem);
		System.out.println("DEBUG: CartItem saved to DB. ID: " + createdCartItem.getId());
		
		return createdCartItem;
	}

	@Override
	public CartItem updateCartItem(String userId, String id, CartItem cartItem) throws CartItemException, UserException {
		
		CartItem item=findCartItemById(id);
		User user=userService.findUserById(item.getUserId());
		
		
		if(user.getId().equals(userId)) {
			
			item.setQuantity(cartItem.getQuantity());
			item.setPrice(item.getQuantity()*item.getProduct().getPrice());
			item.setDiscountedPrice(item.getQuantity()*item.getProduct().getDiscountedPrice());
			
			CartItem updatedItem = cartItemRepository.save(item);
            
            // Trigger recalculation of cart totals
            Cart cart = item.getCart();
            if (cart != null) {
                calculateCartTotals(cart);
                cartRepository.save(cart);
            }
            
            return updatedItem;
			
		}
		else {
			throw new CartItemException("You can't update  another users cart_item");
		}
		
	}

	@Override
	public CartItem isCartItemExist(Cart cart, Product product, String size, String userId) {
		
		CartItem cartItem=cartItemRepository.findByCart_IdAndProduct_IdAndSizeAndUserId(
			cart.getId(), product.getId(), size, userId);
		
		return cartItem;
	}
	
	

	@Override
	public void removeCartItem(String userId,String cartItemId) throws CartItemException, UserException {
		
		System.out.println("userId- "+userId+" cartItemId "+cartItemId);
		
		CartItem cartItem=findCartItemById(cartItemId);
		
		User user=userService.findUserById(cartItem.getUserId());
		User reqUser=userService.findUserById(userId);
		
		if(user.getId().equals(reqUser.getId())) {
			Cart cart = cartItem.getCart();
			if(cart != null) {
				cart.getCartItems().removeIf(c -> c.getId().equals(cartItemId));
                calculateCartTotals(cart); // Recalculate after removal
				cartRepository.save(cart);
			}
			cartItemRepository.deleteById(cartItem.getId());
		}
		else {
			throw new UserException("you can't remove anothor users item");
		}
		
	}

	@Override
	public CartItem findCartItemById(String cartItemId) throws CartItemException {
		Optional<CartItem> opt=cartItemRepository.findById(cartItemId);
		
		if(opt.isPresent()) {
			return opt.get();
		}
		throw new CartItemException("cartItem not found with id : "+cartItemId);
	}

	@Override
	public java.util.Set<CartItem> findCartItemsByCartId(String cartId) {
		return cartItemRepository.findByCart_Id(cartId);
	}
    
    private void calculateCartTotals(Cart cart) {
        int totalPrice = 0;
        int totalDiscountedPrice = 0;
        int totalItem = 0;

        for (CartItem item : cart.getCartItems()) {
            totalPrice += item.getPrice();
            totalDiscountedPrice += item.getDiscountedPrice();
            totalItem += item.getQuantity();
        }

        cart.setTotalPrice(totalPrice);
        cart.setTotalItem(totalItem);
        cart.setDiscounte(totalPrice - totalDiscountedPrice);
        
        // Delivery Charge Logic
        if(totalDiscountedPrice < 10000) {
        	cart.setDeliveryCharges(400);
        	cart.setTotalDiscountedPrice(totalDiscountedPrice + 400);
        } else {
        	cart.setDeliveryCharges(0);
        	cart.setTotalDiscountedPrice(totalDiscountedPrice);
        }
    }

    @Override
    public void deleteAllCartItems(String cartId) {
        java.util.Set<CartItem> items = findCartItemsByCartId(cartId);
        cartItemRepository.deleteAll(items);
    }

}
