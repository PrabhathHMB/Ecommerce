package com.example.backend.modal;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Document(collection = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Product {

    @Id
    @EqualsAndHashCode.Include
    private String id;

    private String title;

    private String description;

    private int price;

    private int discountedPrice;
    
    private int discountPersent;

    private int quantity;

    private String brand;

    private String color;

    private List<String> colors = new ArrayList<>();

    private Set<size> sizes = new HashSet<>();

    private String imageUrl;

    private List<String> images = new ArrayList<>();

    private String sizeChart;

    @JsonIgnore
    @DBRef(lazy = true)
    private List<Rating> ratings = new ArrayList<>();
    
    @JsonIgnore
    @DBRef(lazy = true)
    private List<Review> reviews = new ArrayList<>();

    private int numRatings;
    
    private double averageRating;

    @DBRef
    private Category category;
    
    private LocalDateTime createdAt;
    


   
}
