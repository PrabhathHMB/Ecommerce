package com.example.backend.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.backend.modal.Rating;

public interface RatingRepository extends MongoRepository<Rating, String> {

	public List<Rating> findByProduct(com.example.backend.modal.Product product);

}
