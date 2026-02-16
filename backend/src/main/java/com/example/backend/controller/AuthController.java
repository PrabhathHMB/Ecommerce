package com.example.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.config.JwtTokenProvider;
import com.example.backend.exception.UserException;
import com.example.backend.modal.User;
import com.example.backend.repository.UserRepository;
import com.example.backend.request.LoginRequest;
import com.example.backend.responce.AuthResponse;
import com.example.backend.service.CartService;
import com.example.backend.service.CustomUserDetails;
import com.example.backend.service.EmailService;

import com.example.backend.request.ForgotPasswordRequest;
import com.example.backend.request.VerifyOtpRequest;
import com.example.backend.request.ResetPasswordRequest;
import java.time.LocalDateTime;
import java.util.Random;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth")
public class AuthController {

	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;
	private final JwtTokenProvider jwtTokenProvider;
	private final CustomUserDetails customUserDetails;
	private final CartService cartService;
	private final EmailService emailService;
	
	public AuthController(UserRepository userRepository,PasswordEncoder passwordEncoder,JwtTokenProvider jwtTokenProvider,CustomUserDetails customUserDetails,CartService cartService, EmailService emailService) {
		this.userRepository=userRepository;
		this.passwordEncoder=passwordEncoder;
		this.jwtTokenProvider=jwtTokenProvider;
		this.customUserDetails=customUserDetails;
		this.cartService=cartService;
		this.emailService=emailService;
	}
	
	@PostMapping("/signup")
	public ResponseEntity<AuthResponse> createUserHandler(@Valid @RequestBody User user) throws UserException{
		
		  	String email = user.getEmail();
	        String password = user.getPassword();
	        String firstName=user.getFirstName();
	        String lastName=user.getLastName();
	        String role=user.getRole();
	        
	        User isEmailExist=userRepository.findByEmail(email);

	        // Check if user with the given email already exists
	        if (isEmailExist!=null) {
	        	
	            throw new UserException("Email Is Already Used With Another Account");
	        }

	        // Create new user
			User createdUser= new User();
			createdUser.setEmail(email);
			createdUser.setFirstName(firstName);
			createdUser.setLastName(lastName);
	        createdUser.setPassword(passwordEncoder.encode(password));
	        createdUser.setRole(role);
	        
	        User savedUser= userRepository.save(createdUser);
	        
	        cartService.createCart(savedUser);

	        Authentication authentication = new UsernamePasswordAuthenticationToken(email, password);
	        SecurityContextHolder.getContext().setAuthentication(authentication);
	        
	        String token = jwtTokenProvider.generateToken(authentication);

	        AuthResponse authResponse= new AuthResponse(token,true);
			
	        return new ResponseEntity<AuthResponse>(authResponse,HttpStatus.OK);
		
	}
	
	@PostMapping("/signin")
    public ResponseEntity<AuthResponse> signin(@RequestBody LoginRequest loginRequest) {
        String username = loginRequest.getEmail();
        String password = loginRequest.getPassword();
        
        System.out.println(username +" ----- "+password);
        
        Authentication authentication = authenticate(username, password);
        SecurityContextHolder.getContext().setAuthentication(authentication);
        
        
        String token = jwtTokenProvider.generateToken(authentication);
        AuthResponse authResponse= new AuthResponse();
		
		authResponse.setStatus(true);
		authResponse.setJwt(token);
		
        return new ResponseEntity<AuthResponse>(authResponse,HttpStatus.OK);
    }
	
