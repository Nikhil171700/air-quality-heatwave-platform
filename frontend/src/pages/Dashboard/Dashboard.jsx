import './search.css';
import { useState } from "react";

function Dashboard() {

    const [place, setPlace] = useState("");
    const [results, setResults] = useState([]);
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [coordinates, setCoordinates] = useState(null);


    // Get input value
    function handleLocation(event) {
        setPlace(event.target.value);
    }


    // Search location
    async function setLocation() {

        if (!place.trim()) {
            console.log("Please enter a location");
            return;
        }

        try {

            const response = await fetch(
                `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
                    place
                )}&limit=5&format=json&apiKey=71d2fcb3d32e40aca38fd357505e2cee`
            );


            if (!response.ok) {
                throw new Error("Failed to fetch location");
            }


            const data = await response.json();

            console.log("Geoapify Data:", data);


            const locations = data.results;


            // Clear previous data
            setResults([]);
            setSelectedPlace(null);
            setCoordinates(null);


            // No location found
            if (locations.length === 0) {

                console.log("Location not found");

                return;
            }


            // ------------------------------------------------
            // ONLY ONE RESULT
            // ------------------------------------------------

            if (locations.length === 1) {

                console.log("Only one location found");

                choosePlace(locations[0]);

                return;
            }


            // ------------------------------------------------
            // MULTIPLE RESULTS
            // ------------------------------------------------

            setResults(locations);

        } catch (error) {

            console.error("Location API Error:", error);

        }
    }


    // Choose location
    async function choosePlace(place) {

        setSelectedPlace(place);

        try {

            const answer = await fetch(
                `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${encodeURIComponent(
                    place.lat
                )}&longitude=${encodeURIComponent(
                    place.lon
                )}&current=us_aqi,pm2_5,pm10,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone`
            );


            if (!answer.ok) {
                throw new Error("Failed to fetch air quality data");
            }


            const datas = await answer.json();


            setCoordinates(datas);


            console.log("Air Quality API Data:", datas);


        } catch (error) {

            console.error(
                "Air Quality API Error:",
                error
            );

        }
    }


    return (

        <div className="location">


            {/* =========================
                SEARCH SECTION
            ========================= */}

            <div className="search">

                <label id="air">
                    Search for Air Quality
                </label>


                <div>

                    <pre>
                        Search for city, state, country for realtime
                        air quality index
                    </pre>

                </div>


                <label>
                    Enter the location
                </label>


                <input
                    type="text"
                    placeholder="Enter city, state or country"
                    onChange={handleLocation}
                    value={place}
                />


                <button onClick={setLocation}>
                    Search
                </button>

            </div>



            {/* =========================
                MULTIPLE RESULTS
            ========================= */}

            {results.length > 1 && (

                <div className="results">

                    <h3>
                        Select a location
                    </h3>


                    {results.map((item, index) => (

                        <div
                            key={index}
                            className="result-item"
                            onClick={() => choosePlace(item)}
                        >

                            <h4>
                                📍 {item.name}
                            </h4>


                            <p>

                                {item.city && (
                                    <>
                                        {item.city}
                                        {item.state && ", "}
                                    </>
                                )}

                                {item.state && (
                                    <>
                                        {item.state}
                                        {item.country && ", "}
                                    </>
                                )}

                                {item.country}

                            </p>


                        </div>

                    ))}

                </div>

            )}

            {/* =========================
                AIR QUALITY
            ========================= */}

            {coordinates && (

                <div className="air-quality">

                    <h3 id="quality">
                        Current Air Quality
                    </h3>


                    <p>
                        <strong>US AQI:</strong>{" "}
                        {coordinates.current.us_aqi}
                    </p>


                    <p>
                        <strong>PM2.5:</strong>{" "}
                        {coordinates.current.pm2_5}
                    </p>


                    <p>
                        <strong>PM10:</strong>{" "}
                        {coordinates.current.pm10}
                    </p>


                    <p>
                        <strong>Carbon Monoxide:</strong>{" "}
                        {coordinates.current.carbon_monoxide}
                    </p>


                    <p>
                        <strong>Nitrogen Dioxide:</strong>{" "}
                        {coordinates.current.nitrogen_dioxide}
                    </p>


                    <p>
                        <strong>Sulphur Dioxide:</strong>{" "}
                        {coordinates.current.sulphur_dioxide}
                    </p>


                    <p>
                        <strong>Ozone:</strong>{" "}
                        {coordinates.current.ozone}
                    </p>

                </div>

            )}

        </div>

    );
}


