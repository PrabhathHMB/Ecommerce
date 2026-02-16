<<<<<<< HEAD
package com.example.backend.service;

import java.util.List;

import com.example.backend.exception.UserException;
import com.example.backend.modal.User;

public interface UserService {
	
	public User findUserById(String userId) throws UserException;
	
	public User findUserProfileByJwt(String jwt) throws UserException;
	
	public List<User> findAllUsers();
	
	public void deleteUser(String userId) throws UserException;
	
	public User changeUserRole(String userId, String role) throws UserException;

}
=======
package com.example.backend.service;

import java.util.List;

import com.example.backend.exception.UserException;
import com.example.backend.modal.User;

public interface UserService {
	
	public User findUserById(String userId) throws UserException;
	
	public User findUserProfileByJwt(String jwt) throws UserException;
	
	public List<User> findAllUsers();
	
	public void deleteUser(String userId) throws UserException;
	
	public User changeUserRole(String userId, String role) throws UserException;

}
>>>>>>> f3b6a345980233ed739f0533bd19c64770bd705a
