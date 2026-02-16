package com.example.backend.controller;

import java.security.MessageDigest;
import java.text.DecimalFormat;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.exception.OrderException;
import com.example.backend.exception.UserException;
import com.example.backend.modal.Order;
import com.example.backend.repository.OrderRepository;
import com.example.backend.responce.ApiResponse;
import com.example.backend.responce.PayHereResponse;
import com.example.backend.service.OrderService;
import com.example.backend.service.UserService;
import com.example.backend.user.domain.OrderStatus;
import com.example.backend.user.domain.PaymentStatus;

@RestController
@RequestMapping("/api")
public class PaymentController {

    @Value("${payhere.merchant.id}")
    private String merchantId;

    @Value("${payhere.merchant.secret}")
    private String merchantSecret;
    
    @Value("${payhere.base.url}")
    private String payhereUrl;

    @Value("${payhere.return.url}")
    private String returnUrl;

    @Value("${payhere.cancel.url}")
    private String cancelUrl;
    
    @Value("${payhere.notify.url}")
    private String notifyUrl;

    private final OrderService orderService;
    private final OrderRepository orderRepository;
    private final com.example.backend.service.CartService cartService;

    public PaymentController(OrderService orderService, UserService userService, OrderRepository orderRepository, com.example.backend.service.CartService cartService) {
        this.orderService = orderService;
        this.orderRepository = orderRepository;
        this.cartService = cartService;
    }

    // 1. Initiate Payment: Generate Hash and send data to Frontend
    @PostMapping("/payments/{orderId}")
    public ResponseEntity<PayHereResponse> createPaymentLink(@PathVariable String orderId,
            @RequestHeader("Authorization") String jwt) throws UserException, OrderException {

        Order order = orderService.findOrderById(orderId);

        // Format amount to 2 decimal places (Required by PayHere for hash)
        DecimalFormat df = new DecimalFormat("0.00");
        String amountFormatted = df.format(order.getTotalPrice());
        String currency = "LKR";

        // Generate MD5 Hash
        // Hash Format: uppercase(md5(merchant_id + order_id + amount + currency + uppercase(md5(merchant_secret))))
        String hash = generatePayHereHash(merchantId, order.getId(), amountFormatted, currency, merchantSecret);

        PayHereResponse response = new PayHereResponse();
        response.setMerchantId(merchantId);
        response.setReturnUrl(returnUrl);
        response.setCancelUrl(cancelUrl);
        response.setNotifyUrl(notifyUrl);
        response.setOrderId(order.getId());
        response.setItems("Order #" + order.getId());
        response.setCurrency(currency);
        response.setAmount(order.getTotalPrice());
        response.setFirstName(order.getUser().getFirstName());
        response.setLastName(order.getUser().getLastName());
        response.setEmail(order.getUser().getEmail());
        response.setPhone(order.getUser().getMobile());
        response.setAddress(order.getShippingAddress().getStreetAddress());
        response.setCity(order.getShippingAddress().getCity());
        response.setCountry("Sri Lanka");
        response.setHash(hash);
        response.setUrl(payhereUrl);

        return new ResponseEntity<>(response, HttpStatus.ACCEPTED);
    }

    // 3. Handle Cash On Delivery
    @PostMapping("/payments/cod/{orderId}")
    public ResponseEntity<ApiResponse> combineCodPayment(@PathVariable String orderId,
            @RequestHeader("Authorization") String jwt) throws UserException, OrderException {
    	
    	Order order = orderService.findOrderById(orderId);
    	
    	try {
            order.getPaymentDetails().setPaymentId("COD-" + order.getId());
            order.getPaymentDetails().setStatus(PaymentStatus.PENDING); // Payment pending until delivery
            order.setOrderStatus(OrderStatus.PLACED);
            
            orderRepository.save(order);
            
            // Clear Cart
            cartService.clearCart(order.getUser().getId());
            
            ApiResponse res = new ApiResponse("COD Order Placed Successfully", true);
            return new ResponseEntity<>(res, HttpStatus.OK);
            
        } catch (Exception e) {
            throw new OrderException(e.getMessage());
        }
    }

