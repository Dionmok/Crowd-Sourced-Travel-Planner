import "./css/Reset.css";
import "./css/App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import FeedPage from "./pages/FeedPage";
import Login from "./pages/Login";
import MyExperiences from "./pages/MyExperiences";
import CreateExperience from "./pages/CreateExperience";
import IndividualExperience from "./pages/IndividualExperience";
import EditExperience from "./pages/EditExperience";
import MyTrips from "./pages/MyTrips";
import CreateTrip from "./pages/CreateTrip";
import IndividualTrip from "./pages/IndividualTrip";
import EditTrip from "./pages/EditTrip";
import CreateAccount from "./pages/CreateAccount";
import ErrorPage from "./pages/ErrorPage";

/* TODO: Replace the hard coded user_id */
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/myExperiences" element={<MyExperiences userId={123} />} />
        <Route path="/individualExperience/:experienceId" element={<IndividualExperience />} />
        <Route path="/editExperience/:experienceId" element={<EditExperience />} />
        <Route path="/createExperience" element={<CreateExperience />} /> 
        <Route path="/myTrips" element={<MyTrips userId={123}/>} />       
        <Route path="/individualTrip/:tripId" element={<IndividualTrip />} /> 
        <Route path="/editTrip/:tripId" element={<EditTrip />} />
        <Route path="/createTrip" element={<CreateTrip />} />
        <Route path="/createAccount" element={<CreateAccount />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </>
  );
}

export default App;