package com.example.backend.order.Repository;

import com.example.backend.order.Model.Order;
import java.time.LocalDateTime;
import org.springframework.data.domain.Page;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.security.core.parameters.P;

public interface OrderRepository extends MongoRepository<Order, String> {
    Page<Order> findByUserId(String userId, Pageable pageable);

    Page<Order> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate, Pageable pageable);

    Page<Order> findByStatus(String status, Pageable pageable);

    Page<Order> findByPaymentStatus(String paymentStatus, Pageable pageable);
}
