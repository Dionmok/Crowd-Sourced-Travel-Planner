import { useState, useEffect } from 'react';
import NavBar from "../components/NavBar";
import ButtonLink from "../components/ButtonLink";
import TripTile from '../components/TripTile';
import '../css/MyTrips.css'

export default function MyTrips({ userId }){
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    // Tries and fetchs trips from API
    const fetchTrips = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/trips/${userId}`);
        if (!response.ok){
          throw new Error('Failed to fetch trips');
        }
        const data = await response.json();
        setTrips(data)
      } catch(error){
        console.error(error)
      }
    };

    fetchTrips();
  }, [userId]);

  const handleTripDeleted = (tripId) => {
    setTrips((prevTrips) => prevTrips.filter(trip => trip.trip_id != tripId));
  };

  return (
    <>
    <NavBar />
    <div className='add-trip-button'>
      <ButtonLink varient ="button-add" buttonName="Add Trip" routeTo="/createTrip"/>
    </div>
    <div className='trip-page-title'>
      <h2>My Trips</h2>
    </div>
    <div className='trips-container'>
      <div className='trip-list'>
        {trips.length == 0 ? (
          <p>There are no trips created.</p>
        ) : (
          <div>
            {trips.map((trip) => (
              <TripTile key={trip.trip_id} trip={trip} userId={userId} onTripDeleted={handleTripDeleted} />
            ))}
          </div>
        )}
    </div>
    </div>
    </>
  );
}