
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import ButtonLink from "../components/ButtonLink";
import Description from "../components/Description";
import SaveTripButton from '../components/SaveTripButton'; 

export default function CreateTrip() {
  const [tripName, setTripName] = useState('')
  const [tripDescription, setTripDescription] = useState('');
  const [startDate, setStartDate] = useState('');
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
      <NavBar />
      <div>
        <label>
          Trip Name:
          <Description
            maxChars={60}
            variant="description-title"
            placeholder="e.g., College Gap Year: Europe 2020"
            value={''}
            setText={setTripName}
            />
        </label>
        <br />
        <label>
          Trip Description:
          <Description
            maxChars={200}
            variant="description-default"
            placeholder="Enter trip description here..."
            value={''}
            setText={setTripDescription}
            />
        </label>
        <br />
        <label>
          Start Date:
          <input
          type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </label>
        <br />
        <SaveTripButton
          tripName={tripName}
          tripDescription={tripDescription}
          startDate={startDate}
          onSuccess={handleSuccess}
          onError={handleError}
        />
      </div>
      <ButtonLink variant="button-back" buttonName="Cancel" routeTo="/myTrips" />
    </>
  );
}