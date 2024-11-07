import { useNavigate } from "react-router-dom";
import '../css/EditTripButton.css';

export default function EditTripButton ({ trip }) {
    const navigate = useNavigate();

    const handleEdit = () => {
        navigate(`/editTrip/${trip.trip_id}`, { state: { trip } }); 
    };

    return (
        <div>
            <button className="button-edit"  onClick={handleEdit}>
                Edit
            </button>
        </div>
    );
};
