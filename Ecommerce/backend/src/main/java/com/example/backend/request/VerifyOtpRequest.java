package com.example.backend.request;

import lombok.Data;

@Data
public class VerifyOtpRequest {
    private String email;
    private String otp;
}
