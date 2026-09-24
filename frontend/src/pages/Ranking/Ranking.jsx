import { useEffect, useState } from "react";
import "./Ranking.css";

function Ranking() {

    const [ranking, setRanking] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const API_KEY = import.meta.env.VITE_IQAIR_API_KEY;

    const cities = [
        {
            city: "Hyderabad",
            state: "Telangana",
            country: "India"
        },
        {
            city: "Delhi",
            state: "Delhi",
            country: "India"
        },
        {
            city: "Mumbai",
            state: "Maharashtra",
            country: "India"
        },
        {
            city: "Bengaluru",
            state: "Karnataka",
            country: "India"
        },
        {
            city: "Chennai",
            state: "Tamil Nadu",
            country: "India"
        }
    ];

    useEffect(() => {

        const fetchAQI = async () => {

            try {

                const results = [];

                for (const location of cities) {

                    const url =
                        `https://api.airvisual.com/v2/city` +
                        `?city=${encodeURIComponent(location.city)}` +
                        `&state=${encodeURIComponent(location.state)}` +
                        `&country=${encodeURIComponent(location.country)}` +
                        `&key=${API_KEY}`;

                    const response = await fetch(url);
                    const data = await response.json();

                    if (data.status === "success") {

                        results.push({
                            city: location.city,
                            state: location.state,
                            country: location.country,
                            aqi: data.data.current.pollution.aqius
                        });
                    }
                }

                // Highest AQI first
                results.sort((a, b) => b.aqi - a.aqi);

                setRanking(results);
                setLoading(false);

            } catch (err) {

                console.error(err);
                setError("Unable to fetch AQI data");
                setLoading(false);
            }
        };

        fetchAQI();

    }, []);

    const getStatus = (aqi) => {

        if (aqi <= 50)
            return "Good";

        if (aqi <= 100)
            return "Moderate";

        if (aqi <= 150)
            return "Unhealthy for Sensitive Groups";

        if (aqi <= 200)
            return "Unhealthy";

        if (aqi <= 300)
            return "Very Unhealthy";

        return "Hazardous";
    };


    return (

        <div className="ranking-container">

            <h1>Air Quality Ranking</h1>

            <p className="ranking-description">
                Live AQI ranking based on IQAir data
            </p>


            {loading && (
                <div className="loading">
                    Loading AQI data...
                </div>
            )}


            {error && (
                <div className="error">
                    {error}
                </div>
            )}


            {!loading && !error && (

                <div className="table-container">

                    <table>

                        <thead>

                            <tr>
                                <th>Rank</th>
                                <th>City</th>
                                <th>State</th>
                                <th>Country</th>
                                <th>AQI</th>
                                <th>Status</th>
                            </tr>

                        </thead>


                        <tbody>

                            {ranking.map((item, index) => (

                                <tr key={item.city}>

                                    <td className="rank">
                                        {index + 1}
                                    </td>

                                    <td className="city">
                                        {item.city}
                                    </td>

                                    <td>
                                        {item.state}
                                    </td>

                                    <td>
                                        {item.country}
                                    </td>

                                    <td className="aqi">
                                        {item.aqi}
                                    </td>

                                    <td>
                                        <span className="status">
                                            {getStatus(item.aqi)}
                                        </span>
                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>
            )}

        </div>
    );
}

export default Ranking;