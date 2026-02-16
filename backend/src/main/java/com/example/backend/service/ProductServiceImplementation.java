<<<<<<< HEAD
package com.example.backend.service;


import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
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
		
		List<Category> topLevels = categoryRepository.findByName(req.getTopLavelCategory());
		Category topLevel = topLevels.isEmpty() ? null : topLevels.get(0);
		
		if(topLevel==null) {
			
			Category topLavelCategory=new Category();
			topLavelCategory.setName(req.getTopLavelCategory());
			topLavelCategory.setLevel(1);
			
			topLevel= categoryRepository.save(topLavelCategory);
		}
		
		List<Category> secondLevels = categoryRepository.
				findByNameAndParentCategory(req.getSecondLavelCategory(),topLevel);
		Category secondLevel = secondLevels.isEmpty() ? null : secondLevels.get(0);
		
		if(secondLevel==null) {
			
			Category secondLavelCategory=new Category();
			secondLavelCategory.setName(req.getSecondLavelCategory());
			secondLavelCategory.setParentCategory(topLevel);
			secondLavelCategory.setLevel(2);
			
			secondLevel= categoryRepository.save(secondLavelCategory);
		}

		List<Category> thirdLevels = categoryRepository.findByNameAndParentCategory(req.getThirdLavelCategory(),secondLevel);
		Category thirdLevel = thirdLevels.isEmpty() ? null : thirdLevels.get(0);

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
		product.setSizeChart(req.getSizeChart());
		product.setBrand(req.getBrand());
		product.setPrice(req.getPrice());
		product.setSizes(req.getSize());
		product.setImages(req.getImages());
		product.setColors(req.getColors());
		
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
		
		if(req.getImages() != null && !req.getImages().isEmpty()) {
			product.setImages(req.getImages());
		}

		if(req.getColors() != null && !req.getColors().isEmpty()) {
			product.setColors(req.getColors());
		}

		// If sizes are being updated, recalculate total quantity
		if(req.getSizes() != null && !req.getSizes().isEmpty()) {
			product.setSizes(req.getSizes());
			int totalQuantity = req.getSizes().stream().mapToInt(com.example.backend.modal.size::getQuantity).sum();
			product.setQuantity(totalQuantity);
		}
		if(req.getTitle()!=null) {
			product.setTitle(req.getTitle());
		}
		if(req.getDescription()!=null) {
			product.setDescription(req.getDescription());
		}
		if(req.getPrice()!=0) {
			product.setPrice(req.getPrice());
		}
		if(req.getDiscountedPrice()!=0) {
			product.setDiscountedPrice(req.getDiscountedPrice());
		}
		if(req.getDiscountPersent()!=0) {
			product.setDiscountPersent(req.getDiscountPersent());
		}
		if(req.getBrand()!=null) {
			product.setBrand(req.getBrand());
		}
		if(req.getColor()!=null) {
			product.setColor(req.getColor());
		}
		if(req.getImageUrl()!=null) {
			product.setImageUrl(req.getImageUrl());
		}
		if(req.getSizeChart()!=null) {
			product.setSizeChart(req.getSizeChart());
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
		
		List<Category> cats = categoryRepository.findByName(category);
		Category cat = cats.isEmpty() ? null : cats.get(0);
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
		
		List<Product> products = productRepository.findAllByOrderByCreatedAtDesc();
		
		// Fetch all categories for robust hierarchy traversal
		List<Category> allCategories = categoryRepository.findAll();
		Map<String, Category> categoryMap = allCategories.stream()
				.collect(Collectors.toMap(Category::getId, Function.identity()));
		
		if (category != null && !category.isEmpty()) {
			System.out.println("Processing Category Filter: " + category);
			products = products.stream()
				.filter(p -> isCategoryMatching(p.getCategory(), category, categoryMap))
				.collect(Collectors.toList());
			System.out.println("Products matching category '" + category + "': " + products.size());
		}
		
		if (parentCategory != null && !parentCategory.isEmpty()) {
			products = products.stream()
				.filter(p -> isCategoryMatching(p.getCategory(), parentCategory, categoryMap))
				.collect(Collectors.toList());
		}
		
		if (minPrice != null && maxPrice != null) {
			products = products.stream()
				.filter(p -> p.getDiscountedPrice() >= minPrice && p.getDiscountedPrice() <= maxPrice)
				.collect(Collectors.toList());
		}
		
		if (minDiscount != null) {
			products = products.stream()
				.filter(p -> p.getDiscountPersent() >= minDiscount)
				.collect(Collectors.toList());
		}
		
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
		
		if (colors != null && !colors.isEmpty()) {
			List<String> validColors = colors.stream().filter(c -> c != null && !c.trim().isEmpty()).collect(Collectors.toList());
			if (!validColors.isEmpty()) {
				products = products.stream()
			        .filter(p -> validColors.stream().anyMatch(c -> 
                        (p.getColor() != null && c.equalsIgnoreCase(p.getColor())) || 
                        (p.getColors() != null && p.getColors().stream().anyMatch(pc -> pc.equalsIgnoreCase(c)))
                    ))
			        .collect(Collectors.toList());
			}
		} 

		if (sizes != null && !sizes.isEmpty()) {
			List<String> validSizes = sizes.stream().filter(s -> s != null && !s.trim().isEmpty()).collect(Collectors.toList());
			if (!validSizes.isEmpty()) {
				products = products.stream()
					.filter(p -> p.getSizes().stream()
							.anyMatch(s -> validSizes.contains(s.getName())))
					.collect(Collectors.toList());
			}
		}

		if(stock!=null && !stock.isEmpty()) {
			if(stock.equals("in_stock")) {
				products=products.stream().filter(p->p.getQuantity()>0).collect(Collectors.toList());
			}
			else if (stock.equals("out_of_stock")) {
				products=products.stream().filter(p->p.getQuantity()<1).collect(Collectors.toList());				
			}
		}
		
		int startIndex = (int) pageable.getOffset();
		// Fix for index out of bounds when page is out of range
		if (startIndex >= products.size()) {
			return new PageImpl<>(List.of(), pageable, products.size());
		}
		int endIndex = Math.min(startIndex + pageable.getPageSize(), products.size());

		List<Product> pageContent = products.subList(startIndex, endIndex);
		Page<Product> filteredProducts = new PageImpl<>(pageContent, pageable, products.size());
	    return filteredProducts;
	}


	@Override
	public List<Product> recentlyAddedProduct() {
		
		return productRepository.findTop10ByOrderByCreatedAtDesc();
	}

	private boolean isCategoryMatching(Category category, String categoryName, Map<String, Category> categoryMap) {
		Category current = category;
		while (current != null) {
			if (current.getName() != null && current.getName().equalsIgnoreCase(categoryName)) {
				return true;
			}
			// Use map to traverse up if parent is present but potentially not fetched
			if (current.getParentCategory() != null) {
				String parentId = current.getParentCategory().getId();
				if (parentId != null && categoryMap.containsKey(parentId)) {
					current = categoryMap.get(parentId);
					continue;
				}
			}
			// Fallback if no ID or not in map (shouldn't happen if consistency is good)
			current = current.getParentCategory();
		}
		return false;
	}

	// Legacy method overload to satisfy interface if needed, or helper
	private boolean isCategoryMatching(Category category, String categoryName) {
		// Fallback to fetching if map not provided? 
		// Ideally we should use the map version. For now, let's keep it simple or redirect?
		// Since we changed the call sites in getAllProduct, this might be unused or called by other methods?
		// findProductByCategory uses logic inside query, so this is mainly for stream filter helper.
		// Let's implement a quick fetch-based traversal if needed, or just standard traversal
		Category current = category;
		while (current != null) {
			if (current.getName() != null && current.getName().equalsIgnoreCase(categoryName)) {
				return true;
			}
			current = current.getParentCategory();
		}
		return false;
	}

}
=======
package com.example.backend.service;


