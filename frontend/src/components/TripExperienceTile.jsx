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
            <input type="checkbox" className="trip-experience-checkbox"/>
            <h2>{experience.experience_name}</h2>
            <RemoveTripExperienceButton tripId={tripId} experienceId={experience.experience_id} onExperienceRemoved={onRemove}/>
        </div>
        
    );
};