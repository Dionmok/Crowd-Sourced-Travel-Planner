
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import ButtonLink from "../components/ButtonLink";
import Description from "../components/Description";
import SaveChanges from '../components/SaveChanges';
import '../css/EditTrip.css';
import '../css/ButtonLink.css'; 

export default function EditTrip() {
  const location = useLocation()
  const navigate = useNavigate()
  const trip = location.state?.trip 

  const [tripName, setTripName] = useState(trip.trip_name)
  const [tripDescription, setTripDescription] = useState(trip.trip_description);
  const [startDate, setStartDate] = useState(trip.start_date);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSuccess = (message) => {
    setSuccess(message);
    setError(null);
    navigate('/myTrips');
  };

  const handleError = (message) => {
    setSuccess(message);
    setError(null);
  };

  return (
    <>
      <NavBar/>
        <label>
          <h2 className='edit-trip-name-title'>Trip Name</h2>
          <div className='edit-title-container'>
            <Description
              maxChars={60}
              variant="description-title"
              placeholder="e.g., College Gap Year: Europe 2020"
              value={tripName}
              setText={setTripName}
              />
          </div>
        </label>
        <br/>
        <label>
          <div className='edit-description-container'>
            <h2 className='edit-trip-description-title'>Trip Description</h2>
            <Description
              maxChars={200}
              variant="description-Edit"
              placeholder="Enter trip description here..."
              value={tripDescription}
              setText={setTripDescription}
              />
            </div>
        </label>
        <br />
        <label>
          <div className='startdate-container'>
            <h2 className='edit-trip-startdate-title'>Start Date</h2>
            <input
            className='startDate-Input'
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
        </label>
        <br/>
        <div className='save-cancel-button-container'>
          <SaveChanges
            tripId={trip.trip_id}
            tripName={tripName}
            tripDescription={tripDescription}
            startDate={startDate}
            onSuccess={handleSuccess}
            onError={handleError}
          />
          <ButtonLink varient="button-cancel" buttonName="Cancel" routeTo="/myTrips"/>
        </div>
    </>
  );
}
