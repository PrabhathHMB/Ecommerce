package com.example.backend.Product.Service.ServiceImpl;

import java.sql.Date;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;

import com.example.backend.Product.Model.Product;
import com.example.backend.Product.Repository.ProductRepository;
import com.example.backend.Product.Service.ProductService;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;



@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository productRepository;

    // Retrieve all products by Page by Page
    @Override
    public Page<Product> getProductsPage(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return productRepository.findAll(pageable);
    }

    // Retrieve a product by its ID
    @Override
    public Product getProductById(String id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with ID: " + id));
    }


    // Add a new product only if it doesn't exist
    @Override
    public Product addProduct(Product product) {
        // Check if the product with the given SKU already exists
        Optional<Product> existingProduct = productRepository.findBySku(product.getSku());
    
        if (existingProduct.isPresent()) {
            // If the product exists, throw an exception or handle the duplication
            throw new RuntimeException("Product already exists with SKU: " + product.getSku());
        } else {
            // If the product doesn't exist, set the creation date and save as new
            product.setCreatedAt(new Date(System.currentTimeMillis())); // Set creation date for new product
            return productRepository.save(product); // Save the new product
        }
    }
    


    // Update an existing product
    @Override
    public Product updaProduct(String id, Product product) {
        Product existingProduct = getProductById(id); // Retrieve existing product
        existingProduct.setName(product.getName());
        existingProduct.setCategory(product.getCategory());
        existingProduct.setPrice(product.getPrice());
        existingProduct.setPreviousPrice(product.getPreviousPrice());
        existingProduct.setStock(product.getStock());
        existingProduct.setDescription(product.getDescription());
        existingProduct.setImages(product.getImages());
        existingProduct.setVariations(product.getVariations());
        return productRepository.save(existingProduct);
    }

    // Delete a product by its ID
    @Override
    public void deleteProduct(String id) {
        productRepository.deleteById(id);
    }

    // Retrieve products by Filter
    @Override
    public Page<Product> filterProducts(String name, String category, Double minPrice, Double maxPrice, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return productRepository.filterProducts(name, category, minPrice, maxPrice, pageable);
    }


    // Reduce stock for a product variation (optional for inventory management)
    public void reduceProductStock(String productId, String variationType, String variationValue, int quantity) {
        Product product = getProductById(productId);
    
        if (product.getVariations() == null || product.getVariations().isEmpty()) {
            // If no variations exist, reduce stock directly from product
            if (product.getStock() >= quantity) {
                product.setStock(product.getStock() - quantity);
            } else {
                throw new RuntimeException("Insufficient stock for product: " + product.getName());
            }
        } else {
            boolean variationFound = false; // Flag to check if variation exists
    
            for (Product.Variation variation : product.getVariations()) {
                if (variation.getType().equalsIgnoreCase(variationType)) {
                    for (Product.Variation.Option option : variation.getOptions()) {
                        if (option.getValue().equalsIgnoreCase(variationValue)) {
                            if (option.getStock() >= quantity) {
                                option.setStock(option.getStock() - quantity);
                                variationFound = true;
                                break; // Stop checking more options
                            } else {
                                throw new RuntimeException("Insufficient stock for variation: " + variationValue);
                            }
                        }
                    }
                }
                if (variationFound) break; // Stop checking other variations once found
            }
    
            if (!variationFound) {
                throw new RuntimeException("Variation not found: " + variationType + " - " + variationValue);
            }
        }
    
        productRepository.save(product);
    }
    
    //Get prodcts by a Id List
    @Override
    public List<Product> getProductsByIds(List<String> productIds) {
        System.out.println("service product");
        System.out.println(productIds);
        return productRepository.findByIdIn(productIds);
    }

    @Override
    public List<Product> getNewArrivals() {
        return productRepository.getNewArrivals();
    }

    @Override
    public List<String> getDistinctCategories() {
        return productRepository.findDistinctCategories();
    }

}