    // 4. Simulate Payment Success (FOR TESTING/LOCALHOST ONLY)
    @PostMapping("/payments/{orderId}/success-test")
    public ResponseEntity<ApiResponse> simulatePaymentSuccess(@PathVariable String orderId,
            @RequestHeader("Authorization") String jwt) throws UserException, OrderException {
        
        Order order = orderService.findOrderById(orderId);
        
        try {
            order.getPaymentDetails().setPaymentId("TEST-" + order.getId());
            order.getPaymentDetails().setStatus(PaymentStatus.COMPLETED);
            order.setOrderStatus(OrderStatus.PLACED); // Changed to PLACED to match COD
            
            orderRepository.save(order);
            
            // Clear Cart
            cartService.clearCart(order.getUser().getId());
            
            ApiResponse res = new ApiResponse("Test Payment Confirmed Successfully", true);
            return new ResponseEntity<>(res, HttpStatus.OK);
            
        } catch (Exception e) {
            throw new OrderException(e.getMessage());
        }
    }

    // 2. Handle PayHere Notify (Webhook)
    // PayHere calls this URL automatically when payment is successful
    @PostMapping("/payments/notify")
    public ResponseEntity<String> payHereNotify(@RequestParam Map<String, String> formData) {
        
        String orderIdReq = formData.get("order_id");
        String payhereAmount = formData.get("payhere_amount");
        String payhereCurrency = formData.get("payhere_currency");
        String statusCode = formData.get("status_code");
        String md5sig = formData.get("md5sig");

        // 1. Verify Hash securely
        String localMd5 = generatePayHereHash(merchantId, orderIdReq, payhereAmount, payhereCurrency, merchantSecret);

        System.out.println("PayHere Notify: orderId=" + orderIdReq + " status=" + statusCode);
        System.out.println("Local Hash: " + localMd5);
        System.out.println("PayHere Hash: " + md5sig);

        if (localMd5.equals(md5sig)) {
            // NOTE: In production, you MUST check && statusCode.equals("2")
            // Removed for testing to allow "Card Denied" to still mark order as success per user request
            // Status Code 2 means Success
            try {
                Order order = orderService.findOrderById(orderIdReq);
                
                order.getPaymentDetails().setPaymentId(formData.get("payment_id"));
                order.getPaymentDetails().setStatus(PaymentStatus.COMPLETED);
                order.setOrderStatus(OrderStatus.PLACED);
                
                orderRepository.save(order);
                
                // Clear Cart
                cartService.clearCart(order.getUser().getId());
                
                System.out.println("Payment Success for Order ID: " + orderIdReq);
                return new ResponseEntity<>(HttpStatus.OK);
                
            } catch (Exception e) {
                e.printStackTrace();
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
        } else {
            System.out.println("Payment Verification Failed or Cancelled");
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    // Helper method to generate MD5 Hash
    private String generatePayHereHash(String merchantId, String orderId, String amount, String currency, String merchantSecret) {
        try {
            MessageDigest md = MessageDigest.getInstance("MD5");
            
            // 1. Hash the secret first
            md.update(merchantSecret.getBytes());
            byte[] secretBytes = md.digest();
            String merchantSecretMd5 = toHexString(secretBytes).toUpperCase();
            
            // 2. Hash the connection string
            String strToHash = merchantId + orderId + amount + currency + merchantSecretMd5;
            md.update(strToHash.getBytes());
            byte[] hashBytes = md.digest();
            
            return toHexString(hashBytes).toUpperCase();
            
        } catch (Exception e) {
            throw new RuntimeException("Error generating hash", e);
        }
    }

    // Helper to convert byte array to Hex String
    private String toHexString(byte[] bytes) {
        StringBuilder sb = new StringBuilder();
        for (byte b : bytes) {
            sb.append(String.format("%02x", b));
        }
        return sb.toString();
    }
}