import { useState } from "react";
import '../css/DeleteTripButton.css';

export default function DeleteTripButton({ tripId, userId, onTripDeleted }){
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleDelete = async () => {
        // Pop-up window confirms if user wants to delete trips
        const confrimDelete = window.confirm("Are you sure you want to delete this trip?")
        if(!confrimDelete) {
            return;
        } 

        try {
            // Makes a DELETE request
            const response = await fetch(`http://127.0.0.1:5000/delete_trip`, {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ trip_id: tripId, user_id: userId }),
        });

        if (!response.ok) {
            throw new Error('Failed to delete the trip');
        }

        setSuccess(true);
        onTripDeleted(tripId);
    } catch (err) {
        setError(err.message);
    }
};

return (
    <div>
        <button className="button-delete" onClick={handleDelete}>
            Delete
        </button>
    </div>
    ); 
};