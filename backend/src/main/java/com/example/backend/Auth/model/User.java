package com.example.backend.Auth.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.springframework.data.annotation.Id; // Missing import
import org.springframework.data.mongodb.core.mapping.Document;
import com.example.backend.Auth.Enums.Role; 

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Document(collection = "users")

public class User {
     @Id
    private String id;

    private String email;

    private String password;

    private Role role;

    private UserDetail userDetail; 

}
