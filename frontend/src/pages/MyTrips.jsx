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
    <h1>My Trips Page</h1>
    <ButtonLink varient ="button-add" buttonName="Add Trip" routeTo="/createTrip"/>
    <div className='trips-container'>
    {trips.map((trip) => (
      <TripTile key={trip.trip_id} trip={trip} userId={userId} onTripDeleted={handleTripDeleted} />
    ))}
    </div>
    </>
  );
}