import { useNavigate, useLocation } from 'react-router-dom';
import DeleteTripButton from '../components/DeleteTripButton';
import EditTripButton from '../components/EditTripButton';
import '../css/TripTile.css';

export default function TripTile ({ trip, onTripDeleted}){
    const navigate = useNavigate();
    const location = useLocation();

    // Redirects to individual trip
    const handleClick = () => {
        navigate(`/individualTrip/${trip.trip_id}`, { state: { trip, from: location.pathname } });
    };

    return(
        <div className='trip-tile'>
            {/* Trip Details */}
            <div onClick={handleClick} className='trip-details'>
                <h2 >{trip.trip_name}</h2>
            </div>
            {/* Buttons */}
            <div className='button-container'>
                <div className='edit'>
                    <EditTripButton trip ={trip}/>
                </div>
                <div className='delete'>
                    <DeleteTripButton tripId={trip.trip_id} onTripDeleted={onTripDeleted} />
                </div>
            </div>
        </div>
    );
};