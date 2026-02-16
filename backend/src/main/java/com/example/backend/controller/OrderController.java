package com.example.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.exception.OrderException;
import com.example.backend.exception.UserException;
import com.example.backend.modal.Address;
import com.example.backend.modal.Order;
import com.example.backend.modal.User;
import com.example.backend.service.OrderService;
import com.example.backend.service.UserService;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
	
	private OrderService orderService;
	private UserService userService;
	
	public OrderController(OrderService orderService,UserService userService) {
		this.orderService=orderService;
		this.userService=userService;
	}
	
	@PostMapping("/")
	public ResponseEntity<Order> createOrderHandler(
			@RequestBody Address spippingAddress,
			@RequestHeader("Authorization")String jwt) throws UserException, OrderException{
		
		User user=userService.findUserProfileByJwt(jwt);
		Order order =orderService.createOrder(user, spippingAddress);
		
		return new ResponseEntity<Order>(order,HttpStatus.OK);
		
	}
	
	@GetMapping("/user")
	public ResponseEntity< List<Order>> usersOrderHistoryHandler(@RequestHeader("Authorization") 
	String jwt) throws OrderException, UserException{
		
		User user=userService.findUserProfileByJwt(jwt);
		List<Order> orders=orderService.usersOrderHistory(user.getId());
		return new ResponseEntity<>(orders,HttpStatus.ACCEPTED);
	}
	
	@GetMapping("/{orderId}")
	public ResponseEntity< Order> findOrderHandler(@PathVariable String orderId, @RequestHeader("Authorization") 
	String jwt) throws OrderException, UserException{
		
		User user=userService.findUserProfileByJwt(jwt);
		Order orders=orderService.findOrderById(orderId);
		return new ResponseEntity<>(orders,HttpStatus.ACCEPTED);
	}

	@PutMapping("/{orderId}/cancel")
	public ResponseEntity<Order> cancelOrderHandler(@PathVariable String orderId, 
			@RequestBody(required = false) String reason,
			@RequestHeader("Authorization") String jwt) throws OrderException, UserException {
		
		User user = userService.findUserProfileByJwt(jwt);
		Order order = orderService.findOrderById(orderId);
		
		// Ensure user owns the order
		if (!order.getUser().getId().equals(user.getId())) {
			throw new UserException("You can't cancel another user's order");
		}
		
		Order updatedOrder = orderService.cancledOrder(orderId, reason);
		return new ResponseEntity<>(updatedOrder, HttpStatus.OK);
	}

	@PutMapping("/{orderId}/return")
	public ResponseEntity<Order> returnOrderHandler(@PathVariable String orderId,
			@RequestBody String reason,
			@RequestHeader("Authorization") String jwt) throws OrderException, UserException {
		
		User user = userService.findUserProfileByJwt(jwt);
		Order order = orderService.findOrderById(orderId);
		
		// Ensure user owns the order
		if (!order.getUser().getId().equals(user.getId())) {
			throw new UserException("You can't return another user's order");
		}
		
		Order updatedOrder = orderService.returnOrder(orderId, reason);
		return new ResponseEntity<>(updatedOrder, HttpStatus.OK);
	}

}
