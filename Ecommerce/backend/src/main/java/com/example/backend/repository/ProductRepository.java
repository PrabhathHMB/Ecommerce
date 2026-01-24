package com.example.backend.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.backend.modal.Product;

public interface ProductRepository extends MongoRepository<Product, String> {

	// Find by Category Object (works with @DBRef)
	public List<Product> findByCategory(com.example.backend.modal.Category category);

	// Removed searchProduct query that caused MappingException. 
	// Search is now handled in Service layer via in-memory filtering.
//	public List<Product> searchProduct(String query);

	// Note: Complex filtering with null checks is better handled in service layer
	// This method returns all products, filtering will be done in service
	List<Product> findAllByOrderByCreatedAtDesc();

	public List<Product> findTop10ByOrderByCreatedAtDesc();
}
