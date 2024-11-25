import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import ButtonLink from "../components/ButtonLink";
import ImageUpload from "../components/ImageUpload";
import TextBox from "../components/TextBox";
import Keywords from "../components/Keywords";
import ExpSaveChanges from "../components/ExpSaveChanges";
import LocationAutocomplete from "../components/LocationAutocomplete";
import '../css/CreateExperience.css';

export default function EditExperience() {
    const location = useLocation(); // Get the location object
    const navigate = useNavigate(); // Get the navigate function
    const experience = location.state?.experience;  // Get the experience object from the location state
    const from = location.state?.from;  // Get the previous page from the location state
    const trip = location.state?.trip; // Get the previous trip info from the location state

    const [experienceName, setExperienceName] = useState(experience.experience_name);
    const [description, setDescription] = useState(experience.description);
    const [address, setAddress] = useState(experience.address);
    const [latitude, setLatitude] = useState(experience.latitude);
    const [longitude, setLongitude] = useState(experience.longitude);
    const [keywords, setKeywords] = useState([]);
    const [photoURL, setPhotoURL] = useState(experience.photo || "testurl");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    // Fetch the keywords for the experience
    useEffect(() => {
        const fetchKeywords = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/experience_keywords/${experience.experience_id}`);
                if (response.ok) {
                    const data = await response.json();
                    console.log(data);
                    setKeywords(data);
                } else {
                    console.error('Failed to fetch keywords');
                   
                } 
            } catch(error) {
                console.error(error);
            }
        };
        fetchKeywords();
    }, [experience.experience_id]);
    
    const handleSuccess = (message) => {
        setSuccess(message);
        setError(null);
        navigate("/myExperiences")
      };
    
    const handleError = (message) => {
        setSuccess(message);
        setError(null);
    };

    const handleCancelClick = () => {
      navigate("/myExperiences")
    }
    
    return (
        <>
          <NavBar />
          <form id='updateExperience'>
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
            <ExpSaveChanges 
                experienceId={experience.experience_id}
                experienceName={experienceName}
                description={description}
                address={address}
                latitude={latitude}
                longitude={longitude}
                keywords={keywords}
                photo={photoURL}
                onSuccess={handleSuccess}
                onError={handleError}
                />
            {/* Cancel button to exit edit mode */}
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