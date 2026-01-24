package com.example.backend.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.backend.modal.Review;

public interface ReviewRepository extends MongoRepository<Review, String> {

	public List<Review> findByProduct(com.example.backend.modal.Product product);
}
