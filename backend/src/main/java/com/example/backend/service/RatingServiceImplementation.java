<<<<<<< HEAD
package com.example.backend.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.backend.exception.ProductException;
import com.example.backend.modal.Order;
import com.example.backend.modal.OrderItem;
import com.example.backend.modal.Product;
import com.example.backend.modal.Rating;
import com.example.backend.modal.User;
import com.example.backend.repository.RatingRepository;
import com.example.backend.request.RatingRequest;
import com.example.backend.user.domain.OrderStatus;

@Service
public class RatingServiceImplementation implements RatingServices{
	
	private RatingRepository ratingRepository;
	private ProductService productService;
	private OrderService orderService;
    private com.example.backend.repository.ProductRepository productRepository; // Use FQCN or import
	
	public RatingServiceImplementation(RatingRepository ratingRepository,ProductService productService, OrderService orderService, com.example.backend.repository.ProductRepository productRepository) {
		this.ratingRepository=ratingRepository;
		this.productService=productService;
		this.orderService=orderService;
        this.productRepository=productRepository;
	}

	@Override
	public Rating createRating(RatingRequest req,User user) throws ProductException {
		
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
			throw new ProductException("You can only rate products that you have purchased and received (DELIVERED status).");
		}
		
		Rating rating=new Rating();
		rating.setProduct(product);
		rating.setUser(user);
		rating.setRating(req.getRating());
		rating.setCreatedAt(LocalDateTime.now());
		
		Rating savedRating = ratingRepository.save(rating);

		// Update Product Stats
		List<Rating> ratings = ratingRepository.findByProduct(product);
		double totalRating = 0;
		for(Rating r : ratings) {
			totalRating += r.getRating();
		}
		double avgRating = ratings.size() > 0 ? totalRating / ratings.size() : 0;
		
		product.setNumRatings(ratings.size());
		product.setAverageRating(avgRating);
		productRepository.save(product);
		
		return savedRating;
	}

	@Override
	public List<Rating> getProductsRating(String productId) {
		try {
			Product product = productService.findProductById(productId);
			return ratingRepository.findByProduct(product);
		} catch (ProductException e) {
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
import com.example.backend.modal.Rating;
import com.example.backend.modal.User;
import com.example.backend.repository.RatingRepository;
import com.example.backend.request.RatingRequest;
import com.example.backend.user.domain.OrderStatus;

@Service
public class RatingServiceImplementation implements RatingServices{
	
	private RatingRepository ratingRepository;
	private ProductService productService;
	private OrderService orderService;
    private com.example.backend.repository.ProductRepository productRepository; // Use FQCN or import
	
	public RatingServiceImplementation(RatingRepository ratingRepository,ProductService productService, OrderService orderService, com.example.backend.repository.ProductRepository productRepository) {
		this.ratingRepository=ratingRepository;
		this.productService=productService;
		this.orderService=orderService;
        this.productRepository=productRepository;
	}

	@Override
	public Rating createRating(RatingRequest req,User user) throws ProductException {
		
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
			throw new ProductException("You can only rate products that you have purchased and received (DELIVERED status).");
		}
		
		Rating rating=new Rating();
		rating.setProduct(product);
		rating.setUser(user);
		rating.setRating(req.getRating());
		rating.setCreatedAt(LocalDateTime.now());
		
		Rating savedRating = ratingRepository.save(rating);

		// Update Product Stats
		List<Rating> ratings = ratingRepository.findByProduct(product);
		double totalRating = 0;
		for(Rating r : ratings) {
			totalRating += r.getRating();
		}
		double avgRating = ratings.size() > 0 ? totalRating / ratings.size() : 0;
		
		product.setNumRatings(ratings.size());
		product.setAverageRating(avgRating);
		productRepository.save(product);
		
		return savedRating;
	}

	@Override
	public List<Rating> getProductsRating(String productId) {
		try {
			Product product = productService.findProductById(productId);
			return ratingRepository.findByProduct(product);
		} catch (ProductException e) {
			return List.of();
		}
	}
	
	

}
>>>>>>> f3b6a345980233ed739f0533bd19c64770bd705a