export default Dashboard;
// import './search.css';
// import { useState } from "react";

// function Dashboard() {


// const [place, setPlace] = useState("");
// const [results, setResults] = useState([]);
// const [selectedPlace, setSelectedPlace] = useState(null);
// const [coordinates, setCoordinates] = useState(null);


// function handleLocation(event) {
//     setPlace(event.target.value);
// }


// async function setLocation() {

//     if (!place.trim()) {
//         console.log("Please enter a location");
//         return;
//     }

//     try {

//         const response = await fetch(
//             `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
//                 place
//             )}&format=json&addressdetails=1&limit=10`
//         );


//         if (!response.ok) {
//             throw new Error("Failed to fetch location");
//         }


//         const data = await response.json();


//         setResults(data);
//         setSelectedPlace(null);
//         setCoordinates(null);


//         console.log("Location API Data:", data);

//     } catch (error) {

//         console.error("Error:", error);

//     }
// }


// async function choosePlace(place) {

//     setSelectedPlace(place);

//     try {

//         const answer = await fetch(
//             `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${encodeURIComponent(
//                 place.lat
//             )}&longitude=${encodeURIComponent(
//                 place.lon
//             )}&current=us_aqi,pm2_5,pm10,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone`
//         );


//         if (!answer.ok) {
//             throw new Error("Failed to fetch air quality data");
//         }


//         const datas = await answer.json();


//         // Store the complete API response
//         setCoordinates(datas);


//         console.log("Air Quality API Data:", datas);

//     } catch (error) {

//         console.error("Air Quality API Error:", error);

//     }
// }


// return (

//     <div className="location">


// <div className="search">
//     <label id="air">search for air quality</label> 

// <div>
//     <pre>search for city, state, country for realtime 
//         air quality index 
//     </pre>
//     </div>
//         <label>Enter the location</label>


//         <input
//             type="text"
//             placeholder="Enter city, state or country"
//             onChange={handleLocation}
//             value={place}
//         />


//         <button onClick={setLocation}>
//             Search
//         </button>
// </div>

//         {/* Multiple search results */}

//         {results.length > 0 && (

//             <div className="results">

//                 <h3>Select a location</h3>


//                 {results.map((item, index) => (

//                     <div
//                         key={index}
//                         className="result-item"
//                         onClick={() => choosePlace(item)}
//                     >

//                         <h4>
//                             {item.name || "Unknown place"}
//                         </h4>


//                         <p>
//                             {item.display_name}
//                         </p>

//                     </div>

//                 ))}

//             </div>

//         )}




//         {/* Air Quality Data */}

//         {coordinates && (

//             <div className="air-quality">

//                 <h3>Current Air Quality</h3>


//                 <p>
//                     <strong>US AQI:</strong>{" "}
//                     {coordinates.current.us_aqi}
//                 </p>


//                 <p>
//                     <strong>PM2.5:</strong>{" "}
//                     {coordinates.current.pm2_5}
//                 </p>


//                 <p>
//                     <strong>PM10:</strong>{" "}
//                     {coordinates.current.pm10}
//                 </p>


//                 <p>
//                     <strong>Carbon Monoxide:</strong>{" "}
//                     {coordinates.current.carbon_monoxide}
//                 </p>


//                 <p>
//                     <strong>Nitrogen Dioxide:</strong>{" "}
//                     {coordinates.current.nitrogen_dioxide}
//                 </p>


//                 <p>
//                     <strong>Sulphur Dioxide:</strong>{" "}
//                     {coordinates.current.sulphur_dioxide}
//                 </p>


//                 <p>
//                     <strong>Ozone:</strong>{" "}
//                     {coordinates.current.ozone}
//                 </p>

//             </div>

//         )}

//     </div>

// );


// }

// export default Dashboard;




