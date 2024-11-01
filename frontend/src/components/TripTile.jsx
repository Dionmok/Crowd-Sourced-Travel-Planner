import React from 'react';
import { useNavigate } from 'react-router-dom';
import DeleteTripButton from '../components/DeleteTripButton'; // Import DeleteTripButton
import EditTripButton from '../components/EditTripButton';
import '../css/TripTile.css';

export default function ({ trip, userId, onTripDeleted}){
    const navigate = useNavigate();

    // Redirects to individual trip
    const handleClick = () => {
        navigate(`/individualTrip/${trip.trip_id}`, { state: { trip } });
    };

    return(
        <div className="trip-tile">
            <h2 onClick={handleClick}>{trip.trip_name}</h2>
            <DeleteTripButton tripId={trip.trip_id} userId={userId} onTripDeleted={onTripDeleted} />
            <EditTripButton trip ={trip}/>
        </div>
    );
};