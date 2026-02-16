<<<<<<< HEAD
package com.example.backend.service;

import java.util.List;

import com.example.backend.exception.ProductException;
import com.example.backend.modal.Rating;
import com.example.backend.modal.User;
import com.example.backend.request.RatingRequest;

public interface RatingServices {
	
	public Rating createRating(RatingRequest req,User user) throws ProductException;
	
	public List<Rating> getProductsRating(String productId);

}
=======
package com.example.backend.service;

import java.util.List;

import com.example.backend.exception.ProductException;
import com.example.backend.modal.Rating;
import com.example.backend.modal.User;
import com.example.backend.request.RatingRequest;

public interface RatingServices {
	
	public Rating createRating(RatingRequest req,User user) throws ProductException;
	
	public List<Rating> getProductsRating(String productId);

}
>>>>>>> f3b6a345980233ed739f0533bd19c64770bd705a
