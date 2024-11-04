import { useNavigate } from 'react-router-dom';
/*import DeleteTripButton from '../components/DeleteTripButton'; // Import DeleteTripButton*/
import '../css/TripTile.css';

export default function TripExperienceTile ({ experience }){    
    const navigate = useNavigate();

    /*const handleClick = () => {
        navigate(`/experience/${experience.experience_id}`);
    };*/ 

    return(
        <div className="trip-tile" /*onClick={handleClick}*/>
            <input type="checkbox" className="trip-experience-checkbox"/>
            <h2>{experience.experience_name}</h2>
            {/* <DeleteTripButton tripId={trip.trip_id} experienceId={experience_id} onTripDeleted={onTripDeleted} /> */}
        </div>
        
    );
};