package com.example.backend.modal;



import com.fasterxml.jackson.annotation.JsonIgnore;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Objects;

@Document(collection = "cartItems")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CartItem {
	
	@Id
	private String id;
	
	@JsonIgnore
	@DBRef
	private Cart cart;
	
	@DBRef
	private Product product;
	
	private String size;
	
	private String color;
	
	private int quantity;
	
	private Integer price;
	
	private Integer discountedPrice;
	
	private String userId;

	@Override
	public boolean equals(Object o) {
		if (this == o) return true;
		if (o == null || getClass() != o.getClass()) return false;
		CartItem cartItem = (CartItem) o;
		return Objects.equals(id, cartItem.id);
	}

	@Override
	public int hashCode() {
		return Objects.hash(id);
	}

}
