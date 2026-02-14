package com.example.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.exception.UserException;
import com.example.backend.modal.User;
import com.example.backend.service.UserService;

@RestController
@RequestMapping("/api/admin")
public class AdminUserController {
	
	@Autowired
	private UserService userService;
	
	@GetMapping("/users")
	public ResponseEntity<List<User>> getAllUsers(@RequestHeader("Authorization") String jwt) throws UserException{

		System.out.println("/api/users/profile");
		List<User> user=userService.findAllUsers();
		return new ResponseEntity<>(user,HttpStatus.ACCEPTED);
	}
	
	@DeleteMapping("/users/{userId}")
	public ResponseEntity<String> deleteUserHandler(@PathVariable String userId) throws UserException{
		userService.deleteUser(userId);
		return new ResponseEntity<>("User deleted successfully",HttpStatus.OK);
	}
	
	@PutMapping("/users/{userId}/role")
	public ResponseEntity<User> changeUserRoleHandler(@PathVariable String userId, @RequestHeader("Role") String role) throws UserException{
		User updatedUser = userService.changeUserRole(userId, role);
		return new ResponseEntity<>(updatedUser, HttpStatus.OK); 
	}
	
	@PutMapping("/users/{userId}/role/{role}")
	public ResponseEntity<User> changeUserRolePathHandler(@PathVariable String userId, @PathVariable String role) throws UserException{
		User updatedUser = userService.changeUserRole(userId, role);
		return new ResponseEntity<>(updatedUser, HttpStatus.OK);
	}

}
