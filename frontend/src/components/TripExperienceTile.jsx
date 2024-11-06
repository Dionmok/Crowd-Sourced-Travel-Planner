import { useNavigate } from 'react-router-dom';
import '../css/TripTile.css';

export default function TripExperienceTile({ experience, onAddToTrip }) {
    const navigate = useNavigate();

    // Optional: handle clicking the tile to navigate to the experience details page
    const handleClick = () => {
        navigate(`/experience/${experience.id}`);
    };

    // Handle adding experience to a trip
    const handleAddToTrip = () => {
        if (onAddToTrip) {
            onAddToTrip(experience);  // Call the parent function to add the experience to a trip
        }
    };

    return (
        <div className="trip-tile" onClick={handleClick}>
            <input type="checkbox" className="trip-experience-checkbox" />
            <h2>{experience.experience_name}</h2>
            <button onClick={handleAddToTrip}>Add to Trip</button> {/* Add to Trip button */}
        </div>
    );
}
