package com.example.backend.Auth.repository;

import com.example.backend.Auth.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email); // Add this method to check if an email is already in use
}
