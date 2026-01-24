package com.example.backend.service;


import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.backend.exception.ProductException;
import com.example.backend.modal.Category;
import com.example.backend.modal.Product;
import com.example.backend.repository.CategoryRepository;
import com.example.backend.repository.ProductRepository;
import com.example.backend.request.CreateProductRequest;

@Service
public class ProductServiceImplementation implements ProductService {
	
	private ProductRepository productRepository;
	private UserService userService;
	private CategoryRepository categoryRepository;
	
	public ProductServiceImplementation(ProductRepository productRepository,UserService userService,CategoryRepository categoryRepository) {
		this.productRepository=productRepository;
		this.userService=userService;
		this.categoryRepository=categoryRepository;
	}
	

	@Override
	public Product createProduct(CreateProductRequest req) {
		
		Category topLevel=categoryRepository.findByName(req.getTopLavelCategory());
		
		if(topLevel==null) {
			
			Category topLavelCategory=new Category();
			topLavelCategory.setName(req.getTopLavelCategory());
			topLavelCategory.setLevel(1);
			
			topLevel= categoryRepository.save(topLavelCategory);
		}
		
		Category secondLevel=categoryRepository.
				findByNameAndParentCategory(req.getSecondLavelCategory(),topLevel);
		if(secondLevel==null) {
			
			Category secondLavelCategory=new Category();
			secondLavelCategory.setName(req.getSecondLavelCategory());
			secondLavelCategory.setParentCategory(topLevel);
			secondLavelCategory.setLevel(2);
			
			secondLevel= categoryRepository.save(secondLavelCategory);
		}

		Category thirdLevel=categoryRepository.findByNameAndParentCategory(req.getThirdLavelCategory(),secondLevel);
		if(thirdLevel==null) {
			
			Category thirdLavelCategory=new Category();
			thirdLavelCategory.setName(req.getThirdLavelCategory());
			thirdLavelCategory.setParentCategory(secondLevel);
			thirdLavelCategory.setLevel(3);
			
			thirdLevel=categoryRepository.save(thirdLavelCategory);
		}
		
		
		Product product=new Product();
		product.setTitle(req.getTitle());
		product.setColor(req.getColor());
		product.setDescription(req.getDescription());
		product.setDiscountedPrice(req.getDiscountedPrice());
		product.setDiscountPersent(req.getDiscountPersent());
		product.setImageUrl(req.getImageUrl());
		product.setBrand(req.getBrand());
		product.setPrice(req.getPrice());
		product.setSizes(req.getSize());
		
		// If sizes are present, calculate total quantity from sizes
		if(req.getSize() != null && !req.getSize().isEmpty()) {
			int totalQuantity = req.getSize().stream().mapToInt(com.example.backend.modal.size::getQuantity).sum();
			product.setQuantity(totalQuantity);
		} else {
			product.setQuantity(req.getQuantity());
		}
		product.setCategory(thirdLevel);
		product.setCreatedAt(LocalDateTime.now());
		
		Product savedProduct= productRepository.save(product);
		
		System.out.println("products - "+product);
		
		return savedProduct;
	}

	@Override
	public String deleteProduct(String productId) throws ProductException {
		
		Product product=findProductById(productId);
		
		System.out.println("delete product "+product.getId()+" - "+productId);
		product.getSizes().clear();
//		productRepository.save(product);
//		product.getCategory().
		productRepository.delete(product);
		
		return "Product deleted Successfully";
	}

	@Override
	public Product updateProduct(String productId,Product req) throws ProductException {
		Product product=findProductById(productId);
		
		if(req.getQuantity()!=0) {
			product.setQuantity(req.getQuantity());
		}
		
		// If sizes are being updated, recalculate total quantity
		if(req.getSizes() != null && !req.getSizes().isEmpty()) {
			product.setSizes(req.getSizes());
			int totalQuantity = req.getSizes().stream().mapToInt(com.example.backend.modal.size::getQuantity).sum();
			product.setQuantity(totalQuantity);
		}
		if(req.getDescription()!=null) {
			product.setDescription(req.getDescription());
		}
		
		
			
		
		return productRepository.save(product);
	}

	@Override
	public List<Product> getAllProducts() {
		return productRepository.findAll();
	}

	@Override
	public Product findProductById(String id) throws ProductException {
		Optional<Product> opt=productRepository.findById(id);
		
		if(opt.isPresent()) {
			return opt.get();
		}
		throw new ProductException("product not found with id "+id);
	}

