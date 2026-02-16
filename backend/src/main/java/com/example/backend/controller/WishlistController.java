package com.example.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.exception.ProductException;
import com.example.backend.exception.UserException;
import com.example.backend.modal.User;
import com.example.backend.modal.Wishlist;
import com.example.backend.service.UserService;
import com.example.backend.service.WishlistService;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {

    @Autowired
    private WishlistService wishlistService;

    @Autowired
    private UserService userService;

    @GetMapping("/")
    public ResponseEntity<Wishlist> getWishlist(@RequestHeader("Authorization") String jwt) throws UserException {
        User user = userService.findUserProfileByJwt(jwt);
        Wishlist wishlist = wishlistService.getWishlistByUserId(user.getId());
        
        if (wishlist == null) {
            // Lazy creation if missing
             wishlist = wishlistService.createWishlist(user);
        }
        
        return new ResponseEntity<>(wishlist, HttpStatus.OK);
    }

    @PutMapping("/add/{productId}")
    public ResponseEntity<Wishlist> addProductToWishlist(@PathVariable String productId,
                                                         @RequestHeader("Authorization") String jwt) throws UserException, ProductException {
        User user = userService.findUserProfileByJwt(jwt);
        
        Wishlist wishlist = wishlistService.getWishlistByUserId(user.getId());
        if(wishlist == null) {
            wishlistService.createWishlist(user);
        }

        Wishlist updatedWishlist = wishlistService.addProductToWishlist(user.getId(), productId);
        return new ResponseEntity<>(updatedWishlist, HttpStatus.OK);
    }

    @DeleteMapping("/remove/{productId}")
    public ResponseEntity<Wishlist> removeProductFromWishlist(@PathVariable String productId,
                                                              @RequestHeader("Authorization") String jwt) throws UserException, ProductException {
        User user = userService.findUserProfileByJwt(jwt);

        Wishlist updatedWishlist = wishlistService.removeProductFromWishlist(user.getId(), productId);
        return new ResponseEntity<>(updatedWishlist, HttpStatus.OK);
    }
}
