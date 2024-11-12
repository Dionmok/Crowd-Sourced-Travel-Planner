import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import ButtonLink from "../components/ButtonLink";
import EditExperienceButton from "../components/EditExperienceButton";

export default function IndividualExperience() {
    const location = useLocation(); 
    const navigate = useNavigate(); 
    const experience = location.state?.experience;  // Get the experience object from the location state

    const [experienceName, setExperienceName] = useState(experience.experience_name);
    const [description, setDescription] = useState(experience.description);
    const [address, setAddress] = useState(experience.address);
    const [latitude, setLatitude] = useState(experience.latitude);
    const [longitude, setLongitude] = useState(experience.longitude);
    const [keywords, setKeywords] = useState([]);
    const [photoURL, setPhotoURL] = useState(experience.photo || "testurl");
    const [rating, setRating] = useState(experience.rating);

    const [error, setError] = useState("");
 
    // Fetch the keywords for the experience
    useEffect(() => {
        const fetchKeywords = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:5000/experience_keywords/${experience.experience_id}`);
                if (response.ok) {
                    const data = await response.json();
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

    return (
        <>
          <NavBar />
          <h1>Individual Experience page</h1>
          <form id='updateExperience'>
            <div className="title-container">
              <h1>Trip Name: {experienceName} </h1>
            </div>
            <div className="description-container">
              <h1>Description: </h1>
              <h1> {description} </h1>
            </div>
            <div className="location-container">
              <h1>Address:</h1>
                <h1> {address} </h1>
              <h1>Geolocation: </h1>
              <div className='geolocation-input-container'>
                <h1>Latitude</h1>
                    <h1> {latitude} </h1>
                <h1>Longitude</h1>
                    <h1> {longitude} </h1>
              </div>
            </div>
            <div className="keywords-container">
              <h1>Keywords:</h1>
                <div className='keywords-list'>
                    {keywords.map((keyword, index) => (
                     <div key={index}>
                        {keyword}  
                    </div> 
                    ))}
                </div>
            </div>
            <div className="image-container">
              <h1>Image: </h1>
                <img src={photoURL} alt="Experience Image" />
            </div>
            <div className="rating-container">
              <h1>Rating</h1>
                <h1> {rating} </h1>
            </div>

            <EditExperienceButton experience={experience} />
            {/* TODO: Add ExperinceTrip button  */}
            <ButtonLink varient="button-back" buttonName="Cancel" routeTo="/myExperiences" />
            
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