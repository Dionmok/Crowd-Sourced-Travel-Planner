import { useNavigate } from 'react-router-dom';
import EditExperienceButton from '../components/EditExperienceButton';
import DeleteExperienceButton from '../components/DeleteExperienceButton';
import '../css/ExperienceTile.css';

export default function ({ experience, userId, onExperienceDeleted }){
    const navigate = useNavigate();

    // Redirects to individual experience
    const handleClick = () => {
        navigate(`/individualExperience/${experience.experience_id}`, { state: { experience } });
    };

    return(
        <div onClick={handleClick} className="experience-tile">
            <div className='image'>
                <img src={experience.photo} alt="Experience" />
            </div>
            <div className="experience-details">
                <div className='title'>
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
                <div className='edit'>
                    <EditExperienceButton experience={experience}/>
                </div>
                <div className='delete'>
                    <DeleteExperienceButton experienceId={experience.experience_id} userId={userId} onExperienceDeleted={onExperienceDeleted} />
                </div>
                
                
            </div>
        
            
        </div>
    );
};