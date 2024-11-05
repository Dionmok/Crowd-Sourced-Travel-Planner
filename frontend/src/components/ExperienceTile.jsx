import { useNavigate } from 'react-router-dom';
import EditExperienceButton from '../components/EditExperienceButton';
import DeleteExperienceButton from '../components/DeleteExperienceButton';
import '../css/TripTile.css';

export default function ({ experience, userId, onExperienceDeleted }){
    const navigate = useNavigate();

    // Redirects to individual experience
    const handleClick = () => {
        navigate(`/individualExperience/${experience.experience_id}`, { state: { experience } });
    };

    return(
        <div className="trip-tile">
            <h2 onClick={handleClick}>{experience.experience_name}</h2>
            <DeleteExperienceButton experienceId={experience.experience_id} userId={userId} onExperienceDeleted={onExperienceDeleted} />
            <EditExperienceButton experience={experience}/>

        </div>
    );
};