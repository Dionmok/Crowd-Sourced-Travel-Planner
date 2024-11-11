import { useNavigate } from 'react-router-dom';
import DeleteTripButton from '../components/DeleteTripButton'; // Import DeleteTripButton
import EditTripButton from '../components/EditTripButton';
import '../css/TripTile.css';

export default function TripTile ({ trip, userId, onTripDeleted}){
    const navigate = useNavigate();

    // Redirects to individual trip
    const handleClick = () => {
        navigate(`/individualTrip/${trip.trip_id}`, { state: { trip } });
    };

    return(
        <div className='trip-tile'>
            <div className='trip-details'>
                <div onClick={handleClick} className="title">
                    <h2 >{trip.trip_name}</h2>
                </div>
            </div>
            
            <div className="button-container">
                <div className='edit'>
                    <EditTripButton trip ={trip}/>
                </div>
                <div className='delete'>
                    <DeleteTripButton tripId={trip.trip_id} userId={userId} onTripDeleted={onTripDeleted} />
                </div>
            </div>
        </div>
    );
};