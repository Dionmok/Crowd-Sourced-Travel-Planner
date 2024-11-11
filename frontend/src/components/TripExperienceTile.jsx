import { useNavigate } from 'react-router-dom';
import RemoveTripExperienceButton from '../components/RemoveTripExperienceButton';
import '../css/ExperienceTile.css';

export default function TripExperienceTile ({ experience, tripId, onRemove }){    
    const navigate = useNavigate();

    // Redirects to individual experience
    const handleClick = () => {
        navigate(`/individualExperience/${experience.experience_id}`, { state: { experience } });
    };

    return(
        <div  className="experience-tile">
            <div onClick={handleClick} className='image'>
                <img src={experience.photo} alt="Experience" />
            </div>
            <div className="experience-details">
                <div onClick={handleClick} className='title'>
                    <h2>{experience.experience_name}</h2>
                </div>
                <div className='rating'>
                    <p>Rating:{experience.rating}</p>
                </div>
                {/* TODO: Add keywordss  */}
                {/* <div className='keywords'>
                    <p>Keywords: {experience.keywords.join(', ')}</p>
                </div> */}
                <div className='address'>
                    <p>Address: {experience.address}</p>
                </div>
                <div className='description'>
                    <p>Description: {experience.description}</p>
                </div>
            </div>

            <div className='button-edit-container'>
                <div className='delete'>
                    <RemoveTripExperienceButton tripId={tripId} experienceId={experience.experience_id} onExperienceRemoved={onRemove}/>
                </div>
            </div>
        </div>
    );
};
