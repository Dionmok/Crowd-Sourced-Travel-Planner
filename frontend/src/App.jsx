import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import MyExperiences from "./pages/MyExperiences";
import CreateExperience from "./pages/CreateExperience";
import "./Reset.css";
import "./App.css";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/myExperiences" element={<MyExperiences />} />
        <Route path="/createExperience" element={<CreateExperience />} />
      </Routes>
    </>
  );
}

export default App;
