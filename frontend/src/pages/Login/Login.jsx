import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleLogin = async () => {

        setMessage("");

        try {

            const response = await fetch(
                "http://localhost:8080/api/users/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                }
            );

            if (response.ok) {

                const user = await response.json();

                console.log("Logged in user:", user);

                // Store user information
                localStorage.setItem(
                    "user",
                    JSON.stringify(user)
                );

                // Go to Home
                navigate("/");

            } else {

                const error = await response.text();

                if (error === "EMAIL_NOT_FOUND") {

                    setMessage("Email is not registered");

                } else if (error === "WRONG_PASSWORD") {

                    setMessage("Password incorrect");

                } else {

                    setMessage("Something went wrong");
                }
            }

        } catch (error) {

            console.error(error);

            setMessage("Unable to connect to server");
        }
    };

    return (
        <div className="login-page">

            <div className="login">

                <h2>Login</h2>

                <div className="input-group">
                    <label>Email</label>

                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="input-group">
                    <label>Password</label>

                    <input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <button
                    className="login-submit"
                    onClick={handleLogin}
                >
                    Login
                </button>

                {message && (
                    <p>{message}</p>
                )}

                <h4 className="account">
                    Dont have an account?
                </h4>

                <Link to="/register">
                    sign up
                </Link>

            </div>

        </div>
    );
}

export default Login;