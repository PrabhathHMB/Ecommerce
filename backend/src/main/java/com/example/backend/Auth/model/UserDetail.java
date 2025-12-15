package com.example.backend.Auth.model;

//import com.example.backend.Auth.model.BillingAddress;
//import com.example.backend.Auth.model.CardDetails;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

//import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString

public class UserDetail {
     private String firstName;
    private String lastName;
    private String phoneNo;
    private List<BillingAddress> addresses;
    private List<CardDetails> cardDetails;

}
