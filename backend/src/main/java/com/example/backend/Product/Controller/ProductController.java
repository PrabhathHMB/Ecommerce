package com.example.backend.Product.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.Product.Model.Product;
import com.example.backend.Product.Service.ProductService;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;

import com.example.backend.Product.Config.S3Config;

import org.springframework.beans.factory.annotation.Value;

import java.net.URL;
import java.time.Duration;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/products")
public class ProductController {

    @Value("${aws.s3.bucket-name}")
    private String bucketName;

    @Autowired
    private ProductService productService;

    @Autowired
    private S3Client s3Client;

    // Get all products by Page by Page
    @GetMapping
    public Page<Product> getAllProducts(@RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return productService.getProductsPage(page, size);
    }

    // Get product by ID
    @GetMapping("/{id}")
    public Product getProductById(@PathVariable String id) {
        return productService.getProductById(id);
    }

    
    // Filter of recieving Products
    @GetMapping("/filter")
    public Page<Product> filterProducts(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return productService.filterProducts(name, category, minPrice, maxPrice, page, size);
    }

    // Get new arrivals
    @GetMapping("/new-arrivals")
    public List<Product> getNewArrivals() {
        return productService.getNewArrivals();
    }



    @GetMapping("/categories")
    public List<String> getDistinctCategories() {
        return productService.getDistinctCategories();
    }



    // Reduce stock for a specific variation (optional feature)
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/reduce-stock")
    public void reduceProductStock(
            @PathVariable String id,
            @RequestParam String variationType,
            @RequestParam String variationValue,
            @RequestParam int quantity) {
        productService.reduceProductStock(id, variationType, variationValue, quantity);
    }

    // Add a new product
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public Product addProduct(@RequestBody Product product) {
        return productService.addProduct(product);
    }

    // Update an existing product
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public Product updaProduct(@PathVariable String id, @RequestBody Product product) {
        return productService.updaProduct(id, product);
    }

    // Delete a product by ID
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public void deleteProduct(@PathVariable String id) {
        productService.deleteProduct(id);
    }


    // AWS URL generation
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/generate-presigned-url")
    public URL generatePresignedUrl(@RequestParam String fileName) {
        S3Presigner presigner = S3Presigner.create();
        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key("products/" + fileName)
                .build();

        PutObjectPresignRequest presignRequest = PutObjectPresignRequest.builder()
                .signatureDuration(Duration.ofMinutes(10)) // URL valid for 10 minutes
                .putObjectRequest(putObjectRequest)
                .build();

        return presigner.presignPutObject(presignRequest).url();
    }
}
