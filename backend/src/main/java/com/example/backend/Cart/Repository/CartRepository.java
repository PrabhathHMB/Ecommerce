package com.example.backend.Cart.Repository;

import com.example.backend.Cart.Model.CartModel;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface CartRepository extends MongoRepository<CartModel, String> {
    // Find a cart by userId
    Optional<CartModel> findByUserId(String userId);

    // Optionally, add more custom queries if needed in the future
}
