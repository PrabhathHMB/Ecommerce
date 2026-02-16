package com.example.backend.modal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.example.backend.user.domain.UserRole;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    private String id;

    private String firstName;
    
    private String lastName;

    private String password;

    private String email;

    private String role;
    
    private String mobile;

    @DBRef(lazy = true)
    private List<Address> addresses = new ArrayList<>();

    @JsonIgnore
    @DBRef(lazy = true)
    private List<Rating> ratings = new ArrayList<>();
    
    @JsonIgnore
    @DBRef(lazy = true)
    private List<Review> reviews = new ArrayList<>();
    
    private LocalDateTime createdAt;

    private String otp;
    
    private LocalDateTime otpExpiry;

    
}
