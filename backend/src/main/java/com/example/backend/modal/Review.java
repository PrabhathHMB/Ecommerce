package com.example.backend.modal;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Document(collection = "reviews")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Review {
	
	@Id
	private String id;
	
	private String review;
	
	@DBRef
	@JsonIgnore
	private Product product;

	@DBRef
	private User user;
	
	private LocalDateTime createdAt;
	



}
