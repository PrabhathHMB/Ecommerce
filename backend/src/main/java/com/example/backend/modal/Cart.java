package com.example.backend.modal;

import java.util.HashSet;
import java.util.Set;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Document(collection = "carts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Cart {

    @Id
    private String id;

    @DBRef
    private User user;

    @DBRef
    private Set<CartItem> cartItems = new HashSet<>();

    private double totalPrice;
    
    private int totalItem;
    
    private int totalDiscountedPrice;
    
    private int discounte;
    
    private int deliveryCharges;
    

}
