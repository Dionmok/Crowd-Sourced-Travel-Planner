import { useState } from "react";
import {FaTrash} from 'react-icons/fa';

export default function DeleteTripExperienceButton({ tripId, experienceId, onExperienceRemoved }){
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleDelete = async () => {
        // Pop-up window confirms if user wants to remove the expereince from a trip
        const confrimDelete = window.confirm("Are you sure you remove this experience from the trip?")
        if(!confrimDelete) {
            return;
        } 

        try {
            // Makes a DELETE request
            const response = await fetch(`${import.meta.env.VITE_API_URL}/trip/${tripId}/experience/${experienceId}`, {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: localStorage.getItem("token")
                },
        });

        if (!response.ok) {
            throw new Error('Failed to remove the experience from the trip');
        }

        onExperienceRemoved(experienceId)
        setSuccess(true);
        onTripDeleted(tripId);
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