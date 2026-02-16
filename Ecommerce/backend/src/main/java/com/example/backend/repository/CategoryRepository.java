package com.example.backend.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.example.backend.modal.Category;

public interface CategoryRepository extends MongoRepository<Category, String> {

	public List<Category> findByName(String name);

	public List<Category> findByNameAndParentCategory(String name, Category parentCategory);
}
