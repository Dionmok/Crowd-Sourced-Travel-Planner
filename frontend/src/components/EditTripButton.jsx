import { useNavigate } from "react-router-dom";
import {FaEdit} from 'react-icons/fa';

export default function EditTripButton ({ trip }) {
    const navigate = useNavigate();

    const handleEdit = () => {
        navigate(`/editTrip/${trip.trip_id}`, { state: { trip } }); 
    };

    return (
        <div>
            <button onClick={handleEdit}>
                <FaEdit />
            </button>
        </div>
    );
};
