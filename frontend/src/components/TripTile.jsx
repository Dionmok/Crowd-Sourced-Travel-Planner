import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/TripTile.css';

export default function ({ trip, userId, onTripDeleted}){
    const navigate = useNavigate();

    // Redirects to individual trip
    const handleClick = () => {
        navigate('/individualTrip/${trip.trip_id}');
    };

    return(
        <div className="trip-tile">
            <h2 onClick={handleClick}>{trip.trip_name}</h2>
        </div>
    );
}