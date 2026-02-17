package com.example.backend.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.backend.exception.OrderException;
import com.example.backend.modal.Address;
import com.example.backend.modal.Cart;
import com.example.backend.modal.CartItem;
import com.example.backend.modal.Order;
import com.example.backend.modal.OrderItem;
import com.example.backend.modal.Product;
import com.example.backend.modal.User;
import com.example.backend.repository.AddressRepository;
import com.example.backend.repository.OrderItemRepository;
import com.example.backend.repository.OrderRepository;
import com.example.backend.repository.ProductRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.user.domain.OrderStatus;
import com.example.backend.user.domain.PaymentStatus;

@Service
public class OrderServiceImplementation implements OrderService {
	
	private OrderRepository orderRepository;
	private CartService cartService;
	private AddressRepository addressRepository;
	private UserRepository userRepository;
	private OrderItemService orderItemService;
	private OrderItemRepository orderItemRepository;
	private ProductRepository productRepository;
	private EmailService emailService;
	
	public OrderServiceImplementation(OrderRepository orderRepository,CartService cartService,
			AddressRepository addressRepository,UserRepository userRepository,
			OrderItemService orderItemService,OrderItemRepository orderItemRepository,
			ProductRepository productRepository, EmailService emailService) {
		this.orderRepository=orderRepository;
		this.cartService=cartService;
		this.addressRepository=addressRepository;
		this.userRepository=userRepository;
		this.orderItemService=orderItemService;
		this.orderItemRepository=orderItemRepository;
		this.productRepository=productRepository;
		this.emailService=emailService;
	}

	@Override
	public Order createOrder(User user, Address shippAddress) throws OrderException {
		
		shippAddress.setUser(user);
		Address address= addressRepository.save(shippAddress);
		user.getAddresses().add(address);
		userRepository.save(user);
		
		Cart cart=cartService.findUserCart(user.getId());
		List<OrderItem> orderItems=new ArrayList<>();
		
		Order createdOrder=new Order();
		createdOrder.setUser(user);
		createdOrder.setShippingAddress(address);
		createdOrder.setOrderDate(LocalDate.now());
		createdOrder.setOrderStatus(OrderStatus.PENDING);
		createdOrder.getPaymentDetails().setStatus(PaymentStatus.PENDING);
		createdOrder.setCreatedAt(LocalDateTime.now());
		createdOrder.setTotalPrice(cart.getTotalPrice());
		createdOrder.setTotalDiscountedPrice(cart.getTotalDiscountedPrice());
		createdOrder.setDiscount(cart.getDiscounte());
		createdOrder.setTotalItem(cart.getTotalItem());
		createdOrder.setDeliveryCharges(cart.getDeliveryCharges());
		
		// Save order first to get the ID
		Order savedOrder=orderRepository.save(createdOrder);
		
		for(CartItem item: cart.getCartItems()) {
			OrderItem orderItem=new OrderItem();
			
			orderItem.setPrice(item.getPrice());
			orderItem.setProduct(item.getProduct());
			orderItem.setQuantity(item.getQuantity());
			orderItem.setSize(item.getSize());
			orderItem.setUserId(item.getUserId());
			orderItem.setDiscountedPrice(item.getDiscountedPrice());
			orderItem.setOrder(savedOrder); // Set order reference immediately
			
			// Subtract quantity from product
			Product product = item.getProduct();
			if (product != null) {
				Optional<Product> optProduct = productRepository.findById(product.getId());
				if (optProduct.isPresent()) {
					Product dbProduct = optProduct.get();
					
					// 1. Decrement size-specific quantity if applicable
					if (item.getSize() != null && dbProduct.getSizes() != null) {
						for (com.example.backend.modal.size s : dbProduct.getSizes()) {
							if (s.getName().equalsIgnoreCase(item.getSize())) {
								if (s.getQuantity() < item.getQuantity()) {
									throw new OrderException("Not enough quantity for product: " + dbProduct.getTitle() + " size: " + item.getSize());
								}
								s.setQuantity(s.getQuantity() - item.getQuantity());
								break;
							}
						}
					}
					
					// 2. Decrement total quantity
					if (dbProduct.getQuantity() < item.getQuantity()) {
						throw new OrderException("Not enough quantity for product: " + dbProduct.getTitle());
					}
					
					dbProduct.setQuantity(dbProduct.getQuantity() - item.getQuantity());
					productRepository.save(dbProduct);
				}
			}
			
			// Save order item only once with order reference already set
			OrderItem createdOrderItem=orderItemRepository.save(orderItem);
			orderItems.add(createdOrderItem);
		}
		
		// Update the saved order with the order items list
		savedOrder.setOrderItems(orderItems);	
		
		emailService.sendOrderConfirmationEmail(user.getEmail(), savedOrder);
		
		// Clear the cart after successful order placement
		cartService.clearCart(user.getId());
		
		return savedOrder;
		
	}