import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
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
		
		List<Category> topLevels = categoryRepository.findByName(req.getTopLavelCategory());
		Category topLevel = topLevels.isEmpty() ? null : topLevels.get(0);
		
		if(topLevel==null) {
			
			Category topLavelCategory=new Category();
			topLavelCategory.setName(req.getTopLavelCategory());
			topLavelCategory.setLevel(1);
			
			topLevel= categoryRepository.save(topLavelCategory);
		}
		
		List<Category> secondLevels = categoryRepository.
				findByNameAndParentCategory(req.getSecondLavelCategory(),topLevel);
		Category secondLevel = secondLevels.isEmpty() ? null : secondLevels.get(0);
		
		if(secondLevel==null) {
			
			Category secondLavelCategory=new Category();
			secondLavelCategory.setName(req.getSecondLavelCategory());
			secondLavelCategory.setParentCategory(topLevel);
			secondLavelCategory.setLevel(2);
			
			secondLevel= categoryRepository.save(secondLavelCategory);
		}

		List<Category> thirdLevels = categoryRepository.findByNameAndParentCategory(req.getThirdLavelCategory(),secondLevel);
		Category thirdLevel = thirdLevels.isEmpty() ? null : thirdLevels.get(0);

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
		product.setSizeChart(req.getSizeChart());
		product.setBrand(req.getBrand());
		product.setPrice(req.getPrice());
		product.setSizes(req.getSize());
		product.setImages(req.getImages());
		product.setColors(req.getColors());
		
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
		
		if(req.getImages() != null && !req.getImages().isEmpty()) {
			product.setImages(req.getImages());
		}

		if(req.getColors() != null && !req.getColors().isEmpty()) {
			product.setColors(req.getColors());
		}

		// If sizes are being updated, recalculate total quantity
		if(req.getSizes() != null && !req.getSizes().isEmpty()) {
			product.setSizes(req.getSizes());
			int totalQuantity = req.getSizes().stream().mapToInt(com.example.backend.modal.size::getQuantity).sum();
			product.setQuantity(totalQuantity);
		}
		if(req.getTitle()!=null) {
			product.setTitle(req.getTitle());
		}
		if(req.getDescription()!=null) {
			product.setDescription(req.getDescription());
		}
		if(req.getPrice()!=0) {
			product.setPrice(req.getPrice());
		}
		if(req.getDiscountedPrice()!=0) {
			product.setDiscountedPrice(req.getDiscountedPrice());
		}
		if(req.getDiscountPersent()!=0) {
			product.setDiscountPersent(req.getDiscountPersent());
		}
		if(req.getBrand()!=null) {
			product.setBrand(req.getBrand());
		}
		if(req.getColor()!=null) {
			product.setColor(req.getColor());
		}
		if(req.getImageUrl()!=null) {
			product.setImageUrl(req.getImageUrl());
		}
		if(req.getSizeChart()!=null) {
			product.setSizeChart(req.getSizeChart());
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
		
		List<Category> cats = categoryRepository.findByName(category);
		Category cat = cats.isEmpty() ? null : cats.get(0);
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
		
		List<Product> products = productRepository.findAllByOrderByCreatedAtDesc();
		
		// Fetch all categories for robust hierarchy traversal
		List<Category> allCategories = categoryRepository.findAll();
		Map<String, Category> categoryMap = allCategories.stream()
				.collect(Collectors.toMap(Category::getId, Function.identity()));
		
		if (category != null && !category.isEmpty()) {
			System.out.println("Processing Category Filter: " + category);
			products = products.stream()
				.filter(p -> isCategoryMatching(p.getCategory(), category, categoryMap))
				.collect(Collectors.toList());
			System.out.println("Products matching category '" + category + "': " + products.size());
		}
		
		if (parentCategory != null && !parentCategory.isEmpty()) {
			products = products.stream()
				.filter(p -> isCategoryMatching(p.getCategory(), parentCategory, categoryMap))
				.collect(Collectors.toList());
		}
		
		if (minPrice != null && maxPrice != null) {
			products = products.stream()
				.filter(p -> p.getDiscountedPrice() >= minPrice && p.getDiscountedPrice() <= maxPrice)
				.collect(Collectors.toList());
		}
		
		if (minDiscount != null) {
			products = products.stream()
				.filter(p -> p.getDiscountPersent() >= minDiscount)
				.collect(Collectors.toList());
		}
		
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
		
		if (colors != null && !colors.isEmpty()) {
			List<String> validColors = colors.stream().filter(c -> c != null && !c.trim().isEmpty()).collect(Collectors.toList());
			if (!validColors.isEmpty()) {
				products = products.stream()
			        .filter(p -> validColors.stream().anyMatch(c -> 
                        (p.getColor() != null && c.equalsIgnoreCase(p.getColor())) || 
                        (p.getColors() != null && p.getColors().stream().anyMatch(pc -> pc.equalsIgnoreCase(c)))
                    ))
			        .collect(Collectors.toList());
			}
		} 

		if (sizes != null && !sizes.isEmpty()) {
			List<String> validSizes = sizes.stream().filter(s -> s != null && !s.trim().isEmpty()).collect(Collectors.toList());
			if (!validSizes.isEmpty()) {
				products = products.stream()
					.filter(p -> p.getSizes().stream()
							.anyMatch(s -> validSizes.contains(s.getName())))
					.collect(Collectors.toList());
			}
		}

		if(stock!=null && !stock.isEmpty()) {
			if(stock.equals("in_stock")) {
				products=products.stream().filter(p->p.getQuantity()>0).collect(Collectors.toList());
			}
			else if (stock.equals("out_of_stock")) {
				products=products.stream().filter(p->p.getQuantity()<1).collect(Collectors.toList());				
			}
		}
		
		int startIndex = (int) pageable.getOffset();
		// Fix for index out of bounds when page is out of range
		if (startIndex >= products.size()) {
			return new PageImpl<>(List.of(), pageable, products.size());
		}
		int endIndex = Math.min(startIndex + pageable.getPageSize(), products.size());

		List<Product> pageContent = products.subList(startIndex, endIndex);
		Page<Product> filteredProducts = new PageImpl<>(pageContent, pageable, products.size());
	    return filteredProducts;
	}


	@Override
	public List<Product> recentlyAddedProduct() {
		
		return productRepository.findTop10ByOrderByCreatedAtDesc();
	}

	private boolean isCategoryMatching(Category category, String categoryName, Map<String, Category> categoryMap) {
		Category current = category;
		while (current != null) {
			if (current.getName() != null && current.getName().equalsIgnoreCase(categoryName)) {
				return true;
			}
			// Use map to traverse up if parent is present but potentially not fetched
			if (current.getParentCategory() != null) {
				String parentId = current.getParentCategory().getId();
				if (parentId != null && categoryMap.containsKey(parentId)) {
					current = categoryMap.get(parentId);
					continue;
				}
			}
			// Fallback if no ID or not in map (shouldn't happen if consistency is good)
			current = current.getParentCategory();
		}
		return false;
	}

	// Legacy method overload to satisfy interface if needed, or helper
	private boolean isCategoryMatching(Category category, String categoryName) {
		// Fallback to fetching if map not provided? 
		// Ideally we should use the map version. For now, let's keep it simple or redirect?
		// Since we changed the call sites in getAllProduct, this might be unused or called by other methods?
		// findProductByCategory uses logic inside query, so this is mainly for stream filter helper.
		// Let's implement a quick fetch-based traversal if needed, or just standard traversal
		Category current = category;
		while (current != null) {
			if (current.getName() != null && current.getName().equalsIgnoreCase(categoryName)) {
				return true;
			}
			current = current.getParentCategory();
		}
		return false;
	}

}
>>>>>>> f3b6a345980233ed739f0533bd19c64770bd705a
