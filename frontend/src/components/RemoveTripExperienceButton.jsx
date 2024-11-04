import { useState } from "react";

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
            const response = await fetch(`http://127.0.0.1:5000/trip/${tripId}/experience/${experienceId}`, {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json',
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
            Remove
        </button>
    </div>
    ); 
};