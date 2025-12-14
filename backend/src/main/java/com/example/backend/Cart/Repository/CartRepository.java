package com.example.backend.Cart.Repository;

import com.example.backend.Cart.Model.CartModel;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

import org.springframework.stereotype.Repository;

@Repository
public interface CartRepository {
    Optional<CartModel> findByUserId(String userId);
}
