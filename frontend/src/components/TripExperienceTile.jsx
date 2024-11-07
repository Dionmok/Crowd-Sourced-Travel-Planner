import { useNavigate } from 'react-router-dom';
import RemoveTripExperienceButton from '../components/RemoveTripExperienceButton';
import '../css/TripTile.css';

export default function TripExperienceTile ({ experience, tripId, onRemove }){    
    const navigate = useNavigate();

    /*const handleClick = () => {
        navigate(`/experience/${experience.experience_id}`);
    };*/ 

    return(
        <div className="trip-tile" /*onClick={handleClick}*/>
            <h2>{experience.experience_name}</h2>
            <div className="button-container">
            <RemoveTripExperienceButton tripId={tripId} experienceId={experience.experience_id} onExperienceRemoved={onRemove}/>
            </div>
        </div>
        
    );
};