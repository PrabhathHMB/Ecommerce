package com.example.backend.service;

import java.util.List;

import com.example.backend.exception.ProductException;
import com.example.backend.modal.Review;
import com.example.backend.modal.User;
import com.example.backend.request.ReviewRequest;

public interface ReviewService {

	public Review createReview(ReviewRequest req,User user) throws ProductException;
	
	public List<Review> getAllReview(String productId);
	
	
}
