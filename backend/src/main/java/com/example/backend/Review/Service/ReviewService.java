package com.example.backend.Review.Service;

import com.example.backend.Review.Model.Review;

import java.util.List;
import org.springframework.data.domain.Page;


public interface ReviewService {

    // Retrieve all reviews
    Page<Review> getAllReviews(int page, int size);

    // Retrieve reviews by product ID
    Page<Review> getReviewsByProductId(String productId, int page, int size);

    // Add a new review
    Review addReview(Review review);

    // Update an existing review
    Review updateReview(String id, Review review);

    // Delete a review by ID
    void deleteReview(String id);

    // Admin reply to a review
    Review replyToReview(String reviewId, String reply);

    // Check if a review exists for a specific user and product
    boolean existsByUserIdAndProductIdAndOrderId(String userId, String productId, String orderId);
}


