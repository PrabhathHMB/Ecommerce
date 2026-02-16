package com.example.backend.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.modal.Category;
import com.example.backend.repository.CategoryRepository;
import com.example.backend.repository.ProductRepository;

@RestController
@RequestMapping("/api/debug")
public class CategoryDebugController {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductRepository productRepository;

    @GetMapping("/categories")
    public List<Map<String, Object>> getCategories() {
        return categoryRepository.findAll().stream().map(c -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", c.getId());
            map.put("name", c.getName());
            if (c.getParentCategory() != null) {
                // Be careful with potentially lazy loaded parent
                // Ideally we'd look up in a map, but for debug, let's try direct access
                // If it fails, that's a finding!
                try {
                    map.put("parentId", c.getParentCategory().getId());
                    map.put("parentName", c.getParentCategory().getName());
                } catch (Exception e) {
                    map.put("parentError", e.getMessage());
                }
            } else {
                map.put("parent", "NULL");
            }
            return map;
        }).collect(Collectors.toList());
    }

    @GetMapping("/sample-products")
    public List<Map<String, Object>> getSampleProducts() {
        return productRepository.findAll().stream().limit(20).map(p -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", p.getId());
            map.put("title", p.getTitle());
            
            if (p.getCategory() != null) {
                map.put("categoryName", p.getCategory().getName());
                map.put("categoryId", p.getCategory().getId());
                
                List<String> hierarchy = new ArrayList<>();
                Category current = p.getCategory();
                while(current != null) {
                    hierarchy.add(current.getName());
                    current = current.getParentCategory();
                }
                map.put("hierarchy", hierarchy);
            } else {
                map.put("category", "NULL");
            }
            return map;
        }).collect(Collectors.toList());
    }
}
