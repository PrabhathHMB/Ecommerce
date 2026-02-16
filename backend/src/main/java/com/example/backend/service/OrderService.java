package com.example.backend.service;

import java.util.List;

import com.example.backend.exception.OrderException;
import com.example.backend.modal.Address;
import com.example.backend.modal.Order;
import com.example.backend.modal.User;

public interface OrderService {
	
	public Order createOrder(User user, Address shippingAdress) throws OrderException;
	
	public Order findOrderById(String orderId) throws OrderException;
	
	public List<Order> usersOrderHistory(String userId);
	
	public Order placedOrder(String orderId) throws OrderException;
	
	public Order confirmedOrder(String orderId)throws OrderException;
	
	public Order shippedOrder(String orderId) throws OrderException;
	
	public Order deliveredOrder(String orderId) throws OrderException;
	
	public Order cancledOrder(String orderId) throws OrderException;

	public Order cancledOrder(String orderId, String reason) throws OrderException;

	public Order returnOrder(String orderId, String reason) throws OrderException;
	
	public List<Order>getAllOrders();
	
	public void deleteOrder(String orderId) throws OrderException;
	
}
