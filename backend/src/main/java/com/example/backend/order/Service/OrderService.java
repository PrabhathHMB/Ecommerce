package com.example.backend.order.Service;

import com.example.backend.order.ENUMS.OrderStatus;
import com.example.backend.order.ENUMS.PaymentStatus;
import com.example.backend.order.Model.Order;
import com.example.backend.order.Repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.time.LocalDateTime;
import java.util.Optional;



@Service
public class OrderService {
    private final OrderRepository orderRepository;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public Page<Order> getAllOrders(Pageable pageable) {
        return orderRepository.findAll(pageable);
    }

    public Page<Order> getOrdersByUserId(String userId, Pageable pageable) {
        return orderRepository.findByUserId(userId, pageable);
    }

    public Page<Order> getOrdersByDateRange(LocalDateTime startDate, LocalDateTime endDate, Pageable pageable) {
        return orderRepository.findByCreatedAtBetween(startDate, endDate, pageable);
    }

    public Page<Order> getOrdersByStatus(String status, Pageable pageable) {
        return orderRepository.findByStatus(status, pageable);
    }

    public Page<Order> getOrdersByPaymentStatus(String paymentStatus, Pageable pageable) {
        return orderRepository.findByPaymentStatus(paymentStatus, pageable);
    }

        public Order createOrder(Order order) {
        order.setCreatedAt(LocalDateTime.now());
        order.setLastUpdatedAt(LocalDateTime.now());
        order.setStatus(OrderStatus.PENDING); // Default status
        return orderRepository.save(order);
    }

    public Optional<Order> getOrderById(String id) {
        return orderRepository.findById(id);
    }

    public Order updateOrderStatus(String id, OrderStatus status, String adminId) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus(status);
        order.setLastUpdatedAt(LocalDateTime.now());
        order.setUpdatedBy(adminId);
        return orderRepository.save(order);
    }


    //Confirm delivery of an order
    public Order confirmDelivery(String id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        if (order.getStatus() == OrderStatus.DELIVERED) {
            order.setConfirmedByUser(true);
            order.setStatus(OrderStatus.CONFIRMED);
            order.setLastUpdatedAt(LocalDateTime.now());
            return orderRepository.save(order);
        } else {
            throw new RuntimeException("Delivery cannot be confirmed for orders not marked as DELIVERED");
        }
    }
}
