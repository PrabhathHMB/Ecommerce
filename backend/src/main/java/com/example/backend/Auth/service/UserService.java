package com.example.backend.Auth.service;

import com.example.backend.Auth.model.User;
import com.example.backend.Auth.model.UserDetail;
import com.example.backend.Auth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.security.access.AccessDeniedException;

import com.example.backend.Auth.UtilSecurity.SecurityUtil;
//import com.example.backend.Auth.UtilSecurity.SecurityUtil.*;
import java.util.Optional;
import java.util.Map;
import com.example.backend.Auth.Enums.Role;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Authenticate a user by email and raw password.
     * 
     * @param email       the email of the user
     * @param rawPassword the raw password to validate
     * @return an Optional containing the authenticated user, or empty if
     *         authentication fails
     */
    public Optional<User> authenticateUser(String email, String rawPassword) {
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isPresent() && passwordEncoder.matches(rawPassword, user.get().getPassword())) {
            return user;
        }
        return Optional.empty();
    }

    /**
     * Register a new user.
     * 
     * @param user the user to register
     * @return true if the registration is successful, false if the email already
     *         exists
     */
    public boolean registerUser(User user) {
        // Check if the email is already in use
        if (userRepository.existsByEmail(user.getEmail())) {
            return false; // Email already exists
        }

        // Hash the password before saving the user
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole(Role.USER); // Default role for new users

        if (user.getUserDetail() == null) {
            user.setUserDetail(new UserDetail());
        }
        // Save the new user to the database
        userRepository.save(user);
        return true;
    }

    /**
     * Find a user by email.
     * 
     * @param email the email of the user
     * @return an Optional containing the user, or empty if the user is not found
     */
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    // For OAuth registration

    /**
     * Register or find a user using OAuth2 details.
     * 
     * @param email      the email from OAuth2
     * @param attributes additional attributes from OAuth2 (e.g., name, picture)
     * @return the registered or existing user
     */
    public User registerOrFindUserWithOAuth(String email, Map<String, Object> attributes) {
        // Check if the user already exists by email
        Optional<User> existingUser = userRepository.findByEmail(email);
        if (existingUser.isPresent()) {
            return existingUser.get(); // Return the existing user
        }

        

        // Create a new user for OAuth
        User newUser = new User();
        newUser.setEmail(email);
        newUser.setRole(Role.USER);// Default role for OAuth2 users
        newUser.setPassword(""); // No password as it’s OAuth2

        if (newUser.getUserDetail() == null) {
            newUser.setUserDetail(new UserDetail());
        }
        // Save the new user to the database
        return userRepository.save(newUser);
    }

    public User assignRoleToUser(String userId, Role role) {
        // Ensure only admin can assign roles
        if (SecurityUtil.currentUserHasRole(Role.ADMIN)) {
            // Fetch the user by ID
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Set the new role
            user.setRole(role);

            // Save and return the updated user
            return userRepository.save(user);
        } else {
            // If the current user is not an admin, throw an exception
            throw new AccessDeniedException("You are not authorized to assign roles.");
        }
    }

}

