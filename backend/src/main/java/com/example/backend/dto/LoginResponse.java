package com.example.backend.dto;

public class LoginResponse {

    private String username;
    private String email;
    private String country;
    private String state;
    private String city;

    public LoginResponse() {
    }

    public LoginResponse(
            String username,
            String email,
            String country,
            String state,
            String city) {

        this.username = username;
        this.email = email;
        this.country = country;
        this.state = state;
        this.city = city;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }
}