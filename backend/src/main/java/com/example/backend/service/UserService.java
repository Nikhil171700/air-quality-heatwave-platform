package com.example.backend.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // Register user
    public User registerUser(User user) {
        return userRepository.save(user);
    }

    // Login user
    public User loginUser(String email, String password) {

        Optional<User> user = userRepository.findByEmail(email);

        if (user.isEmpty()) {
            throw new RuntimeException("EMAIL_NOT_FOUND");
        }

        if (!user.get().getPassword().equals(password)) {
            throw new RuntimeException("WRONG_PASSWORD");
        }

        return user.get();
    }
}
/*
   @Autowired
    private UserRepository userRepository;

It tells Spring:

"Find the required object and automatically give it to me."

We will use it to connect UserService with UserRepositor

Meaning:

React registration data → UserService → UserRepository → MySQL

userRepository.save(user) tells Spring Data JPA to save the user into the database.
 */