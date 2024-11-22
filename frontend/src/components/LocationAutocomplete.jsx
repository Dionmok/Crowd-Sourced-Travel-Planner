import { useState } from "react";
import { Autocomplete } from "@react-google-maps/api";

export default function LocationAutocomplete({ setAddress, setLatitude, setLongitude, setError }) {
  const [autocomplete, setAutocomplete] = useState(null);
  const [localAddress, setLocalAddress] = useState("");
  const [latitude, setInternalLatitude] = useState("");
  const [longitude, setInternalLongitude] = useState("");

  const handlePlaceSelect = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      if (place && place.geometry && place.geometry.location) {
        const updatedLocation = {
          address: place.formatted_address,
          latitude: place.geometry.location.lat().toString(),
          longitude: place.geometry.location.lng().toString(),
        };

        // Update internal state
        setLocalAddress(updatedLocation.address);
        setInternalLatitude(updatedLocation.latitude);
        setInternalLongitude(updatedLocation.longitude);

        // Update parent state
        setAddress(updatedLocation.address);
        setLatitude(updatedLocation.latitude);
        setLongitude(updatedLocation.longitude);
      } else {
        setError("Could not retrieve location details");
      }
    }
  };

  return (
    <div className="location-autocomplete-container">
      {/* Address Autocomplete */}
      <Autocomplete
        onLoad={(instance) => setAutocomplete(instance)}
        onPlaceChanged={handlePlaceSelect}
      >
        <input
          type="text"
          name="address"
          placeholder="Enter location here..."
          value={localAddress}
          onChange={(e) => {
            setLocalAddress(e.target.value);
            setAddress(e.target.value);
          }}
          className="location-input"
          required
        />
      </Autocomplete>

      {/* Geolocation Display */}
      <div className="geolocation-display">
        <label htmlFor="latitude">Latitude</label>
        <input
          id="latitude"
          type="text"
          value={latitude}
          placeholder="Auto-populated"
          readOnly
          disabled
          className="geo-input"
        />
        <label htmlFor="longitude">Longitude</label>
        <input
          id="longitude"
          type="text"
          value={longitude}
          placeholder="Auto-populated"
          readOnly
          disabled
          className="geo-input"
        />
      </div>
    </div>
  );
}
