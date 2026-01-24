package com.example.backend.responce;

import lombok.Data;


@Data
public class PayHereResponse {
    private String merchantId;
    private String returnUrl;
    private String cancelUrl;
    private String notifyUrl;
    private String orderId;
    private String items;
    private String currency;
    private double amount;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String address;
    private String city;
    private String country;
    private String hash; // Crucial for security
    private String url;  // The PayHere URL to submit to
}