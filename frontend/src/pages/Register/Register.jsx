import { useState } from "react";
import Select from "react-select";
import { Country, State, City } from "country-state-city";
import "./Register.css";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =========================
  // COUNTRIES
  // =========================

  // const countryOptions = Country.getAllCountries().map((country) => ({
  //   value: country.isoCode,
  //   label: `${country.flag} ${country.name}`,
  // }));
const countryOptions = Country.getAllCountries().map((country) => ({
  value: country.isoCode,
  label: country.name,
}));
  // =========================
  // STATES
  // =========================

  const stateOptions = selectedCountry
    ? State.getStatesOfCountry(selectedCountry.value).map((state) => ({
        value: state.isoCode,
        label: state.name,
      }))
    : [];

  // =========================
  // CITIES
  // =========================

  const cityOptions =
    selectedCountry && selectedState
      ? City.getCitiesOfState(
          selectedCountry.value,
          selectedState.value
        ).map((city) => ({
          value: city.name,
          label: city.name,
        }))
      : [];

  // =========================
  // COUNTRY CHANGE
  // =========================

  const handleCountryChange = (selectedOption) => {
    setSelectedCountry(selectedOption);
    setSelectedState(null);
    setSelectedCity(null);
    setError("");
    setSuccess("");
  };

  // =========================
  // STATE CHANGE
  // =========================

  const handleStateChange = (selectedOption) => {
    setSelectedState(selectedOption);
    setSelectedCity(null);
    setError("");
    setSuccess("");
  };

  // =========================
  // CITY CHANGE
  // =========================

  const handleCityChange = (selectedOption) => {
    setSelectedCity(selectedOption);
    setError("");
    setSuccess("");
  };

  // =========================
  // REGISTER
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // Check password
    if (password !== confirmPassword) {
      setError("Password and Confirm Password do not match.");
      return;
    }

    // Check location
    if (!selectedCountry || !selectedState || !selectedCity) {
      setError("Please select your country, state, and city.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8080/api/users/register",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            username: username,
            email: email,
            password: password,
            country: selectedCountry.label,
            state: selectedState.label,
            city: selectedCity.label,
          }),
        }
      );

      // Get response from backend
      const data = await response.text();

      // Backend returned error
      if (!response.ok) {
        setError(data || "Registration failed.");
        return;
      }

      // Registration successful
      console.log("Registration successful:", data);

      setSuccess("Registration successful!");

      // Clear form
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setSelectedCountry(null);
      setSelectedState(null);
      setSelectedCity(null);

      // Go to login after 1.5 seconds
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);

    } catch (error) {
      console.error("Registration error:", error);

      setError(
        "Unable to connect to server. Please make sure Spring Boot is running."
      );
    }
  };

  return (
    <div className="register-page">

      <div className="register">

        <h2>Create Account</h2>

        <p className="register-subtitle">
          Register to access the Air Quality Dashboard
        </p>

        <form
          className="register-form"
          onSubmit={handleSubmit}
        >

          <div className="register-input">

            {/* =========================
                USERNAME
            ========================= */}

            <label htmlFor="username">
              Username
            </label>

            <input
              type="text"
              id="username"
              placeholder="Enter your name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            {/* =========================
                EMAIL
            ========================= */}

            <label htmlFor="email">
              Email
            </label>

            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {/* =========================
                PASSWORD
            ========================= */}

            <label htmlFor="password">
              Password
            </label>

            <input
              type="password"
              id="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={
                error && password !== confirmPassword
                  ? "input-error"
                  : ""
              }
              required
            />

            {/* =========================
                CONFIRM PASSWORD
            ========================= */}

            <label htmlFor="confirmPassword">
              Confirm Password
            </label>

            <input
              type="password"
              id="confirmPassword"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
              className={
                error && password !== confirmPassword
                  ? "input-error"
                  : ""
              }
              required
            />

            {/* =========================
                COUNTRY
            ========================= */}

            <label>
              Country
            </label>

            <Select
              options={countryOptions}
              value={selectedCountry}
              onChange={handleCountryChange}
              placeholder="Search country..."
              isSearchable
              isClearable
              classNamePrefix="location-select"
            />

            {/* =========================
                STATE
            ========================= */}

            <label>
              State
            </label>

            <Select
              options={stateOptions}
              value={selectedState}
              onChange={handleStateChange}
              placeholder={
                selectedCountry
                  ? "Search state..."
                  : "Select country first"
              }
              isSearchable
              isClearable
              isDisabled={!selectedCountry}
              classNamePrefix="location-select"
            />

            {/* =========================
                CITY
            ========================= */}

            <label>
              City
            </label>

            <Select
              options={cityOptions}
              value={selectedCity}
              onChange={handleCityChange}
              placeholder={
                selectedState
                  ? "Search city..."
                  : "Select state first"
              }
              isSearchable
              isClearable
              isDisabled={!selectedState}
              classNamePrefix="location-select"
            />

          </div>

          {/* =========================
              ERROR
          ========================= */}

          {error && (
            <p className="register-error">
              ⚠ {error}
            </p>
          )}

          {/* =========================
              SUCCESS
          ========================= */}

          {success && (
            <p className="register-success">
              ✓ {success}
            </p>
          )}

          {/* =========================
              REGISTER BUTTON
          ========================= */}

          <button
            type="submit"
            className="register-btn"
          >
            Register
          </button>

        </form>

      </div>

    </div>
  );
}

export default Register;