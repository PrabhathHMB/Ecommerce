package com.example.backend.service;

import org.springframework.stereotype.Service;

import com.example.backend.exception.ProductException;
import com.example.backend.modal.Cart;
import com.example.backend.modal.CartItem;
import com.example.backend.modal.Product;
import com.example.backend.modal.User;
import com.example.backend.repository.CartRepository;
import com.example.backend.request.AddItemRequest;

@Service
public class CartServiceImplementation implements CartService{
	
	private final CartRepository cartRepository;
	private final CartItemService cartItemService;
	private final ProductService productService;
	
	
	public CartServiceImplementation(CartRepository cartRepository,CartItemService cartItemService,
			ProductService productService) {
		this.cartRepository=cartRepository;
		this.productService=productService;
		this.cartItemService=cartItemService;
	}

	@Override
	public Cart createCart(User user) {
		
		Cart cart = new Cart();
		cart.setUser(user);
		Cart createdCart=cartRepository.save(cart);
		return createdCart;
	}
	
	@Override
	public Cart findUserCart(String userId) {
		Cart cart =	cartRepository.findByUser_Id(userId);
		
		// Fix: Fetch fresh items directly from DB to avoid stale data issue with @DBRef
		java.util.Set<CartItem> freshItems = cartItemService.findCartItemsByCartId(cart.getId());
		cart.setCartItems(freshItems);
		
        // Optimized: Calculation is now done on write (add/update/remove). 
        // We just return the persisted cart state.
		
		return cart;
		
	}

	@Override
	public CartItem addCartItem(String userId, AddItemRequest req) throws ProductException {
		Cart cart=cartRepository.findByUser_Id(userId);
		Product product=productService.findProductById(req.getProductId());
		
		CartItem isPresent=cartItemService.isCartItemExist(cart, product, req.getSize(),userId, req.getColor());
		System.out.println("DEBUG: isCartItemExist result: " + isPresent);
		
		if(isPresent == null) {
			CartItem cartItem = new CartItem();
			cartItem.setProduct(product);
			cartItem.setCart(cart);
			cartItem.setQuantity(req.getQuantity());
			cartItem.setUserId(userId);
			
			int price=req.getQuantity()*product.getDiscountedPrice();
			cartItem.setPrice(price);
			cartItem.setSize(req.getSize());
			cartItem.setColor(req.getColor());
			
			CartItem createdCartItem=cartItemService.createCartItem(cartItem);
			System.out.println("DEBUG: Created CartItem with ID: " + createdCartItem.getId());
			
			if(cart.getCartItems()==null) {
				cart.setCartItems(new java.util.HashSet<>());
			}
			
			cart.getCartItems().add(createdCartItem);
            
            // Calculate totals and save
            calculateCartTotals(cart);
            cartRepository.save(cart);
            
			System.out.println("DEBUG: Saved cart with new item. Total items: " + cart.getCartItems().size());
			return createdCartItem;
		}
		
		// Handle case where item already exists
		System.out.println("DEBUG: Item already exists. Updating quantity and ensuring link.");
		isPresent.setQuantity(isPresent.getQuantity() + req.getQuantity());
		CartItem updatedItem = cartItemService.createCartItem(isPresent); // Logic in createCartItem recalculates price
		
		if(cart.getCartItems() == null) {
			cart.setCartItems(new java.util.HashSet<>());
		}
		cart.getCartItems().add(updatedItem); // This is safe because of Set and equals() on ID
        
        // Calculate totals and save
        calculateCartTotals(cart);
		cartRepository.save(cart);
        
		System.out.println("DEBUG: Updated existing item quantity and saved cart.");
		
		return updatedItem;
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
	public void clearCart(String userId) {
		Cart cart = findUserCart(userId);
		if (cart != null && cart.getCartItems() != null && !cart.getCartItems().isEmpty()) {
			// 1. Delete all cart items from the database
			cartItemService.deleteAllCartItems(cart.getId());
			
			// 2. Clear the cart object and reset totals
			cart.getCartItems().clear();
			cart.setTotalPrice(0);
			cart.setTotalDiscountedPrice(0);
			cart.setTotalItem(0);
			cart.setDiscounte(0);
			
			cartRepository.save(cart);
		}
	}

}
