import { useNavigate } from 'react-router-dom';
import RemoveTripExperienceButton from '../components/RemoveTripExperienceButton';
import '../css/TripExperienceTile.css';

export default function TripExperienceTile ({ experience, tripId, onRemove, showDelete=true}){    
    const navigate = useNavigate();

    // Redirects to individual experience
    const handleClick = () => {
        navigate(`/individualExperience/${experience.experience_id}`, { state: { experience } });
    };

    return(
        <div  className='trip-experience-tile'>
            <div onClick={handleClick} className='image'>
                <img src={experience.photo} alt="Experience" />
            </div>
            <div className='trip-experience-details'>
                <div onClick={handleClick} className='title'>
                    <h2>{experience.experience_name}</h2>
                </div>
                <div className='trip-experience-rating'>
                    <p>Rating: {experience.rating}</p>
                </div>
                {/* TODO: Add keywordss  */}
                {/* <div className='keywords'>
                    <p>Keywords: {experience.keywords.join(', ')}</p>
                </div> */}
                <div className='trip-experience-address'>
                    <p>Address: {experience.address}</p>
                </div>
                <div className='trip-experience-description'>
                    <p>Description: {experience.description}</p>
                </div>
            </div>

            <div className='button-edit-container'>
                <div className='delete'>
                    {showDelete && <RemoveTripExperienceButton tripId={tripId} experienceId={experience.experience_id} onExperienceRemoved={onRemove}/>}
                </div>
            </div>
        </div>
    );
};
