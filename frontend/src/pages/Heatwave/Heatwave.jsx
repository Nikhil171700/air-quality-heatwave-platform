import { useState } from "react";
import "./Heatwave.css";

function Heatwave() {
    const [search, setSearch] = useState("");
    const [places, setPlaces] = useState([]);
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [weather, setWeather] = useState(null);

    const [loadingSearch, setLoadingSearch] = useState(false);
    const [loadingWeather, setLoadingWeather] = useState(false);
    const [error, setError] = useState("");

    // Search country / state / city
    const searchLocation = async (e) => {
        e.preventDefault();

        if (!search.trim()) {
            setError("Please enter a location.");
            return;
        }

        setLoadingSearch(true);
        setError("");
        setPlaces([]);
        setWeather(null);
        setSelectedPlace(null);

        try {
            const url =
                `https://geocoding-api.open-meteo.com/v1/search?` +
                `name=${encodeURIComponent(search.trim())}` +
                `&count=5&language=en&format=json`;

            const response = await fetch(url);
            const data = await response.json();

            if (!data.results || data.results.length === 0) {
                setError("Location not found.");
                return;
            }

            setPlaces(data.results);
        } catch (error) {
            setError("Unable to search location.");
        } finally {
            setLoadingSearch(false);
        }
    };

    // Get weather for selected location
    const getWeather = async (place) => {
        setSelectedPlace(place);
        setPlaces([]);
        setLoadingWeather(true);
        setError("");

        try {
            const url =
                `https://api.open-meteo.com/v1/forecast?` +
                `latitude=${place.latitude}` +
                `&longitude=${place.longitude}` +
                `&current=temperature_2m,apparent_temperature` +
                `&daily=temperature_2m_max,temperature_2m_min` +
                `&forecast_days=7` +
                `&timezone=auto`;

            const response = await fetch(url);
            const data = await response.json();

            if (!response.ok) {
                throw new Error("Weather API error");
            }

            setWeather(data);
        } catch (error) {
            setError("Unable to load weather data.");
        } finally {
            setLoadingWeather(false);
        }
    };

    // Heat-wave calculation
    const getHeatStatus = () => {
        if (!weather) return null;

        const temperatures = weather.daily.temperature_2m_max;

        let consecutiveDays = 0;
        let maximumConsecutiveDays = 0;

        temperatures.forEach((temperature) => {
            if (temperature >= 40) {
                consecutiveDays++;
                maximumConsecutiveDays = Math.max(
                    maximumConsecutiveDays,
                    consecutiveDays
                );
            } else {
                consecutiveDays = 0;
            }
        });

        if (maximumConsecutiveDays >= 3) {
            return {
                text: "Heat Wave Condition",
                className: "heat-danger",
                message: "3 or more days are expected to reach 40°C or above."
            };
        }

        if (temperatures[0] >= 40) {
            return {
                text: "Extreme Heat",
                className: "heat-danger",
                message: "Today's maximum temperature is 40°C or above."
            };
        }

        if (temperatures[0] >= 38) {
            return {
                text: "High Heat",
                className: "heat-warning",
                message: "Today's maximum temperature is 38°C or above."
            };
        }

        return {
            text: "No Heat Wave Condition",
            className: "heat-safe",
            message: "No heat-wave condition detected using the project rule."
        };
    };

    const heatStatus = getHeatStatus();

    return (
        <div className="heatwave-container">

            <h2>Heat Wave Monitoring</h2>

            <p className="heatwave-subtitle">
                Search for a country, state or city to check temperature
                and heat-wave conditions.
            </p>

            {/* Search */}
            <form className="heatwave-search" onSubmit={searchLocation}>
                <input
                    type="text"
                    placeholder="Search country, state or city..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <button type="submit">
                    {loadingSearch ? "Searching..." : "Search"}
                </button>
            </form>

            {/* Error */}
            {error && (
                <p className="heatwave-error">
                    {error}
                </p>
            )}

            {/* Location Results */}
            {places.length > 0 && (
                <div className="location-results">

                    <h3>Select Location</h3>

                    {places.map((place, index) => (
                        <div
                            className="location-card"
                            key={`${place.id}-${index}`}
                            onClick={() => getWeather(place)}
                        >
                            <strong>{place.name}</strong>

                            <span>
                                {place.admin1
                                    ? `${place.admin1}, `
                                    : ""}
                                {place.country}
                            </span>

                            <small>
                                Latitude: {place.latitude.toFixed(2)} |
                                Longitude: {place.longitude.toFixed(2)}
                            </small>
                        </div>
                    ))}

                </div>
            )}

            {/* Loading Weather */}
            {loadingWeather && (
                <p className="loading-text">
                    Loading weather data...
                </p>
            )}

            {/* Weather Data */}
            {weather && selectedPlace && (
                <div className="weather-section">

                    <div className="location-heading">
                        <h3>
                            {selectedPlace.name}
                        </h3>

                        <p>
                            {selectedPlace.admin1
                                ? `${selectedPlace.admin1}, `
                                : ""}
                            {selectedPlace.country}
                        </p>
                    </div>

                    {/* Current Temperature */}
                    <div className="temperature-card">

                        <div>
                            <span className="temperature-label">
                                Current Temperature
                            </span>

                            <h1>
                                {weather.current.temperature_2m}°C
                            </h1>
                        </div>

                        <div>
                            <span className="temperature-label">
                                Feels Like
                            </span>

                            <h2>
                                {weather.current.apparent_temperature}°C
                            </h2>
                        </div>

                    </div>

                    {/* Heat Status */}
                    <div className={`heat-status ${heatStatus.className}`}>

                        <h3>
                            {heatStatus.text}
                        </h3>

                        <p>
                            {heatStatus.message}
                        </p>

                    </div>

                    {/* 7 Day Forecast */}
                    <div className="forecast-section">

                        <h3>7-Day Temperature Forecast</h3>

                        <div className="forecast-container">

                            {weather.daily.time.map((date, index) => (
                                <div
                                    className="forecast-card"
                                    key={date}
                                >
                                    <strong>
                                        {new Date(date).toLocaleDateString(
                                            "en-IN",
                                            {
                                                weekday: "short",
                                                day: "numeric",
                                                month: "short"
                                            }
                                        )}
                                    </strong>

                                    <p className="max-temp">
                                        ↑ {weather.daily.temperature_2m_max[index]}°C
                                    </p>

                                    <p className="min-temp">
                                        ↓ {weather.daily.temperature_2m_min[index]}°C
                                    </p>
                                </div>
                            ))}

                        </div>

                    </div>

                    {/* Health Suggestions */}


                </div>
            )}

        </div>
    );
}

export default Heatwave;