	@Override
	public List<Product> findProductByCategory(String category) {
		
		System.out.println("category --- "+category);
		
		Category cat = categoryRepository.findByName(category);
		if(cat == null) {
			// Try finding by param? Or just return empty if category not found by exact name
			// Let's assume name must match
			return List.of();
		}
		
		List<Product> products = productRepository.findByCategory(cat);
		
		return products;
	}

	@Override
	public List<Product> searchProduct(String query) {
		List<Product> allProducts = productRepository.findAll();
		String lowerQuery = query.toLowerCase();
		
		List<Product> filtered = allProducts.stream()
			.filter(p -> 
				(p.getTitle() != null && p.getTitle().toLowerCase().contains(lowerQuery)) ||
				(p.getDescription() != null && p.getDescription().toLowerCase().contains(lowerQuery)) ||
				(p.getBrand() != null && p.getBrand().toLowerCase().contains(lowerQuery)) ||
				(p.getCategory() != null && p.getCategory().getName() != null && p.getCategory().getName().toLowerCase().contains(lowerQuery))
			)
			.collect(Collectors.toList());
			
		return filtered;
	}



	
	
	@Override
	public Page<Product> getAllProduct(String category,String parentCategory, List<String>colors, 
			List<String> sizes, Integer minPrice, Integer maxPrice, 
			Integer minDiscount,String sort, String stock, Integer pageNumber, Integer pageSize ) {

		Pageable pageable = PageRequest.of(pageNumber, pageSize);
		
		// Get all products and filter in memory (MongoDB query would be too complex with null checks)
		List<Product> products = productRepository.findAllByOrderByCreatedAtDesc();
		
		// Apply category filter
		if (category != null && !category.isEmpty()) {
			products = products.stream()
				.filter(p -> isCategoryMatching(p.getCategory(), category))
				.collect(Collectors.toList());
		}
		
		// Apply parent category filter (strict check to avoid ambiguity like "Men" > "Clothing" vs "Women" > "Clothing")
		if (parentCategory != null && !parentCategory.isEmpty()) {
			products = products.stream()
				.filter(p -> isCategoryMatching(p.getCategory(), parentCategory))
				.collect(Collectors.toList());
		}
		
		// Apply price filter
		if (minPrice != null && maxPrice != null) {
			products = products.stream()
				.filter(p -> p.getDiscountedPrice() >= minPrice && p.getDiscountedPrice() <= maxPrice)
				.collect(Collectors.toList());
		}
		
		// Apply discount filter
		if (minDiscount != null) {
			products = products.stream()
				.filter(p -> p.getDiscountPersent() >= minDiscount)
				.collect(Collectors.toList());
		}
		
		// Apply sorting
		if (sort != null) {
			if ("price_low".equals(sort)) {
				products = products.stream()
					.sorted((p1, p2) -> Integer.compare(p1.getDiscountedPrice(), p2.getDiscountedPrice()))
					.collect(Collectors.toList());
			} else if ("price_high".equals(sort)) {
				products = products.stream()
					.sorted((p1, p2) -> Integer.compare(p2.getDiscountedPrice(), p1.getDiscountedPrice()))
					.collect(Collectors.toList());
			}
		}
		
		
		if (!colors.isEmpty()) {
			products = products.stream()
			        .filter(p -> colors.stream().anyMatch(c -> c.equalsIgnoreCase(p.getColor())))
			        .collect(Collectors.toList());
		
		
		} 

		if(stock!=null) {

			if(stock.equals("in_stock")) {
				products=products.stream().filter(p->p.getQuantity()>0).collect(Collectors.toList());
			}
			else if (stock.equals("out_of_stock")) {
				products=products.stream().filter(p->p.getQuantity()<1).collect(Collectors.toList());				
			}
				
					
		}
		int startIndex = (int) pageable.getOffset();
		int endIndex = Math.min(startIndex + pageable.getPageSize(), products.size());

		List<Product> pageContent = products.subList(startIndex, endIndex);
		Page<Product> filteredProducts = new PageImpl<>(pageContent, pageable, products.size());
	    return filteredProducts; // If color list is empty, do nothing and return all products
		
		
	}


	@Override
	public List<Product> recentlyAddedProduct() {
		
		return productRepository.findTop10ByOrderByCreatedAtDesc();
	}

	private boolean isCategoryMatching(Category category, String categoryName) {
		Category current = category;
		while (current != null && current.getName() != null) {
			if (current.getName().equalsIgnoreCase(categoryName)) {
				return true;
			}
			current = current.getParentCategory();
		}
		return false;
	}

}
