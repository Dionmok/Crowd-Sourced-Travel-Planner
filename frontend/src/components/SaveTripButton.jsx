import { useState, useEffect } from "react";
import '../css/TripButtons.css';

export default function SaveTripButton({ tripId, tripName, tripDescription, startDate, onSuccess, onError }){
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
            const userId = 123; // Hardcoded for testing; replace with dynamic user_id fetching logic

            const response = await fetch(`http://127.0.0.1:5000/save_trip`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: userId,
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