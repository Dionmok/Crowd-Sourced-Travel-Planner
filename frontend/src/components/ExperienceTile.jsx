import { useNavigate } from 'react-router-dom';
import DeleteTripButton from '../components/DeleteTripButton'; // Import DeleteTripButton
import EditTripButton from '../components/EditTripButton';
import '../css/TripTile.css';

export default function ExperienceTile({ experience, userId}){
    const navigate = useNavigate();

    // Redirects to individual trip
    const handleClick = () => {
        navigate(`/individualExperience/${experince.experience_id}`, { state: { experience } });
    };

    return(
        <div className="trip-tile">
            <h2 onClick={handleClick}>{experience.experience_name}</h2>
        </div>
    );
};