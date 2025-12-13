package com.example.backend.Auth.config;

import com.example.backend.Auth.security.JwtAuthenticationFilter;
import com.example.backend.Auth.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import com.example.backend.Auth.service.UserService;
import com.example.backend.Auth.model.User;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;


import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;

@Configuration
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http    .cors()
                .and()
                .csrf(csrf -> csrf.disable()) // Disable CSRF for stateless APIs
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**", "/oauth2/**","/api/products/**","/api/reviews/**").permitAll() // Public endpoints
                        .requestMatchers("/api/**").authenticated() // Protected endpoints
                        .requestMatchers("/admin/**").hasRole("ADMIN") // Admin routes
                        .requestMatchers("/user/**").hasAnyRole("USER", "ADMIN") // User routes
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class) // Add custom JWT
                                                                                                      // filter
                .oauth2Login(oauth2 -> oauth2
                        .successHandler((request, response, authentication) -> {
                            try {

                                OAuth2User oauthUser = (OAuth2User) authentication.getPrincipal();
                                System.out.println("OAuth2 Success: " + oauthUser.getAttributes());
                                String email = oauthUser.getAttribute("email");

                                // Use UserService to handle OAuth registration or lookup
                                User user = userService.registerOrFindUserWithOAuth(email, oauthUser.getAttributes());

                                // Generate JWT with user details
                                String jwt = jwtUtil.generateToken(user.getId(), user.getEmail(), user.getRole());

                                // Create a secure, HttpOnly cookie to store the JWT
                                Cookie jwtCookie = new Cookie("jwt", jwt);
                                jwtCookie.setHttpOnly(true);
                                jwtCookie.setSecure(false); // 
                                jwtCookie.setPath("/");
                                jwtCookie.setMaxAge(60 * 60);

                                // Add the cookie to the response
                                response.addCookie(jwtCookie);

                                // Redirect to the frontend
                                response.sendRedirect("http://localhost:5173");
                            } catch (Exception e) {
                                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                            }
                        }));

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
