package com.example.backend.Wishlist.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.backend.Wishlist.Model.WishlistModel;
import com.example.backend.Wishlist.Repository.WishlistRepository;
import com.example.backend.Product.Model.Product;
import com.example.backend.Product.Service.ProductService;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class WishlistService {

    @Autowired
    private WishlistRepository wishlistRepository;

    @Autowired
    private ProductService productService; // Assuming ProductService is already available

    // Retrieve wishlist with product details for the user
    public List<Product> getWishlistWithProductDetails(String userId) {
        WishlistModel wishlist = getWishlistByUserId(userId);
      
    
        if (wishlist == null || wishlist.getProductIds() == null || wishlist.getProductIds().isEmpty()) {
            return Collections.emptyList(); // Handle case where wishlist is empty or null
        }
    
        // Fetch product details in batch from MongoDB
        List<String> productIds = wishlist.getProductIds();
        List<Product> products = productService.getProductsByIds(productIds);
    
        if (products == null || products.isEmpty()) {
            return Collections.emptyList(); // Handle case where no products are found
        }
    
        return products;
    }
    

    // Get wishlist by userId
    public WishlistModel getWishlistByUserId(String userId) {

        Optional<WishlistModel> existingWishlist = wishlistRepository.findByUserId(userId);

        if (existingWishlist.isPresent()) {
            return existingWishlist.get();  // Return existing wishlist if it exists
        } else {
            return createEmptyWishlist(userId);  // Create a new one if it doesn't exist
        }

    }

    // Add item to wishlist
   public WishlistModel addItemToWishlist(String userId, String productId) {
    WishlistModel wishlist = getWishlistByUserId(userId);

    if (wishlist.getProductIds() == null) {
        wishlist.setProductIds(new ArrayList<>());  // Initialize an empty list if it's null
    }

    if (!wishlist.getProductIds().contains(productId)) {
        wishlist.getProductIds().add(productId);
        return wishlistRepository.save(wishlist);
    }

    // Prevent duplicate items from being added
    return wishlist;
}


    // Remove item from wishlist
    public WishlistModel removeItemFromWishlist(String userId, String productId) {
        WishlistModel wishlist = getWishlistByUserId(userId);
        wishlist.getProductIds().remove(productId);
        return wishlistRepository.save(wishlist);
    }

    // Clear entire wishlist
    public void clearWishlist(String userId) {
        WishlistModel wishlist = getWishlistByUserId(userId);
        wishlist.getProductIds().clear();
        wishlistRepository.save(wishlist);
    }

    // Helper method to create a new empty wishlist for a user
    private WishlistModel createEmptyWishlist(String userId) {
        WishlistModel newWishlist = new WishlistModel();
        newWishlist.setUserId(userId);
        return wishlistRepository.save(newWishlist);
    }
}
