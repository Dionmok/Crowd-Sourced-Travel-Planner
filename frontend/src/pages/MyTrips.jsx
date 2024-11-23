import { useState, useEffect } from 'react';
import NavBar from "../components/NavBar";
import ButtonLink from "../components/ButtonLink";
import TripTile from '../components/TripTile';
import '../css/MyTrips.css'

export default function MyTrips(){
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Tries and fetches trips from API
    const fetchTrips = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/trips`, {
          headers: {
            Authorization: localStorage.getItem("token")
          }
        });
        if (!response.ok){
          throw new Error('Failed to fetch trips');
        }
        const data = await response.json();
        setTrips(data)
      } catch(error){
        console.error(error)
      } finally {
        setLoading(false)
      }
    };

    fetchTrips();
  }, []);

  const handleTripDeleted = (tripId) => {
    setTrips((prevTrips) => prevTrips.filter(trip => trip.trip_id != tripId));
  };

  return (
    <>
      <NavBar current="trips"/>
      {/* Page Header */}
      <header className="trip-page-header">
        <h1>My Trips</h1>
        <ButtonLink
          varient="button-add"
          buttonName="Add Trip"
          routeTo="/createTrip"
        />
      </header>
      {/* Trips Section */}
      <main className="trips-container">
        {loading ? (
          <p>Loading trips...</p>
        ) : trips.length === 0 ? (
          <p>
            There are no trips created. <a href="/createTrip">Start planning now!</a>
          </p>
        ) : (
          trips.map((trip) => (
            <TripTile
              key={trip.trip_id}
              trip={trip}
              onTripDeleted={handleTripDeleted}
            />
          ))
        )}
      </main>
    </>
  );
}