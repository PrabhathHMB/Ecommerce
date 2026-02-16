package com.example.backend.service;

import java.util.HashSet;

import org.springframework.stereotype.Service;

import com.example.backend.exception.ProductException;
import com.example.backend.modal.Product;
import com.example.backend.modal.User;
import com.example.backend.modal.Wishlist;
import com.example.backend.repository.WishlistRepository;

@Service
public class WishlistServiceImplementation implements WishlistService {

    private final WishlistRepository wishlistRepository;
    private final ProductService productService;

    public WishlistServiceImplementation(WishlistRepository wishlistRepository, ProductService productService) {
        this.wishlistRepository = wishlistRepository;
        this.productService = productService;
    }

    @Override
    public Wishlist createWishlist(User user) {
        Wishlist wishlist = new Wishlist();
        wishlist.setUser(user);
        wishlist.setProducts(new HashSet<>());
        return wishlistRepository.save(wishlist);
    }

    @Override
    public Wishlist getWishlistByUserId(String userId) {
        Wishlist wishlist = wishlistRepository.findByUser_Id(userId);
        if (wishlist == null) {
            // Lazy creation: if wishlist doesn't exist (e.g. old users), create one but we need User object.
            // However, this method signature only has userId. 
            // In a real scenario, we might want to throw exception or handle it differently.
            // For now, let's return null or empty if not found, 
            // OR we can fetch user using userId (requires UserService) and create it.
            // Let's rely on the Controller to handle creation or ensure creation at signup.
            // But for robustness, let's just return null here and handle creation in addProduct or specific get logic.
            return null;
        }
        return wishlist;
    }

    @Override
    public Wishlist addProductToWishlist(String userId, String productId) throws ProductException {
        Wishlist wishlist = wishlistRepository.findByUser_Id(userId);
        
        // If wishlist doesn't exist, we can't easily create it without User object unless we fetch User.
        // Assuming Wishlist is created at Sign Up (which I haven't added yet to AuthController), 
        // OR we inject UserService here to fetch User.
        // Let's treat it as: if null, we can't proceed without User.
        // BUT, I can inject UserService to make this robust.
        
        if (wishlist == null) {
             // For now, let's assume it exists or throw error. 
             // Ideally we should update AuthController to create Wishlist on signup.
             // I will add a step to update AuthController.
             throw new RuntimeException("Wishlist not found for user " + userId);
        }

        Product product = productService.findProductById(productId);
        
        if (wishlist.getProducts() == null) {
            wishlist.setProducts(new HashSet<>());
        }
        
        wishlist.getProducts().add(product);
        return wishlistRepository.save(wishlist);
    }

    @Override
    public Wishlist removeProductFromWishlist(String userId, String productId) throws ProductException {
        Wishlist wishlist = wishlistRepository.findByUser_Id(userId);
        
        if (wishlist == null) {
            throw new RuntimeException("Wishlist not found for user " + userId);
        }

        Product product = productService.findProductById(productId);
        
        if (wishlist.getProducts() != null) {
            wishlist.getProducts().remove(product);
        }
        
        return wishlistRepository.save(wishlist);
    }
}
