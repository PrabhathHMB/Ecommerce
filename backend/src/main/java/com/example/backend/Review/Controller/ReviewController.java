package com.example.backend.Review.Controller;

import com.example.backend.Review.Model.Review;
import com.example.backend.Review.Service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.http.HttpStatus;

import com.example.backend.Auth.UtilSecurity.SecurityUtil;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    // Get all reviews with pagination
    @GetMapping
    public Page<Review> getAllReviews(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return reviewService.getAllReviews(page, size);
    }

    // Get reviews for a specific product
    @GetMapping("/product/{productId}")
    public Page<Review> getReviewsByProductId(
            @PathVariable String productId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
        return reviewService.getReviewsByProductId(productId, page, size);
    }
    

    // Add a new review
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<Review> addReview(@RequestBody Review review) {
        String userId = SecurityUtil.getCurrentUserId(); // Fetch user ID dynamically from SecurityContext

        review.setUserId(userId);

        // Check if the user has already posted a review for the given product
        boolean reviewExists = reviewService.existsByUserIdAndProductIdAndOrderId(userId, review.getProductId(), review.getOrderId());

        if (reviewExists) {
            // Return a conflict response if the user has already reviewed the product
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(null); // Optionally return a message indicating the conflict
        }

        // Save the new review
        Review savedReview = reviewService.addReview(review);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedReview);
    }

    // Update an existing review
    @PutMapping("/{id}")
    public ResponseEntity<Review> updateReview(@PathVariable String id, @RequestBody Review review) {
        Review updatedReview = reviewService.updateReview(id, review);
        return ResponseEntity.ok(updatedReview);
    }

    // Delete a review by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable String id) {
        reviewService.deleteReview(id);
        return ResponseEntity.noContent().build();
    }

    // Admin reply to a review
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/reply")
    public ResponseEntity<Review> replyToReview(
            @PathVariable String id,
            @RequestBody String reply) {
        Review updatedReview = reviewService.replyToReview(id, reply);
        return ResponseEntity.ok(updatedReview);
    }
}
