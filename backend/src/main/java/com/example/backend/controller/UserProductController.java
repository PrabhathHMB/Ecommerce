<<<<<<< HEAD
package com.example.backend.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.exception.ProductException;
import com.example.backend.modal.Product;
import com.example.backend.service.ProductService;
import com.example.backend.user.domain.ProductSubCategory;

@RestController
@RequestMapping("/api")
public class UserProductController {
	
	private ProductService productService;
	
	public UserProductController(ProductService productService) {
		this.productService=productService;
	}
	
	
	@GetMapping("/products")
	public ResponseEntity<Page<Product>> findProductByCategoryHandler(@RequestParam(required = false) String category,
			@RequestParam(required = false) String parentCategory,
			@RequestParam(required = false) List<String>color,@RequestParam(required = false) List<String> size,@RequestParam(required = false) Integer minPrice,
			@RequestParam(required = false) Integer maxPrice, @RequestParam(required = false) Integer minDiscount, @RequestParam(required = false) String sort, 
			@RequestParam(required = false) String stock, @RequestParam(defaultValue = "0") Integer pageNumber,@RequestParam(defaultValue = "10") Integer pageSize){

		
		Page<Product> res= productService.getAllProduct(category, parentCategory, color, size, minPrice, maxPrice, minDiscount, sort,stock,pageNumber,pageSize);
		
		System.out.println("complete products");
		return new ResponseEntity<>(res,HttpStatus.ACCEPTED);
		
	}
	

	
	@GetMapping("/products/id/{productId}")
	public ResponseEntity<Product> findProductByIdHandler(@PathVariable String productId) throws ProductException{
		
		Product product=productService.findProductById(productId);
		
		return new ResponseEntity<Product>(product,HttpStatus.ACCEPTED);
	}

	@GetMapping("/products/search")
	public ResponseEntity<List<Product>> searchProductHandler(@RequestParam String q){
		
		List<Product> products=productService.searchProduct(q);
		
		return new ResponseEntity<List<Product>>(products,HttpStatus.OK);
		
	}
}
=======
package com.example.backend.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.exception.ProductException;
import com.example.backend.modal.Product;
import com.example.backend.service.ProductService;
import com.example.backend.user.domain.ProductSubCategory;

@RestController
@RequestMapping("/api")
public class UserProductController {
	
	private ProductService productService;
	
	public UserProductController(ProductService productService) {
		this.productService=productService;
	}
	
	
	@GetMapping("/products")
	public ResponseEntity<Page<Product>> findProductByCategoryHandler(@RequestParam(required = false) String category,
			@RequestParam(required = false) String parentCategory,
			@RequestParam(required = false) List<String>color,@RequestParam(required = false) List<String> size,@RequestParam(required = false) Integer minPrice,
			@RequestParam(required = false) Integer maxPrice, @RequestParam(required = false) Integer minDiscount, @RequestParam(required = false) String sort, 
			@RequestParam(required = false) String stock, @RequestParam(defaultValue = "0") Integer pageNumber,@RequestParam(defaultValue = "10") Integer pageSize){

		
		Page<Product> res= productService.getAllProduct(category, parentCategory, color, size, minPrice, maxPrice, minDiscount, sort,stock,pageNumber,pageSize);
		
		System.out.println("complete products");
		return new ResponseEntity<>(res,HttpStatus.ACCEPTED);
		
	}
	

	
	@GetMapping("/products/id/{productId}")
	public ResponseEntity<Product> findProductByIdHandler(@PathVariable String productId) throws ProductException{
		
		Product product=productService.findProductById(productId);
		
		return new ResponseEntity<Product>(product,HttpStatus.ACCEPTED);
	}

	@GetMapping("/products/search")
	public ResponseEntity<List<Product>> searchProductHandler(@RequestParam String q){
		
		List<Product> products=productService.searchProduct(q);
		
		return new ResponseEntity<List<Product>>(products,HttpStatus.OK);
		
	}
}
>>>>>>> f3b6a345980233ed739f0533bd19c64770bd705a
