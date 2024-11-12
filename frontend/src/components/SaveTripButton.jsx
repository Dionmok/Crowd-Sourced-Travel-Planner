import { useState, useEffect } from "react";
import '../css/TripButtons.css';

export default function SaveTripButton({ tripName, tripDescription, startDate, onSuccess, onError }){
    const [isLoading, setIsLoading] = useState(false);
    const [isDisabled, setIsDisabled] = useState(true);

    useEffect(() => {
        if (tripName && tripDescription.trim() && startDate) {
            setIsDisabled(false);
        } else {
            setIsDisabled(true)
        }
    }, [tripName, tripDescription, startDate]);


    const handleSave = async () => {
        setIsLoading(true);
        try {

            const response = await fetch(`${import.meta.env.VITE_API_URL}/save_trip`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: localStorage.getItem("token")
                },
                body: JSON.stringify({
                    trip_name: tripName,
                    trip_description: tripDescription,
                    start_date: startDate,
                    time_created: new Date().toISOString(),
                }),
        });

        if (!response.ok) {
            throw new Error('Failed to delete the trip');
        }

        const data = await response.json();
        onSuccess(data.message);
    } catch (error) {
        onError(error.message);
    } finally {
        setIsLoading(false)
    }
};

return (
    <div>
      <button onClick={handleSave} disabled={isLoading || isDisabled} className="SaveTrip">
        {isLoading ? 'Saving...' : 'Save Trip'}
      </button>
    </div>
  );
};