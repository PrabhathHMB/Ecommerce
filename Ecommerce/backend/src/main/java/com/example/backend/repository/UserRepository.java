package com.example.backend.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.example.backend.modal.User;

public interface UserRepository extends MongoRepository<User, String> {

	public User findByEmail(String email);

	public List<User> findAllByOrderByCreatedAtDesc();

}
