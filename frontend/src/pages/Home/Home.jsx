import "./Home.css";
import { useEffect, useState } from "react";

function Home() {

    const [user, setUser] = useState(null);
    const [airQuality, setAirQuality] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // =====================================================
    // GET USER FROM LOCAL STORAGE
    // =====================================================

    useEffect(() => {

        const storedUser = localStorage.getItem("user");

        if (!storedUser) {
            setError("User not logged in");
            setLoading(false);
            return;
        }

        try {

            const userData = JSON.parse(storedUser);

            setUser(userData);

            getAirQuality(userData);

        } catch (error) {

            console.error("User data error:", error);

            setError("Invalid user data");

            setLoading(false);
        }

    }, []);


    // =====================================================
    // GET AIR QUALITY
    // =====================================================

    async function getAirQuality(userData) {

        try {

            /*
                If city exists:
                city + state + country

                If city doesn't exist:
                state + country

                If state doesn't exist:
                country
            */

            let location = "";

            if (userData.city) {

                location =
                    `${userData.city}, ${userData.state || ""}, ${userData.country || ""}`;

            } else if (userData.state) {

                location =
                    `${userData.state}, ${userData.country || ""}`;

            } else {

                location =
                    userData.country || "";
            }


            location = location
                .split(",")
                .map(item => item.trim())
                .filter(item => item !== "")
                .join(", ");


            if (!location) {

                setError("User location is not available");

                setLoading(false);

                return;
            }


            console.log("Searching location:", location);


            // =================================================
            // GEOAPIFY
            // =================================================

            const response = await fetch(
                `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
                    location
                )}&limit=1&format=json&apiKey=71d2fcb3d32e40aca38fd357505e2cee`
            );


            if (!response.ok) {

                throw new Error(
                    "Failed to fetch location"
                );
            }


            const data = await response.json();

            console.log("Geoapify Data:", data);


            if (
                !data.results ||
                data.results.length === 0
            ) {

                throw new Error(
                    "Location not found"
                );
            }


            // Because Home has NO location selection,
            // we automatically take the first result.

            const place = data.results[0];


            console.log(
                "Selected user location:",
                place
            );


            // =================================================
            // OPEN-METEO AIR QUALITY API
            // =================================================

            const answer = await fetch(
                `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${encodeURIComponent(
                    place.lat
                )}&longitude=${encodeURIComponent(
                    place.lon
                )}&current=us_aqi,pm2_5,pm10,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone`
            );


            if (!answer.ok) {

                throw new Error(
                    "Failed to fetch air quality"
                );
            }


            const airData = await answer.json();

            console.log(
                "Air Quality Data:",
                airData
            );


            setAirQuality(airData);

        } catch (error) {

            console.error(
                "Air Quality Error:",
                error
            );

            setError(
                "Unable to load air quality"
            );

        } finally {

            setLoading(false);
        }
    }


    // =====================================================
    // AQI STATUS
    // =====================================================

    function getAQIStatus(aqi) {

        if (aqi <= 50) {
            return "Good";
        }

        if (aqi <= 100) {
            return "Moderate";
        }

        if (aqi <= 150) {
            return "Unhealthy for Sensitive Groups";
        }

        if (aqi <= 200) {
            return "Unhealthy";
        }

        if (aqi <= 300) {
            return "Very Unhealthy";
        }

        return "Hazardous";
    }


    // =====================================================
    // AQI CLASS
    // =====================================================

    function getAQIClass(aqi) {

        if (aqi <= 50) {
            return "good";
        }

        if (aqi <= 100) {
            return "moderate";
        }

        if (aqi <= 150) {
            return "sensitive";
        }

        if (aqi <= 200) {
            return "unhealthy";
        }

        if (aqi <= 300) {
            return "very-unhealthy";
        }

        return "hazardous";
    }


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="home-loading">

                <div className="loader"></div>

                <h3>
                    Loading air quality...
                </h3>

            </div>
        );
    }


    // =====================================================
    // ERROR
    // =====================================================

    if (error) {

        return (

            <div className="home-error">

                <h2>
                    AirCare
                </h2>

                <p>
                    {error}
                </p>

            </div>
        );
    }


    // =====================================================
    // DATA
    // =====================================================

    const current = airQuality.current;


    const aqi = current.us_aqi;

    const status = getAQIStatus(aqi);

    const statusClass = getAQIClass(aqi);


    // =====================================================
    // HOME PAGE
    // =====================================================

    return (

        <div className="home-page">


            {/* =================================================
                HERO SECTION
            ================================================= */}

            <section className="home-hero">

                <div className="home-overlay"></div>


                <div className="home-content">


                    {/* ================= LEFT ================= */}

                    <div className="home-left">


                        <div className="home-badge">

                            🍃 Breathe Clean, Live Healthy

                        </div>


                        <h1>

                            Real-time Air Quality

                            <br />

                            <span>
                                Monitoring
                            </span>

                        </h1>


                        <p>

                            Track air quality and pollutant
                            levels in your location.

                            <br />

                            Stay informed. Stay healthy.

                        </p>


                        {/* LOCATION */}

                        <div className="home-location">

                            <span className="location-icon">
                                📍
                            </span>


                            <div>

                                <small>
                                    Your Location
                                </small>


                                <strong>

                                    {user.city
                                        ? user.city
                                        : user.state
                                            ? user.state
                                            : user.country
                                    }


                                </strong>


                                <p>

                                    {user.city && user.state
                                        ? `${user.state}, ${user.country}`

                                        : user.state
                                            ? user.country
                                            : ""
                                    }

                                </p>

                            </div>

                        </div>


                        {/* DATE */}

                        <div className="home-date">

                            📅

                            <span>

                                {new Date().toLocaleDateString(
                                    "en-IN",
                                    {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric"
                                    }
                                )}

                            </span>

                        </div>

                    </div>


                    {/* ================= RIGHT ================= */}

                    <div className="home-right">


                        {/* AQI */}

                        <div
                            className={`aqi-circle ${statusClass}`}
                        >

                            <div className="aqi-inner">

                                <span className="aqi-title">
                                    AQI
                                </span>


                                <strong>
                                    {aqi}
                                </strong>


                                <span className="aqi-status">
                                    {status}
                                </span>

                            </div>

                        </div>


                    </div>

                </div>

            </section>



            {/* =================================================
                POLLUTANTS
            ================================================= */}

            <section className="pollutants">


                <PollutantCard
                    icon="🔵"
                    name="PM2.5"
                    value={current.pm2_5}
                    unit="μg/m³"
                />


                <PollutantCard
                    icon="🟠"
                    name="PM10"
                    value={current.pm10}
                    unit="μg/m³"
                />


                <PollutantCard
                    icon="🟢"
                    name="CO"
                    value={current.carbon_monoxide}
                    unit="μg/m³"
                />


                <PollutantCard
                    icon="🟣"
                    name="NO₂"
                    value={current.nitrogen_dioxide}
                    unit="μg/m³"
                />


                <PollutantCard
                    icon="🟡"
                    name="SO₂"
                    value={current.sulphur_dioxide}
                    unit="μg/m³"
                />


                <PollutantCard
                    icon="🔵"
                    name="O₃"
                    value={current.ozone}
                    unit="μg/m³"
                />


            </section>



            {/* =================================================
                CURRENT AIR QUALITY
            ================================================= */}

            <section className="quality-section">


                <div className="quality-header">

                    <div>

                        <h2>
                            Current Air Quality
                        </h2>

                        <p>
                            {user.city || user.state || user.country}
                        </p>

                    </div>


                    <div
                        className={`quality-status ${statusClass}`}
                    >

                        ● {status}

                    </div>

                </div>


                <div className="quality-grid">


                    <div className="quality-item">

                        <span>
                            AQI
                        </span>

                        <strong>
                            {current.us_aqi}
                        </strong>

                    </div>


                    <div className="quality-item">

                        <span>
                            PM2.5
                        </span>

                        <strong>
                            {current.pm2_5}
                        </strong>

                    </div>


                    <div className="quality-item">

                        <span>
                            PM10
                        </span>

                        <strong>
                            {current.pm10}
                        </strong>

                    </div>


                    <div className="quality-item">

                        <span>
                            CO
                        </span>

                        <strong>
                            {current.carbon_monoxide}
                        </strong>

                    </div>


                    <div className="quality-item">

                        <span>
                            NO₂
                        </span>

                        <strong>
                            {current.nitrogen_dioxide}
                        </strong>

                    </div>


                    <div className="quality-item">

                        <span>
                            SO₂
                        </span>

                        <strong>
                            {current.sulphur_dioxide}
                        </strong>

                    </div>


                    <div className="quality-item">

                        <span>
                            O₃
                        </span>

                        <strong>
                            {current.ozone}
                        </strong>

                    </div>


                </div>

            </section>

        </div>
    );
}


/* =========================================================
   POLLUTANT CARD
========================================================= */

function PollutantCard({
    icon,
    name,
    value,
    unit
}) {

    return (

        <div className="pollutant-card">


            <div className="pollutant-icon">

                {icon}

            </div>


            <div>

                <h3>
                    {name}
                </h3>


                <div className="pollutant-value">

                    <strong>
                        {value}
                    </strong>

                    <span>
                        {unit}
                    </span>

                </div>


                <small>
                    Current level
                </small>

            </div>


        </div>
    );
}


export default Home;