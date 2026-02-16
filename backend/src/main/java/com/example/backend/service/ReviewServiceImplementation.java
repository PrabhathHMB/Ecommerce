<<<<<<< HEAD
package com.example.backend.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.backend.exception.ProductException;
import com.example.backend.modal.Order;
import com.example.backend.modal.OrderItem;
import com.example.backend.modal.Product;
import com.example.backend.modal.Review;
import com.example.backend.modal.User;
import com.example.backend.repository.ProductRepository;
import com.example.backend.repository.ReviewRepository;
import com.example.backend.request.ReviewRequest;
import com.example.backend.user.domain.OrderStatus;

@Service
public class ReviewServiceImplementation implements ReviewService {
	
	private ReviewRepository reviewRepository;
	private ProductService productService;
	private ProductRepository productRepository;
	private OrderService orderService;
	
	public ReviewServiceImplementation(ReviewRepository reviewRepository,ProductService productService,ProductRepository productRepository, OrderService orderService) {
		this.reviewRepository=reviewRepository;
		this.productService=productService;
		this.productRepository=productRepository;
		this.orderService=orderService;
	}

	@Override
	public Review createReview(ReviewRequest req,User user) throws ProductException {
		
		Product product=productService.findProductById(req.getProductId());
		
		// Verify if user has purchased and received the product
		List<Order> orders = orderService.usersOrderHistory(user.getId());
		boolean isEligible = false;

		for (Order order : orders) {
			if (order.getOrderStatus() == OrderStatus.DELIVERED) {
				for (OrderItem item : order.getOrderItems()) {
					if (item.getProduct().getId().equals(req.getProductId())) {
						isEligible = true;
						break;
					}
				}
			}
			if (isEligible) break;
		}

		if (!isEligible) {
			throw new ProductException("You can only review products that you have purchased and received (DELIVERED status).");
		}
		
		Review review=new Review();
		review.setUser(user);
		review.setProduct(product);
		review.setReview(req.getReview());
		review.setCreatedAt(LocalDateTime.now());
		
//		product.getReviews().add(review);
		productRepository.save(product);
		return reviewRepository.save(review);
	}

	@Override
	public List<Review> getAllReview(String productId) {
		try {
			Product product = productService.findProductById(productId);
			return reviewRepository.findByProduct(product);
		} catch (ProductException e) {
			// e.printStackTrace();
			return List.of();
		}
	}

}
=======
package com.example.backend.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.backend.exception.ProductException;
import com.example.backend.modal.Order;
import com.example.backend.modal.OrderItem;
import com.example.backend.modal.Product;
import com.example.backend.modal.Review;
import com.example.backend.modal.User;
import com.example.backend.repository.ProductRepository;
import com.example.backend.repository.ReviewRepository;
import com.example.backend.request.ReviewRequest;
import com.example.backend.user.domain.OrderStatus;

@Service
public class ReviewServiceImplementation implements ReviewService {
	
	private ReviewRepository reviewRepository;
	private ProductService productService;
	private ProductRepository productRepository;
	private OrderService orderService;
	
	public ReviewServiceImplementation(ReviewRepository reviewRepository,ProductService productService,ProductRepository productRepository, OrderService orderService) {
		this.reviewRepository=reviewRepository;
		this.productService=productService;
		this.productRepository=productRepository;
		this.orderService=orderService;
	}

	@Override
	public Review createReview(ReviewRequest req,User user) throws ProductException {
		
		Product product=productService.findProductById(req.getProductId());
		
		// Verify if user has purchased and received the product
		List<Order> orders = orderService.usersOrderHistory(user.getId());
		boolean isEligible = false;

		for (Order order : orders) {
			if (order.getOrderStatus() == OrderStatus.DELIVERED) {
				for (OrderItem item : order.getOrderItems()) {
					if (item.getProduct().getId().equals(req.getProductId())) {
						isEligible = true;
						break;
					}
				}
			}
			if (isEligible) break;
		}

		if (!isEligible) {
			throw new ProductException("You can only review products that you have purchased and received (DELIVERED status).");
		}
		
		Review review=new Review();
		review.setUser(user);
		review.setProduct(product);
		review.setReview(req.getReview());
		review.setCreatedAt(LocalDateTime.now());
		
//		product.getReviews().add(review);
		productRepository.save(product);
		return reviewRepository.save(review);
	}

	@Override
	public List<Review> getAllReview(String productId) {
		try {
			Product product = productService.findProductById(productId);
			return reviewRepository.findByProduct(product);
		} catch (ProductException e) {
			// e.printStackTrace();
			return List.of();
		}
	}

}
>>>>>>> f3b6a345980233ed739f0533bd19c64770bd705a
