import { useNavigate } from "react-router-dom";
import {FaEdit} from 'react-icons/fa';

export default function EditExperienceButton({ experience }) {
    const navigate = useNavigate();

    const handleEdit = () => {
        navigate(`/editExperience/${experience.experience_id}`, { state: { experience } });
    };

    return (
        <div>
            <button onClick={handleEdit}>
                <FaEdit />
            </button>
        </div >
    );
};
