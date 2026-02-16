<<<<<<< HEAD
package com.example.backend.config;

import java.util.Arrays;
import java.util.Collections;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;

@Configuration
@EnableAsync
public class AppConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
            // 1. Session Management (Stateless for JWT)
            .sessionManagement(management -> management.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

            // 2. Authorization Rules
            .authorizeHttpRequests(auth -> auth
                // ALLOW PAYHERE NOTIFY URL (Must be before /api/**)
                .requestMatchers("/api/payments/notify").permitAll()
                .requestMatchers("/api/products/**").permitAll()
                .requestMatchers("/api/ai/**").permitAll()
                .requestMatchers("/api/categories/**").permitAll()
                .requestMatchers("/api/debug/**").permitAll()
                
                // Protect all other API endpoints
                .requestMatchers("/api/**").authenticated()
                
                // Allow everything else (like login/signup/home)
                .anyRequest().permitAll()
            )

            // 3. Add Custom JWT Filter
            .addFilterBefore(new JwtTokenValidator(), BasicAuthenticationFilter.class)

            // 4. Disable CSRF (Common for stateless APIs)
            .csrf(csrf -> csrf.disable())

            // 5. CORS Configuration
            .cors(cors -> cors.configurationSource(request -> {
                CorsConfiguration cfg = new CorsConfiguration();
                cfg.setAllowedOrigins(Arrays.asList(
                        "http://localhost:3000",
                        "http://localhost:4000",
                        "http://localhost:4200",
                        "https://ecommerce-angular-blue.vercel.app/",
                        "http://localhost:5173"
                ));
                // Allow all methods (GET, POST, PUT, DELETE, OPTIONS)
                cfg.setAllowedMethods(Collections.singletonList("*"));
                cfg.setAllowCredentials(true);
                cfg.setAllowedHeaders(Collections.singletonList("*"));
                cfg.setExposedHeaders(Arrays.asList("Authorization"));
                cfg.setMaxAge(3600L);
                return cfg;
            }))

            // 6. Form Login & Basic Auth (Optional for REST APIs but kept as per your request)
            .httpBasic(basic -> {})
            .formLogin(login -> {});

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

=======
package com.example.backend.config;

import java.util.Arrays;
import java.util.Collections;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;

@Configuration
@EnableAsync
public class AppConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
            // 1. Session Management (Stateless for JWT)
            .sessionManagement(management -> management.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

            // 2. Authorization Rules
            .authorizeHttpRequests(auth -> auth
                // ALLOW PAYHERE NOTIFY URL (Must be before /api/**)
                .requestMatchers("/api/payments/notify").permitAll()
                .requestMatchers("/api/products/**").permitAll()
                .requestMatchers("/api/ai/**").permitAll()
                .requestMatchers("/api/categories/**").permitAll()
                .requestMatchers("/api/debug/**").permitAll()
                
                // Protect all other API endpoints
                .requestMatchers("/api/**").authenticated()
                
                // Allow everything else (like login/signup/home)
                .anyRequest().permitAll()
            )

            // 3. Add Custom JWT Filter
            .addFilterBefore(new JwtTokenValidator(), BasicAuthenticationFilter.class)

            // 4. Disable CSRF (Common for stateless APIs)
            .csrf(csrf -> csrf.disable())

            // 5. CORS Configuration
            .cors(cors -> cors.configurationSource(request -> {
                CorsConfiguration cfg = new CorsConfiguration();
                cfg.setAllowedOrigins(Arrays.asList(
                        "http://localhost:3000",
                        "http://localhost:4000",
                        "http://localhost:4200",
                        "https://ecommerce-angular-blue.vercel.app/",
                        "http://localhost:5173"
                ));
                // Allow all methods (GET, POST, PUT, DELETE, OPTIONS)
                cfg.setAllowedMethods(Collections.singletonList("*"));
                cfg.setAllowCredentials(true);
                cfg.setAllowedHeaders(Collections.singletonList("*"));
                cfg.setExposedHeaders(Arrays.asList("Authorization"));
                cfg.setMaxAge(3600L);
                return cfg;
            }))

            // 6. Form Login & Basic Auth (Optional for REST APIs but kept as per your request)
            .httpBasic(basic -> {})
            .formLogin(login -> {});

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

>>>>>>> f3b6a345980233ed739f0533bd19c64770bd705a
}