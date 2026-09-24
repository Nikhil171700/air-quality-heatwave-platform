package com.example.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.model.User;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

}

/*
Optional<User> findByEmail(String email);

→ Allows us to search the database for a user using their email during login.

So now your backend structure is:
In our case:

Optional<User> findByEmail(String email);

means:

"Search for a user with this email. There may be a user, or there may be no user."

Without Optional

We could write:

User findByEmail(String email);

If the email doesn't exist, the result can be null.

Then we might accidentally do something with null and get a NullPointerException.

With Optional
Optional<User> findByEmail(String email);

It gives us a container that can be:

User found
   ↓
Optional contains User

User not found
   ↓
Optional is empty
*/