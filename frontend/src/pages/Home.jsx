import NavBar from "../components/NavBar";
import SearchBar from "../components/SearchBar";
import "../css/Home.css";

export default function Home() {
  return (
    <div className="bgImage">
      <NavBar />
      <SearchBar />
      <div className="homeContainer">
        <h1>Welcome to Trippie</h1>
        <p>A Crowd-Sourced Travel Planner app.</p>
        <p>To get started, simply search for a location and/or keywords to find great experiences for your next trip.</p>
        <p>Sign up for an account to contribute to our awesome list of experiences, it&apos;s free!</p>
      </div>
    </div>
  );
}
