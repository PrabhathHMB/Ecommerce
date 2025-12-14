package com.example.backend.Product.Service;

import com.example.backend.Product.Model.Product;
import com.example.backend.Product.Service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductDetailService {

    @Autowired
    private ProductService productService;

    public List<Product> fetchProductDetails(List<String> productIds) {
        // Fetch all product details using the batch API
        return productService.getProductsByIds(productIds);
    }
}

