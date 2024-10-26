import "./Reset.css";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import MyExperiences from "./pages/MyExperiences";
import CreateExperience from "./pages/CreateExperience";
import MyTrips from "./pages/MyTrips";
import CreateTrip from "./pages/CreateTrip";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/myExperiences" element={<MyExperiences />} />
        <Route path="/createExperience" element={<CreateExperience />} />
        <Route path="/myTrips" element={<MyTrips />} />
        <Route path="/createTrip" element={<CreateTrip />} />
      </Routes>
    </>
  );
}

export default App;
