package com.example.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender javaMailSender;

    @Async
    public void sendSimpleMessage(String to, String subject, String text) {
        try {
            System.out.println("=== Attempting to send email ===");
            System.out.println("To: " + to);
            System.out.println("Subject: " + subject);
            
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("noreply@ecommerce.com");
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);
            javaMailSender.send(message);
            
            System.out.println("✅ Email sent successfully to: " + to);
        } catch (Exception e) {
            System.err.println("❌ Failed to send email to: " + to);
            System.err.println("Error: " + e.getMessage());
            e.printStackTrace();
        }
    }

    public void sendForgotPasswordEmail(String to, String otp) {
        String subject = "Forgot Password OTP";
        String text = "Your OTP for password reset is: " + otp + "\nThis OTP is valid for 10 minutes.";
        sendSimpleMessage(to, subject, text);
    }

    @Async
    public void sendOrderConfirmationEmail(String to, com.example.backend.modal.Order order) {
        try {
            System.out.println("=== Sending Order Confirmation Email ===");
            System.out.println("To: " + to);
            System.out.println("Order ID: " + order.getId());
            
            String subject = "Order Confirmation - Order #" + order.getId();
            StringBuilder text = new StringBuilder();
            text.append("Dear ").append(order.getUser().getFirstName()).append(",\n\n");
            text.append("Thank you for your order! Your order has been placed successfully.\n");
            text.append("Order ID: ").append(order.getId()).append("\n");
            text.append("Order Date: ").append(order.getOrderDate()).append("\n");
            text.append("Total Amount: LKR").append(order.getTotalDiscountedPrice()).append("\n");
            text.append("Shipping Address: ").append(order.getShippingAddress().getStreetAddress())
                .append(", ").append(order.getShippingAddress().getCity())
                .append(", ").append(order.getShippingAddress().getState())
                .append(" - ").append(order.getShippingAddress().getZipCode()).append("\n\n");
            text.append("Items:\n");
            
            for (com.example.backend.modal.OrderItem item : order.getOrderItems()) {
                text.append("- ").append(item.getProduct().getTitle())
                    .append(" (Size: ").append(item.getSize()).append(")")
                    .append(" x ").append(item.getQuantity())
                    .append(" - LKR").append(item.getDiscountedPrice()).append("\n");
            }
            
            text.append("\nWe will notify you once your order is shipped.\n");
            text.append("Thank you for shopping with us!");
            
            // Send email directly instead of calling another async method
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("noreply@ecommerce.com");
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text.toString());
            javaMailSender.send(message);
            
            System.out.println("✅ Order confirmation email sent successfully to: " + to);
        } catch (Exception e) {
            System.err.println("❌ Failed to send order confirmation email to: " + to);
            System.err.println("Error: " + e.getMessage());
            e.printStackTrace();
        }
    }

    @Async
    public void sendOrderStatusEmail(String to, com.example.backend.modal.Order order, String status, String messageBody) {
        try {
            System.out.println("=== Sending Order Status Email ===");
            System.out.println("To: " + to);
            System.out.println("Status: " + status);
            
            String subject = "Order Status Update - " + status + " - Order #" + order.getId();
            StringBuilder text = new StringBuilder();
            text.append("Dear ").append(order.getUser().getFirstName()).append(",\n\n");
            text.append(messageBody).append("\n\n");
            
            text.append("Order ID: ").append(order.getId()).append("\n");
            text.append("Current Status: ").append(status).append("\n");
            text.append("Order Date: ").append(order.getOrderDate()).append("\n");
            text.append("Total Amount: LKR").append(order.getTotalDiscountedPrice()).append("\n\n");
            
            text.append("Items:\n");
            for (com.example.backend.modal.OrderItem item : order.getOrderItems()) {
                text.append("- ").append(item.getProduct().getTitle())
                    .append(" (Size: ").append(item.getSize()).append(")")
                    .append(" x ").append(item.getQuantity())
                    .append(" - LKR").append(item.getDiscountedPrice()).append("\n");
            }
            
            text.append("\nThank you for shopping with us!");
            
            // Send email directly instead of calling another async method
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("noreply@ecommerce.com");
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text.toString());
            javaMailSender.send(message);
            
            System.out.println("✅ Order status email sent successfully to: " + to);
        } catch (Exception e) {
            System.err.println("❌ Failed to send order status email to: " + to);
            System.err.println("Error: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
