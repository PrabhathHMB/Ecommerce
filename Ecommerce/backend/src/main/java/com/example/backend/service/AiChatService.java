package com.example.backend.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

@Service
public class AiChatService {

    private static final Logger logger = LoggerFactory.getLogger(AiChatService.class);

    @Value("${ai.api.url:https://api.openai.com/v1/chat/completions}")
    private String apiUrl;

    @Value("${ai.api.key:}")
    private String apiKey;

    private final RestTemplate restTemplate;

    public AiChatService() {
        this.restTemplate = new RestTemplate();
    }

    private static final String SYSTEM_PROMPT = 
        "You are the helpful and friendly customer support AI for 'Beauty Fashion', a premium online clothing store. " +
        "Your goal is to assist customers with their inquiries about our stylish and affordable clothing collections. " +
        "We offer a wide range of products including dresses, jeans, skirts, and more. " +
        "If asked about returns, we have a 14-day return policy for unworn items with tags. " +
        "If asked about shipping, we offer free shipping on orders over Rs. 5000. " +
        "Always be polite, professional, and concise. " +
        "If you don't know the answer, politely ask them to contact human support at beautyfashion835@gmail.com. " +
        "\n\nUser Query: ";

    public String getChatResponse(String userMessage) {
        if (apiKey == null || apiKey.isEmpty()) {
            if (apiUrl != null && !apiUrl.contains("key=")) {
                logger.warn("API Key is missing and not found in URL");
                return "AI Support is currently unavailable (API Key not configured).";
            }
        }

        String finalUrl = apiUrl;
        if (apiKey != null && !apiKey.isEmpty() && !finalUrl.contains("key=")) {
             finalUrl += (finalUrl.contains("?") ? "&" : "?") + "key=" + apiKey;
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Construct Gemini Request Body
        Map<String, Object> part = new HashMap<>();
        // Combine system prompt with user message
        part.put("text", SYSTEM_PROMPT + userMessage);

        Map<String, Object> content = new HashMap<>();
        content.put("parts", List.of(part));

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("contents", List.of(content));

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            logger.info("Sending request to AI Service. URL: {}", finalUrl);
            
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                finalUrl, 
                HttpMethod.POST, 
                entity, 
                new ParameterizedTypeReference<Map<String, Object>>() {}
            );
            
            logger.info("Received response from AI Service. Status: {}", response.getStatusCode());

            // Parse Gemini Response
            Map<String, Object> body = response.getBody();
            if (body != null && body.containsKey("candidates")) {
                Object candidatesObj = body.get("candidates");
                if (candidatesObj instanceof List) {
                    List<?> candidates = (List<?>) candidatesObj;
                    if (!candidates.isEmpty()) {
                        Object firstCandidate = candidates.get(0);
                        if (firstCandidate instanceof Map) {
                            Map<?, ?> candidateMap = (Map<?, ?>) firstCandidate;
                            Object contentObj = candidateMap.get("content");
                            if (contentObj instanceof Map) {
                                Map<?, ?> contentMap = (Map<?, ?>) contentObj;
                                Object partsObj = contentMap.get("parts");
                                if (partsObj instanceof List) {
                                    List<?> parts = (List<?>) partsObj;
                                    if (!parts.isEmpty()) {
                                        Object firstPart = parts.get(0);
                                        if (firstPart instanceof Map) {
                                            Object textObj = ((Map<?, ?>) firstPart).get("text");
                                            if (textObj instanceof String) {
                                                return (String) textObj;
                                            } else {
                                                logger.warn("Text field is missing or not a string in first part: {}", firstPart);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            logger.warn("Could not parse AI response or empty candidates. Body: {}", body);
            return "I'm sorry, I couldn't understand that.";
        } catch (HttpClientErrorException | HttpServerErrorException e) {
            // Multi-catch example as requested
            logger.error("HTTP Error communicating with AI service: {} - {}", e.getStatusCode(), e.getResponseBodyAsString());
            return "Error from AI Provider: " + e.getStatusCode() + " - " + e.getResponseBodyAsString();
        } catch (RestClientException e) {
            logger.error("Error communicating with AI service: {}", e.getMessage());
            return "Connection Error: " + e.getMessage();
        } catch (Exception e) {
            logger.error("Unexpected error in AI Chat Service", e);
            return "An unexpected error occurred.";
        }
    }
}
