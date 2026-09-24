import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import Layout from "./component/Layout/Layout";

import Home from "./pages/Home/Home";
import Airquality from "./pages/Airquality/Airquality";
import Dashboard from "./pages/Dashboard/Dashboard";
import Heatwave from "./pages/Heatwave/Heatwave";
import Login from "./pages/Login/Login";
import Profile from "./pages/Profile/Profile";
import Ranking from "./pages/Ranking/Ranking";
import Register from "./pages/Register/Register";
import Prediction from "./pages/Prediction/Prediction";
function App() {

    return (
        <BrowserRouter>

            <Routes>

                <Route element={<Layout />}>

                    <Route path="/" element={<Home />} />

                    <Route
                        path="/dashboard"
                        element={<Dashboard />}
                    />

                    <Route
                        path="/airquality"
                        element={<Airquality />}
                    />

                    <Route
                        path="/heatwave"
                        element={<Heatwave />}
                    />

                    <Route
                        path="/prediction"
                        element={<Prediction />}
                    />

                    <Route
                        path="/ranking"
                        element={<Ranking />}
                    />

                    {/* <Route
                        path="/about"
                        element={<About />}
                    /> */}

                    <Route
                        path="/login"
                        element={<Login />}
                    />

                    <Route
                        path="/profile"
                        element={<Profile />}
                    />

                   

                </Route>
                       <Route
                        path="/register"
                        element={<Register />}
                    />
            </Routes>

        </BrowserRouter>
    );
}

export default App;