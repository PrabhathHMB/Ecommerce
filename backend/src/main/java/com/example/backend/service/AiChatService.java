package com.example.backend.service;

import org.springframework.stereotype.Service;

@Service
public class AiChatService {

    public String getChatResponse(String userMessage) {
        String lowerCaseMessage = userMessage.toLowerCase();

        if (lowerCaseMessage.contains("hello") || lowerCaseMessage.contains("hi") || lowerCaseMessage.contains("hey")) {
            return "Hello! Welcome to Beauty Fashion. How can I assist you today?";
        } else if (lowerCaseMessage.contains("return") || lowerCaseMessage.contains("refund")) {
            return "We have a 14-day return policy for all unworn items with original tags. You can initiate a return from your order history page.";
        } else if (lowerCaseMessage.contains("shipping") || lowerCaseMessage.contains("delivery")) {
            return "We offer free island-wide delivery on orders over Rs. 5000. Standard delivery takes 2-4 business days.";
        } else if (lowerCaseMessage.contains("contact") || lowerCaseMessage.contains("support")) {
            return "You can reach our human support team at beautyfashion835@gmail.com or call us at +94 11 234 5678.";
        } else if (lowerCaseMessage.contains("address") || lowerCaseMessage.contains("location")) {
            return "Our main store is located at 123 Galle Road, Colombo 03, Sri Lanka.";
        } else if (lowerCaseMessage.contains("payment")) {
            return "We accept all major credit/debit cards (Visa, Mastercard) via PayHere, and also offer Cash on Delivery.";
        } else if (lowerCaseMessage.contains("track") || lowerCaseMessage.contains("order")) {
            return "You can track your order status in the 'My Orders' section of your profile.";
        } else if (lowerCaseMessage.contains("size") || lowerCaseMessage.contains("fit")) {
            return "Please check our size guide on each product page to find your perfect fit. We recommend measuring yourself for accuracy.";
        } else if (lowerCaseMessage.contains("thanks") || lowerCaseMessage.contains("thank you")) {
            return "You're welcome! Happy shopping at Beauty Fashion!";
        } else {
            return "I'm sorry, I interpret that as a specific inquiry. Could you please rephrase or ask about returns, shipping, or products? You can also contact our support for more help.";
        }
    }
}
