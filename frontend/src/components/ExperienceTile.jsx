import { useNavigate } from 'react-router-dom';
import EditExperienceButton from '../components/EditExperienceButton';
import '../css/TripTile.css';

export default function ({ experience, userId}){
    const navigate = useNavigate();

    // Redirects to individual trip
    const handleClick = () => {
        navigate(`/individualExperience/${experience.experience_id}`, { state: { experience } });
    };

    return(
        <div className="trip-tile">
            <h2 onClick={handleClick}>{experience.experience_name}</h2>
            <EditExperienceButton experience={experience}/>

        </div>
    );
};