	private Authentication authenticate(String username, String password) {
        UserDetails userDetails = customUserDetails.loadUserByUsername(username);
        
        System.out.println("sign in userDetails - "+userDetails);
        
        if (userDetails == null) {
        	System.out.println("sign in userDetails - null " + userDetails);
            throw new BadCredentialsException("Invalid username or password");
        }
        if (!passwordEncoder.matches(password, userDetails.getPassword())) {
        	System.out.println("sign in userDetails - password not match " + userDetails);
            throw new BadCredentialsException("Invalid username or password");
        }
        return new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
    }
    @PostMapping("/google")
    public ResponseEntity<AuthResponse> googleLogin(@RequestBody com.example.backend.request.GoogleLoginRequest loginRequest) {
        String token = loginRequest.getToken();
        System.out.println("Backend: Google login request received. Token length: " + (token != null ? token.length() : "null"));
        
        // Verify token with Google
        org.springframework.web.client.RestTemplate restTemplate = new  org.springframework.web.client.RestTemplate();
        String url = "https://oauth2.googleapis.com/tokeninfo?id_token=" + token;
        System.out.println("Backend: Verifying token with URL: " + url);
        java.util.Map<String, Object> googleUser = null;
        
        try {
            googleUser = restTemplate.getForObject(url,  java.util.Map.class);
        } catch (Exception e) {
             System.out.println("Backend: Failed to verify token with Google: " + e.getMessage());
             throw new BadCredentialsException("Invalid Google Token");
        }
        
        System.out.println("Backend: Google response: " + googleUser);

        if (googleUser == null || googleUser.containsKey("error")) {
            System.out.println("Backend: Google user is null or has error");
            throw new BadCredentialsException("Invalid Google Token");
        }

        String email = (String) googleUser.get("email");
        String firstName = (String) googleUser.get("given_name");
        String lastName = (String) googleUser.get("family_name");
        System.out.println("Backend: Extracted user info - Email: " + email);
        
        // Check if user exists
        User user = userRepository.findByEmail(email);

        if (user == null) {
            System.out.println("Backend: User not found, creating new user.");
            // Create new user
            user = new User();
            user.setEmail(email);
            user.setFirstName(firstName);
            user.setLastName(lastName);
            user.setRole("ROLE_CUSTOMER"); // Default role
            // Generate a random password since they login with Google
            user.setPassword(passwordEncoder.encode(java.util.UUID.randomUUID().toString()));
            
            user = userRepository.save(user);
            cartService.createCart(user);
        } else {
            System.out.println("Backend: User found.");
        }

        // Authenticate (create a token for our system)
        // Note: We're not doing standard auth manager check because we trust the Google token
        // Instead, we just generate our JWT for this user
        
        Authentication authentication = new UsernamePasswordAuthenticationToken(user.getEmail(), null, 
            java.util.Collections.singletonList(new org.springframework.security.core.authority.SimpleGrantedAuthority(user.getRole())));
        
        String jwt = jwtTokenProvider.generateToken(authentication);
        System.out.println("Backend: JWT generated successfully.");

        AuthResponse authResponse = new AuthResponse();
        authResponse.setJwt(jwt);
        authResponse.setStatus(true);

        return new ResponseEntity<>(authResponse, HttpStatus.OK);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<AuthResponse> forgotPassword(@RequestBody ForgotPasswordRequest req) throws UserException {
        String email = req.getEmail();
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new UserException("User not found with email " + email);
        }

        // Generate OTP
        String otp = String.format("%06d", new Random().nextInt(999999));
        user.setOtp(otp);
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(10));
        userRepository.save(user);

        // Send Email
        emailService.sendForgotPasswordEmail(email, otp);

        AuthResponse res = new AuthResponse();
        res.setMessage("OTP sent to your email");
        res.setStatus(true);
        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<AuthResponse> verifyOtp(@RequestBody VerifyOtpRequest req) throws UserException {
        String email = req.getEmail();
        String otp = req.getOtp();
        
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new UserException("User not found");
        }

        if (user.getOtp() == null || !user.getOtp().equals(otp)) {
             throw new UserException("Invalid OTP");
        }

        if (user.getOtpExpiry().isBefore(LocalDateTime.now())) {
            throw new UserException("OTP Expired");
        }

        AuthResponse res = new AuthResponse();
        res.setMessage("OTP Verified Successfully");
        res.setStatus(true);
        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<AuthResponse> resetPassword(@RequestBody ResetPasswordRequest req) throws UserException {
        String email = req.getEmail();
        String otp = req.getOtp();
        String newPassword = req.getPassword();

        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new UserException("User not found");
        }

        if (user.getOtp() == null || !user.getOtp().equals(otp)) {
             throw new UserException("Invalid OTP");
        }

        if (user.getOtpExpiry().isBefore(LocalDateTime.now())) {
            throw new UserException("OTP Expired");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setOtp(null);
        user.setOtpExpiry(null);
        userRepository.save(user);

        AuthResponse res = new AuthResponse();
        res.setMessage("Password Reset Successfully");
        res.setStatus(true);
        return new ResponseEntity<>(res, HttpStatus.OK);
    }

}
