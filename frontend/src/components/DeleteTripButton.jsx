import { useState } from "react";
import {FaTrash} from 'react-icons/fa';

export default function DeleteTripButton({ tripId, onTripDeleted }){
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
            const response = await fetch(`${import.meta.env.VITE_API_URL}/delete_trip`, {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: localStorage.getItem("token")
                },
                body: JSON.stringify({ trip_id: tripId }),
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
        <button onClick={handleDelete}>
            <FaTrash />
        </button>
    </div>
    ); 
};