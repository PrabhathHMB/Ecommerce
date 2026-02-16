package com.example.backend.modal;

import java.time.LocalDateTime;
import java.util.Objects;

import com.fasterxml.jackson.annotation.JsonIgnore;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Document(collection = "orderItems")
@NoArgsConstructor
@AllArgsConstructor
public class OrderItem {
	
	@Id
	private String id;
	
	@JsonIgnore
	@DBRef
	private Order order;
	
	@DBRef
	private Product product;
	
	private String size;
	
	private int quantity;
	
	private Integer price;
	
	private Integer discountedPrice;
	
	private String userId;
	
	private LocalDateTime deliveryDate;


}