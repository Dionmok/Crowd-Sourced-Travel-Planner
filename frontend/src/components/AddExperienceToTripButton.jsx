import { useState, useEffect } from "react";

export default function AddExperienceToTripButton({ experienceId }) {
  const [triptoAdd, setTriptoAdd] = useState(""); // state to store the selected trip
  const [existingTrips, setExistingTrips] = useState([]); // state to store the existing trips
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Tries and fetchs trips from API
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
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  const handleAdd = async () => {
    // TODO: Implement correct handling of empty trip selection and selection of trip already containing the experience
    if (triptoAdd.trim() && !existingTrips.includes(triptoAdd)) {
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
      } catch (error) {
        console.error(error);
      }
      console.log("Added to trip successfully");
    }
  };
  return (
    <>
      <div className="experience-selection-container">
        <select
          value={triptoAdd}
          onChange={(e) => setTriptoAdd(e.target.value)}
        >
          <option value="">Add Experience to Trip</option>
          {existingTrips.map((trip, index) => (
            <option key={index} value={trip.trip_id}>
              {trip.trip_name}
            </option>
          ))}
        </select>

        <button onClick={handleAdd}>Add</button>

      </div>
    </>
  );
}
