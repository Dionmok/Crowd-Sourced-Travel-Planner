import { useNavigate, useLocation } from 'react-router-dom';
import EditExperienceButton from '../components/EditExperienceButton';
import DeleteExperienceButton from '../components/DeleteExperienceButton';
import AddExperienceToTripButton from "../components/AddExperienceToTripButton";
import '../css/ExperienceTile.css';

export default function ExperienceTile ({ experience, onExperienceDeleted }){
    const navigate = useNavigate();
    const location = useLocation();

    // Redirects to individual experience
    const handleClick = () => {
        navigate(`/individualExperience/${experience.experience_id}`, { state: { experience, from: location.pathname } });
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
                    <p>Rating: {experience.rating}</p>
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
                {/* TODO: Add USERNAME of user that created the Experience */}
                <div className='username'>
                    {/* <p>Posted by: {experience.user_id}</p> */}
                </div>
            </div>

            <div className='button-edit-container'>
                <div className='add-to-trip'>
                    <AddExperienceToTripButton experienceId={experience.experience_id} />
                </div>
                <div className='edit'>
                    <EditExperienceButton experience={experience}/>
                </div>
                <div className='delete'>
                    <DeleteExperienceButton experienceId={experience.experience_id} onExperienceDeleted={onExperienceDeleted} />
                </div>
            </div>
        
            
        </div>
    );
};