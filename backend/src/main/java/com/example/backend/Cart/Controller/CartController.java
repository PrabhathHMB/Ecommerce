package com.example.backend.Cart.Controller;

import com.example.backend.Auth.UtilSecurity.SecurityUtil;
import com.example.backend.Cart.Model.CartModel;
import com.example.backend.Cart.Service.CartService;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
//import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:5173" ,allowCredentials = "true")
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    // Get cart details for the authenticated user
    @GetMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<CartModel> getCart() {
        String userId = SecurityUtil.getCurrentUserId(); // Fetch user ID dynamically from SecurityContext
        CartModel cart = cartService.getCartByUserId(userId);
        return ResponseEntity.ok(cart);
    }
    

    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @GetMapping("/details")
    public ResponseEntity<CartModel> getCartWithDetails() {
        String userId = SecurityUtil.getCurrentUserId(); // Fetch user ID dynamically from SecurityContext
        CartModel cart = cartService.getCartWithProductDetails(userId); // Fetch cart with product details
        return ResponseEntity.ok(cart);
    }

    // Add item to cart for the authenticated user
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @PostMapping("/add")
    public ResponseEntity<CartModel> addItemToCart(@RequestBody AddItemRequest addItemRequest) {
        String userId = SecurityUtil.getCurrentUserId(); // Fetch user ID dynamically
        CartModel updatedCart = cartService.addItemToCart(
                userId,
                addItemRequest.getProductId(),
                addItemRequest.getQuantity(),
                addItemRequest.getVariation()
        );
        return ResponseEntity.ok(updatedCart);
    }

    // Remove item from cart for the authenticated user
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @DeleteMapping("/remove")
    public ResponseEntity<CartModel> removeItemFromCart(@RequestBody RemoveFromCartRequest request) {
        String userId = SecurityUtil.getCurrentUserId(); // Fetch user ID dynamically
        CartModel updatedCart = cartService.removeItemFromCart(userId, request.getProductId(), request.getVariation());
        return ResponseEntity.ok(updatedCart);
    }

    // Clear entire cart for the authenticated user
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @DeleteMapping("/clear")
    public ResponseEntity<Void> clearCart() {
        String userId = SecurityUtil.getCurrentUserId(); // Fetch user ID dynamically
        cartService.clearCart(userId);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    // DTOs with Lombok annotations
    @Data
    public static class AddItemRequest {
        private String productId;
        private int quantity;
        private Map<String, String> variation; // Accept variations as a map
    }
    
    @Data
    public static class RemoveFromCartRequest {
        private String productId;
        private Map<String, String> variation; // Accept variations as a map
    }
  
}
