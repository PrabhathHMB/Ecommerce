package com.example.backend.Product.Service;

import java.util.List;
import com.example.backend.Product.Model.Product;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;

public interface ProductService {

    // Retrieve all products by Page by Page
    Page<Product> getProductsPage(int page, int size);
    // Retrieve a product by its ID
    Product getProductById(String id);
    // Add a new product
    Product addProduct(Product product);
    // Update an existing product
    Product updaProduct(String id, Product product);
    // Delete a product by ID
    void deleteProduct(String id);
    // Reduce product stock
    void reduceProductStock(String productId, String variationType, String variationValue, int quantity);
    // Get Products by IDs
    List<Product> getProductsByIds(List<String> productIds);
    // Filter products by name, category, price
    Page<Product> filterProducts(String name, String category, Double minPrice, Double maxPrice, int page, int size);
    // Get new arrivals
    public List<Product> getNewArrivals();

    // Get distinct categories
    public List<String> getDistinctCategories();


}
