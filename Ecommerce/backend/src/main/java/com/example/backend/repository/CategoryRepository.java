package com.example.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.example.backend.modal.Category;

public interface CategoryRepository extends MongoRepository<Category, String> {

	public Category findByName(String name);

	public Category findByNameAndParentCategory(String name, Category parentCategory);
}
