import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/AddToExperienceButton.css"; 

export default function AddExperienceToTripButton({ experienceId }) {
  const [triptoAdd, setTriptoAdd] = useState("");
  const [existingTrips, setExistingTrips] = useState([]);
  const [loading, setLoading] = useState(false); // Default to not loading for logged-out users

  const isLoggedIn = !!localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      setLoading(true); // Only show loading for logged-in users
      const fetchTrips = async () => {
        try {
          const response = await fetch(`http://127.0.0.1:5000/trips`, {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          });
          if (!response.ok) {
            throw new Error("Failed to fetch trips");
          }
          const data = await response.json();
          setExistingTrips(data);
        } catch (error) {
          console.error(error);
        } finally {
          setTimeout(() => setLoading(false), 500); // Add a timeout to prevent flash
        }
      };

      fetchTrips();
    }
  }, [isLoggedIn]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (triptoAdd.trim()) {
      try {
        const response = await fetch(`http://127.0.0.1:5000/add_to_trip`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
          body: JSON.stringify({
            experience_id: experienceId,
            trip_id: triptoAdd,
          }),
        });
        if (response.ok) {
          window.alert("Added to trip successfully!");
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <>
      {isLoggedIn ? (
        loading ? (
          <div className="loading-state">
            <p>Loading trips...</p>
          </div>
        ) : existingTrips.length > 0 ? (
          <div className="add-to-trip-container">
            <select
              value={triptoAdd}
              onChange={(e) => setTriptoAdd(e.target.value)}
              className="add-to-trip-select"
            >
              <option value="">Select Experience</option>
              {existingTrips.map((trip, index) => (
                <option key={index} value={trip.trip_id}>
                  {trip.trip_name}
                </option>
              ))}
            </select>

            <button
              onClick={handleAdd}
              disabled={!triptoAdd.trim()}
              className={`add-to-trip-button ${!triptoAdd.trim() ? "disabled" : ""}`}
            >
              Add to trip
            </button>
          </div>
        ) : (
          <button
            className="no-trips-button"
            onClick={() => navigate("/createTrip")}
          >
            No Trips Available. Create One!
          </button>
        )
      ) : (
        <button
          className="login-button"
          onClick={() => navigate("/login")}
        >
          Login to Begin Planning
        </button>
      )}
    </>
  );
}
