import { useState, useEffect } from 'react';
import NavBar from "../components/NavBar";
import ButtonLink from "../components/ButtonLink";
import TripTile from '../components/TripTile';
import '../css/MyTrips.css'

export default function MyTrips(){
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Tries and fetchs trips from API
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
    <NavBar />
    <div className='add-trip-button'>
      <ButtonLink varient ="button-add" buttonName="+ Trip" routeTo="/createTrip"/>
    </div>
    <div className='trips-container'>
      <div className='trip-list'>
        {loading ? (
                <p>Loading trips...</p>
        ): trips.length == 0 ? (
          <p>There are no trips created.</p>
        ) : (
          <div>
            {trips.map((trip) => (
              <TripTile key={trip.trip_id} trip={trip} onTripDeleted={handleTripDeleted} />
            ))}
          </div>
        )}
      </div>
    </div>
    </>
  );
}