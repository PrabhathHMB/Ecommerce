package com.example.backend.Wishlist.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.example.backend.Auth.UtilSecurity.SecurityUtil;
import com.example.backend.Product.Model.Product;
import com.example.backend.Wishlist.Model.WishlistModel;
import com.example.backend.Wishlist.Service.WishlistService;



import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
@CrossOrigin(origins = "http://localhost:5173")
public class WishlistController {

    @Autowired
    private WishlistService wishlistService;

    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @GetMapping
    public WishlistModel getWishlist() {
        String userId = SecurityUtil.getCurrentUserId(); // Fetch user ID dynamically from SecurityContext
        return wishlistService.getWishlistByUserId(userId);
    }

    // Retrieve wishlist with product details
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @GetMapping("/detail")
    public List<Product> getWishlistWithProductDetails() {
        String userId = SecurityUtil.getCurrentUserId(); // Fetch user ID dynamically from SecurityContext
        return wishlistService.getWishlistWithProductDetails(userId);
    }

    // Add product to wishlist
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @PostMapping("/add")
    public WishlistModel addProductToWishlist(@RequestParam String productId) {
        String userId = SecurityUtil.getCurrentUserId(); // Fetch user ID dynamically from SecurityContext
        return wishlistService.addItemToWishlist(userId, productId);
    }

    // Remove product from wishlist
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @DeleteMapping("/remove")
    public WishlistModel removeProductFromWishlist( @RequestParam String productId) {
        String userId = SecurityUtil.getCurrentUserId(); // Fetch user ID dynamically from SecurityContext
        return wishlistService.removeItemFromWishlist(userId, productId);
    }

    // Clear entire wishlist
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @DeleteMapping("/clear")
    public void clearWishlist() {
        String userId = SecurityUtil.getCurrentUserId(); // Fetch user ID dynamically from SecurityContext
        wishlistService.clearWishlist(userId);
    }
}

