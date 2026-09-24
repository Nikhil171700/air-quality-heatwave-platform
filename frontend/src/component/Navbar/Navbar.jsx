import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
    return (
        <nav className="navbar">

            <div className="logo">
                <div className="logo-icon">🍃</div>

                <div>
                    <h2>AirCare</h2>
                    <p>AI Monitoring System</p>
                </div>
            </div>

            <div className="nav-links">

                <Link to="/">Home</Link>

                <Link to="/dashboard">
                    Air Quality
                </Link>

                {/* <Link to="/airquality">
                    Air Quality
                </Link> */}

                <Link to="/heatwave">
                    Heat Wave
                </Link>

                {/* <Link to="/ranking">
                    Ranking
                </Link>

                <Link to="/prediction">
                    Prediction
                </Link> */}

                <Link to="/profile">
                    Profile
                </Link>

            </div>

            <div className="nav-right">

                <button className="theme-btn">
                    ☀
                </button>

                <Link to="/login" className="login-btn">
                    Login
                </Link>

            </div>

        </nav>
    );
}

export default Navbar;