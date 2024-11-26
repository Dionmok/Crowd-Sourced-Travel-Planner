import NavBar from "../components/NavBar";
import ImageUpload from "../components/ImageUpload";
import ButtonLink from "../components/ButtonLink";
import TextBox from "../components/TextBox";
import Keywords from "../components/Keywords";
import { useState} from "react";
import { useNavigate } from "react-router-dom";
import LocationAutocomplete from "../components/LocationAutocomplete";
import '../css/CreateExperience.css';

export default function CreateExperience() {
  const [error, setError] = useState("");

  const [experienceName, setExperienceName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [keywords, setKeywords] = useState([]);
  const [photoURL, setPhotoURL] = useState("");

  const navigate = useNavigate();

  // handle form submission 
  const handleSubmit = async (e) => {
    e.preventDefault(); 
    console.log("Handling Submit");

    // check if all required fields are filled
    if (!experienceName || !description || !address || !latitude || !longitude || keywords.length === 0 || !photoURL ) {
      setError("Please fill in all required fields");
      return;
    }
    setError(""); // clear error message


    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/save_experience`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem("token")
        },
        // Simplified object properties for improved readability and reduced redundancy.
        // Keys like `description`, `latitude`, `longitude`, etc., now use shorthand syntax
        // since their names match the variable names. Explicit mappings are kept where keys differ.
        body: JSON.stringify({
          experience_name: experienceName,
          description,
          photo: photoURL,
          latitude,
          longitude,
          address,
          keywords,
          time_created: new Date().toISOString()
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save the experience');
      }
    } catch (error) {
      setError(error.message);
    }
    console.log("Experience saved successfully");
    navigate('/myExperiences');
  };

  return (
    <>
      <NavBar />
      <form onSubmit={handleSubmit} id='createExperience'>
          <h1 className='create-experience-name-title'>Experience Title</h1>
          <div className='create-experience-title-container'>
            <TextBox 
              name='experienceName' 
              id='experienceName'
              maxChars='60' 
              varient="description-title" 
              placeholder="e.g., Davis Farmers Market..." 
              value={experienceName}
              onChange={setExperienceName}
              required/>
          </div>
        <br />
        <div className='create-description-container'>
          <h1 className='create-experience-description-title'>Experience Description</h1>
          <TextBox 
            name='description'
            id='description' 
            maxChars='200' 
            varient="description-Create" 
            placeholder="Enter experience description here..." 
            value={description} 
            onChange={setDescription}
            required />
        </div>
        <br />
          <h1 className='create-experience-address-title'>Address</h1>
          <div className="create-location-container">
          <LocationAutocomplete setAddress={setAddress} setLatitude={setLatitude} setLongitude={setLongitude} setError={setError} />
        </div>
        <br />
        <div className="create-keywords-container">
          <h1 className='create-experience-keywords-title'>Keywords</h1>
        </div>
        <br />
        <div className="create-keywords-added-container">
            <Keywords 
              name='keywords'
              value={keywords}
              onChange={setKeywords} />
          </div>
        <div className="image-container">
          <h1 className='create-experience-image-title' >Image</h1>
          <div className="image-container-image">
            <ImageUpload 
              name='image'
              id='imageUpload'
              value={photoURL}
              onChange={setPhotoURL} />
            </div>
        </div>
        <br />
        <div className='save-cancel-button-experience-container'>
        <button type="submit" className="button-add">Submit</button>
        <ButtonLink varient="button-back-experience" buttonName="Cancel" routeTo="/myExperiences" />

      </div>
        {/* Error Message Display */}
        {error && (
          <div className='error-message'>
            {error}
          </div>
        )}
      </form>
    </>
  );
}