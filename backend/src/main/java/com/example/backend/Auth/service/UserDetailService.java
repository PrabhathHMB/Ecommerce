package com.example.backend.Auth.service;

import com.example.backend.Auth.model.User;
import com.example.backend.Auth.model.UserDetail;
import com.example.backend.Auth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserDetailService {

    private final UserRepository userRepository;

    @Autowired
    public UserDetailService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Retrieve user details by user ID
    public UserDetail getUserDetail(String userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        return userOptional.map(User::getUserDetail).orElse(null);
    }

    // Update user details
    public UserDetail updateUserDetail(String userId, UserDetail updatedUserDetail) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            UserDetail existingUserDetail = user.getUserDetail();

            if (existingUserDetail == null) {
                existingUserDetail = new UserDetail();
            }

            // Update only non-null fields
            if (updatedUserDetail.getFirstName() != null) {
                existingUserDetail.setFirstName(updatedUserDetail.getFirstName());
            }
            if (updatedUserDetail.getLastName() != null) {
                existingUserDetail.setLastName(updatedUserDetail.getLastName());
            }
            if (updatedUserDetail.getPhoneNo() != null) {
                existingUserDetail.setPhoneNo(updatedUserDetail.getPhoneNo());
            }
            if (updatedUserDetail.getAddresses() != null) {
                existingUserDetail.setAddresses(updatedUserDetail.getAddresses());
            }
            if (updatedUserDetail.getCardDetails() != null) {
                existingUserDetail.setCardDetails(updatedUserDetail.getCardDetails());
            }

            // Save the updated user
            user.setUserDetail(existingUserDetail);
            userRepository.save(user);

            return existingUserDetail;
        }
        return null; // Return null if user is not found
    }
}
