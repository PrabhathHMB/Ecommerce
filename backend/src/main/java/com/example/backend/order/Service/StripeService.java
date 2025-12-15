package com.example.backend.order.Service;

import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import com.stripe.Stripe;

@Service
public class StripeService {

    @Value("${stripe.api.key}")  
    private String secretKey;

    public StripeService() {
    }

    public PaymentIntent createPaymentIntent(String paymentMethodId, int amount, String currency) throws StripeException {
        Stripe.apiKey = secretKey;

        try {
            PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                    .setAmount((long) amount)  // Amount in the smallest currency unit (e.g., cents)
                    .setCurrency(currency)     // Currency (e.g., "usd")
                    .setPaymentMethod(paymentMethodId)  // Use the PaymentMethod ID from the frontend
                    .setConfirmationMethod(PaymentIntentCreateParams.ConfirmationMethod.AUTOMATIC)  // Automatically confirm
                    .setConfirm(true)          // Confirm the payment immediately
                    .setReturnUrl("http://localhost:5173")  // Redirect URL after payment
                    .build();

            PaymentIntent paymentIntent = PaymentIntent.create(params);

            // Log the response for debugging
            System.out.println("PaymentIntent Created: ID=" + paymentIntent.getId() + " Status=" + paymentIntent.getStatus());

            return paymentIntent;
        } catch (StripeException e) {
            System.err.println("Stripe PaymentIntent creation failed: " + e.getMessage());
            throw e;  // Rethrow the exception for proper error handling
        }
    }
}


