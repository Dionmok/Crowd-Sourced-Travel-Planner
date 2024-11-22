import { useEffect, useState } from "react";
import { parsePath, useLocation, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import ImageUpload from "../components/ImageUpload";
import ButtonLink from "../components/ButtonLink";
import TextBox from "../components/TextBox";
import Keywords from "../components/Keywords";
import GeolocationInput from "../components/GeolocationInput";
import ExpSaveChanges from "../components/ExpSaveChanges";
import '../css/IndividualExperience.css';


export default function EditExperience() {
    const location = useLocation(); // Get the location object
    const navigate = useNavigate(); // Get the navigate function
    const experience = location.state?.experience;  // Get the experience object from the location state

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
                const response = await fetch(`http://127.0.0.1:5000/experience_keywords/${experience.experience_id}`);
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
        navigate('/myExperiences');
      };
    
    const handleError = (message) => {
        setSuccess(message);
        setError(null);
    };

    const handleCancelClick = () => {
      navigate(`/individualExperience/${experience.experience_id}`, { state: { experience } });
    }
    
    return (
        <>
          <NavBar />
          <form id='updateExperience'>
            <div className="experience-container">
              <TextBox 
                name='experienceName' 
                id='experienceName'
                maxChars='60' 
                varient="description-title" 
                placeholder="e.g., Davis Farmers Market..." 
                value={experienceName}
                onChange={setExperienceName}
                required/>
              {/* Boxes next to each other  */}
              <div className="row-container">
                {/* left side  */}
                <div className="left-container"> 
                  <div className="image-container">
                    <ImageUpload 
                      name='image'
                      id='imageUpload'
                      value={photoURL}
                      onChange={setPhotoURL} />
                  </div>
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
                  <div className="back-button-container">
                    <button onClick={handleCancelClick}>Cancel</button>
                  </div>
                  
                </div>
                {/* right side  */}
                <div className="right-container">
                  <div className=".description-container">
                    <h1>Description: </h1>
                    <TextBox 
                      name='description'
                      id='description' 
                      maxChars='200' 
                      varient="description-default" 
                      placeholder="Enter experience description here..." 
                      value={description} 
                      onChange={setDescription}
                      required />
                  </div>
                  <div className="location-container">
                    <h1>Address</h1>
                    <TextBox 
                      name='address' 
                      id='address'
                      maxChars='100' 
                      varient="description-title" 
                      placeholder="Enter location here..." 
                      value={address} 
                      onChange={setAddress}
                      required/>
                    <h1>Geolocation</h1>
                    <div className='geolocation-input-container'>
                      <h1>Latitude</h1>
                        <GeolocationInput 
                          name='latitude' 
                          id='latitude'
                          placeholder="38.8951" 
                          value={latitude} 
                          onChange={setLatitude} />
                      <h1>Longitude</h1>
                        <GeolocationInput 
                        name='longitude' 
                        id='longitude'
                        placeholder="-77.0364"
                        value={longitude} 
                        onChange={setLongitude}/>
                    </div>
                  </div>
                  <div className="keywords-container">
                    <h1>Keywords</h1>
                    <Keywords 
                      name='keywords'
                      value={keywords}
                      onChange={setKeywords} />
                  </div>
                </div>
              </div>   
            </div>
            {/* Error Message Display */}
            {error && (
              <div>
                {error}
              </div>
            )}
          </form>
        </>
      );
    }