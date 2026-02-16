package com.example.backend.modal;

import com.example.backend.user.domain.PaymentMethod;
import com.example.backend.user.domain.PaymentStatus;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentDetails {
	
	private PaymentMethod paymentMethod;
	private PaymentStatus status;
	private String paymentId;
	private String PayHerePaymentLinkId;
	private String PayHerePaymentLinkReferenceId;
	private String PayHerePaymentLinkStatus;
	private String PayHerePaymentId;

}

