import { useNavigate } from "react-router-dom";

export default function EditTripButton ({ trip }) {
    const navigate =useNavigate();

    const handleEdit = () => {
        navigate(`/editTrip/${trip.trip_id}`, { state: { trip } }); 
    };

    return (
        <div>
            <button onClick={handleEdit}>
                Edit
            </button>
        </div>
    );
};