	@Override
	public Order placedOrder(String orderId) throws OrderException {
		Order order=findOrderById(orderId);
		order.setOrderStatus(OrderStatus.PLACED);
		order.getPaymentDetails().setStatus(PaymentStatus.COMPLETED);
		return order;
	}

	@Override
	public Order confirmedOrder(String orderId) throws OrderException {
		Order order=findOrderById(orderId);
		order.setOrderStatus(OrderStatus.CONFIRMED);
		
		
		// Send confirmation email
		emailService.sendOrderStatusEmail(order.getUser().getEmail(), order, "CONFIRMED", "Your order has been confirmed successfully.");
		
		return orderRepository.save(order);
	}

	@Override
	public Order shippedOrder(String orderId) throws OrderException {
		Order order=findOrderById(orderId);
		order.setOrderStatus(OrderStatus.SHIPPED);
		// Send shipped email
		emailService.sendOrderStatusEmail(order.getUser().getEmail(), order, "SHIPPED", "Great news! Your order has been shipped and is on its way.");
		return orderRepository.save(order);
	}

	@Override
	public Order deliveredOrder(String orderId) throws OrderException {
		Order order=findOrderById(orderId);
		order.setOrderStatus(OrderStatus.DELIVERED);
		
		if(order.getPaymentDetails().getStatus()==PaymentStatus.PENDING && 
				order.getPaymentDetails().getPaymentId() != null && 
				order.getPaymentDetails().getPaymentId().startsWith("COD-")) {
			order.getPaymentDetails().setStatus(PaymentStatus.COMPLETED);
		}
		
		// Send delivered email
		emailService.sendOrderStatusEmail(order.getUser().getEmail(), order, "DELIVERED", "Your order has been delivered.");

		return orderRepository.save(order);
	}

	@Override
	public Order cancledOrder(String orderId) throws OrderException {
		Order order=findOrderById(orderId);
		order.setOrderStatus(OrderStatus.CANCELLED);
		// Send cancelled email
		emailService.sendOrderStatusEmail(order.getUser().getEmail(), order, "CANCELLED", "Your order has been cancelled.");
		return orderRepository.save(order);
	}

	@Override
	public Order cancledOrder(String orderId, String reason) throws OrderException {
		Order order=findOrderById(orderId);
		
		if(order.getOrderStatus() == OrderStatus.DELIVERED || 
				order.getOrderStatus() == OrderStatus.RETURNED || 
				order.getOrderStatus() == OrderStatus.CANCELLED) {
			
			throw new OrderException("Order cannot be cancelled at this stage.");
		}
		
		order.setOrderStatus(OrderStatus.CANCELLED);
		order.setCancellationReason(reason);
		// Send cancelled email with reason
		emailService.sendOrderStatusEmail(order.getUser().getEmail(), order, "CANCELLED", "Your order has been cancelled. Reason: " + reason);
		return orderRepository.save(order);
	}

	@Override
	public Order returnOrder(String orderId, String reason) throws OrderException {
		Order order = findOrderById(orderId);

		if (order.getOrderStatus() != OrderStatus.DELIVERED) {
			throw new OrderException("Order can only be returned after it is withdrawn.");
		}
		
		int daysSinceDelivery = 0;
		if (order.getDeliveryDate() != null) {
			daysSinceDelivery = java.time.Period.between(order.getDeliveryDate(), LocalDate.now()).getDays();
		}

		if (daysSinceDelivery > 7) {
			throw new OrderException("Order cannot be returned after 7 days of delivery.");
		}

		order.setOrderStatus(OrderStatus.RETURNED);
		order.setReturnReason(reason);
		// Send return email
		emailService.sendOrderStatusEmail(order.getUser().getEmail(), order, "RETURNED", "Your return request has been processed. Reason: " + reason);
		return orderRepository.save(order);
	}

	@Override
	public Order findOrderById(String orderId) throws OrderException {
		Optional<Order> opt=orderRepository.findById(orderId);
		
		if(opt.isPresent()) {
			return opt.get();
		}
		throw new OrderException("order not exist with id "+orderId);
	}

	@Override
	public List<Order> usersOrderHistory(String userId) {
        Optional<User> user = userRepository.findById(userId);
        if (user.isPresent()) {
            return orderRepository.findByUser(user.get());
        }
        return new ArrayList<>();
	}

	@Override
	public List<Order> getAllOrders() {
		
		return orderRepository.findAllByOrderByCreatedAtDesc();
	}

	@Override
	public void deleteOrder(String orderId) throws OrderException {
		Order order =findOrderById(orderId);
		
		orderRepository.deleteById(orderId);
		
	}

}
