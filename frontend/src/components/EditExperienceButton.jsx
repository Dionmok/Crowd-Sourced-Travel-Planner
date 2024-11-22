import { useNavigate, useLocation } from "react-router-dom";
import {FaEdit} from 'react-icons/fa';

export default function EditExperienceButton({ experience, from }) {
    const navigate = useNavigate();
    const location = useLocation();
    const trip = location.state?.trip;

    const handleEdit = () => {
        navigate(`/editExperience/${experience.experience_id}`, { state: { experience, from, trip } });
    };

    return (
        <div>
            <button onClick={handleEdit}>
                <FaEdit />
            </button>
        </div >
    );
};
