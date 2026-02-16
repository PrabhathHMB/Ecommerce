package com.example.backend.modal;
import com.fasterxml.jackson.annotation.JsonIgnore;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Document(collection = "addresses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Address {
	
	@Id
	private String id;

	private String firstName;
	
	private String lastName;
	
    private String streetAddress;

    private String city;

    private String state;

    private String zipCode;
    
    @DBRef
    @JsonIgnore
    private User user;
    
    private String mobile;
    


}
