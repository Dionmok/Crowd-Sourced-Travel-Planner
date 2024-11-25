import {useState} from "react";
import {FaTrash} from 'react-icons/fa';
import { useNavigate, useLocation } from "react-router-dom";

export default function DeleteExperienceButton({experienceId, onExperienceDeleted, from}) {
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const trip = location.state?.trip; // Get the trip object from the location state
    const experience = location.state?.experience; // Get the experience object from the location state

    const handleDelete = async () => {
        console.log("Debug - Navigating back to:", from);
        const confirmDelete = window.confirm("Are you sure you want to delete this experience?");
        if (!confirmDelete) {
            navigate(from, {state: {trip, experience, from}}); 
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/delete_experience`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: localStorage.getItem("token")
                },
                body: JSON.stringify({experience_id: experienceId }),
        });

        if (!response.ok) {
            throw new Error('Failed to delete the experience');
        }
        setSuccess(true);
        onExperienceDeleted(experienceId); 
    } catch (err) {
        setError(err.message);
    }
};
    return (
        <div>
            <button onClick={handleDelete}>
                <FaTrash />
            </button>
        </div>
    );
};