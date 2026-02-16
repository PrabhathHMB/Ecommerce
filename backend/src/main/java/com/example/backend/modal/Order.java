package com.example.backend.modal;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import com.example.backend.user.domain.OrderStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Document(collection = "orders")
@NoArgsConstructor
@AllArgsConstructor
public class Order {

    @Id
    private String id;

    private String orderId;
  
    @DBRef
    private User user;

    @DBRef
    private List<OrderItem> orderItems = new ArrayList<>();

    private LocalDate orderDate = LocalDate.now();

    private LocalDate deliveryDate;

    @DBRef
    private Address shippingAddress;

    private PaymentDetails paymentDetails = new PaymentDetails();

    private double totalPrice;
    
    private Integer totalDiscountedPrice;
    
    private Integer discount;
    
    private int deliveryCharges;

    private OrderStatus orderStatus;
    
    private int totalItem;
    
    private LocalDateTime createdAt;

    private String cancellationReason;

    private String returnReason;


}
