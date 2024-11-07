import { useState, useEffect } from "react";

export default function SaveChanges({ tripId, tripName, tripDescription, startDate, onSuccess, onError }){
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
            const response = await fetch(`http://127.0.0.1:5000/edit_trip`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    trip_id: tripId,
                    trip_name: tripName,
                    trip_description: tripDescription,
                    start_date: startDate,
                    time_updated: new Date().toISOString(),
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
      <button onClick={handleSave} disabled={isLoading || isDisabled}>
        {isLoading ? 'Saving...' : 'Save Changes'}
      </button>
    </div>
  );
};