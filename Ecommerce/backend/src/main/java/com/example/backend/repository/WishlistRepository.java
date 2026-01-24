package com.example.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.backend.modal.Wishlist;

public interface WishlistRepository extends MongoRepository<Wishlist, String> {
    
    Wishlist findByUser_Id(String userId);

}
