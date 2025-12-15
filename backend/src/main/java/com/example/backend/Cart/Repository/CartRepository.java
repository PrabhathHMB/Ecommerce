package com.example.backend.Cart.Repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.example.backend.Cart.Model.CartModel;

@Repository
public interface CartRepository extends MongoRepository<CartModel, String> {
    Optional<CartModel> findByUserId(String userId);
}