package com.example.backend.service;

import com.example.backend.exception.ProductException;
import com.example.backend.modal.User;
import com.example.backend.modal.Wishlist;

public interface WishlistService {

    Wishlist createWishlist(User user);

    Wishlist getWishlistByUserId(String userId);

    Wishlist addProductToWishlist(String userId, String productId) throws ProductException;

    Wishlist removeProductFromWishlist(String userId, String productId) throws ProductException;

}
