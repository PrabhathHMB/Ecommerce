package com.example.backend.Auth.Controller;

import com.example.backend.Auth.model.UserDetail;
import com.example.backend.Auth.service.UserDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.backend.Auth.UtilSecurity.SecurityUtil;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/users/details")
public class UserDetailController {

    private final UserDetailService userDetailService;

    @Autowired
    public UserDetailController(UserDetailService userDetailService) {
        this.userDetailService = userDetailService;
    }

    // Endpoint to retrieve user details by ID
    @GetMapping()
    public UserDetail getUserDetails() {
        String userId = SecurityUtil.getCurrentUserId(); // Fetch user ID dynamically from SecurityContext
        return userDetailService.getUserDetail(userId);
    }

    // Endpoint to update user details
    @PutMapping()
    public UserDetail updateUserDetails(@RequestBody UserDetail partialUserDetail) {
        String userId = SecurityUtil.getCurrentUserId(); // Fetch user ID dynamically from SecurityContext
        return userDetailService.updateUserDetail(userId, partialUserDetail);
    }
    

}
