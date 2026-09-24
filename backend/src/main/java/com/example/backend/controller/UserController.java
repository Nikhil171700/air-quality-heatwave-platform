package com.example.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.dto.LoginRequest;
import com.example.backend.dto.LoginResponse;
import com.example.backend.model.User;
import com.example.backend.service.UserService;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired
    private UserService userService;

    // Register
    @PostMapping("/register")
    public User registerUser(@RequestBody User user) {
        return userService.registerUser(user);
    }

    // Login
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest request) {

        try {

            User loggedUser = userService.loginUser(
                    request.getEmail(),
                    request.getPassword()
            );

            LoginResponse response = new LoginResponse(
                    loggedUser.getUsername(),
                    loggedUser.getEmail(),
                    loggedUser.getCountry(),
                    loggedUser.getState(),
                    loggedUser.getCity()
            );

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {

            if ("EMAIL_NOT_FOUND".equals(e.getMessage())) {
                return ResponseEntity
                        .status(404)
                        .body("EMAIL_NOT_FOUND");
            }

            if ("WRONG_PASSWORD".equals(e.getMessage())) {
                return ResponseEntity
                        .status(401)
                        .body("WRONG_PASSWORD");
            }

            return ResponseEntity
                    .status(500)
                    .body("SERVER_ERROR");
        }
    }
}