
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import ButtonLink from "../components/ButtonLink";
import Description from "../components/Description";
import SaveTripButton from '../components/SaveTripButton';
import '../css/CreateTrip.css';
import '../css/ButtonLink.css'; 

export default function CreateTrip() {
  const [tripName, setTripName] = useState('')
  const [tripDescription, setTripDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate()

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
      <NavBar />
      <label>
          <h2 className='create-trip-name-title'>Trip Name</h2>
          <div className='create-title-container'>
          <Description
            maxChars={60}
            variant="description-title"
            placeholder="e.g., College Gap Year: Europe 2020"
            value={''}
            setText={setTripName}
            />
            </div>
      </label>
      <br />
      <label>
        <div className='create-description-container'>
            <h2 className='create-trip-description-title'>Trip Description</h2>
            <Description
              maxChars={200}
              variant="description-Create"
              placeholder="Enter trip description here..."
              value={''}
              setText={setTripDescription}
              />
        </div>
      </label>
      <br />
      <label>
        <div className='startdate-container'>
          <h2 className='create-trip-startdate-title'>Start Date</h2>
          <input
          className="StartDate-Input"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
      </label>
      <br />
      <div className='save-cancel-button-container'>
        <SaveTripButton
          tripName={tripName}
          tripDescription={tripDescription}
          startDate={startDate}
          onSuccess={handleSuccess}
          onError={handleError}
        />
        <ButtonLink varient="button-cancel" buttonName="Cancel" routeTo="/myTrips" />
      </div>
    </>
  );
}