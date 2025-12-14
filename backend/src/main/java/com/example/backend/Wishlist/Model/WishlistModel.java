package com.example.backend.Wishlist.Model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "wishlists")
public class WishlistModel {
    @Id
    private String id;
    private String userId;
    private List<String> productIds;

    // Getters and Setters
}
