import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import ImageUpload from "../components/ImageUpload";
import ButtonLink from "../components/ButtonLink";
import TextBox from "../components/TextBox";
import Keywords from "../components/Keywords";
import GeolocationInput from "../components/GeolocationInput";
import Rating from "../components/Rating";

export default function EditExperience() {
    const location = useLocation(); // Get the location object
    const navigate = useNavigate(); // Get the navigate function
    const experience = location.state?.experience; 
    console.log("experince obj",experience); // Log the experience object

    const [experienceName, setExperienceName] = useState(experience.experience_name);
    const [description, setDescription] = useState(experience.description);
    const [address, setAddress] = useState(experience.address);
    const [latitude, setLatitude] = useState(experience.latitude);
    const [longitude, setLongitude] = useState(experience.longitude);
    const [keywords, setKeywords] = useState([]);
    const [photoURL, setPhotoURL] = useState(experience.photo || "");
    const [rating, setRating] = useState(experience.rating);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    console.log("experience id", experience.experience_id);
    console.log("experince_name", experienceName);
    console.log("description", description);
    console.log("address", address);
    console.log("latitude", latitude);
    console.log("longitude", longitude);
    console.log("keywords", keywords);
    console.log("photoURL", photoURL);
    console.log("rating", rating);
    
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
    console.log("experince_name", experienceName);

    const handleSubmit = async (e) => {
        e.preventDefault();  // Prevent the default form submission behavior
        console.log("Handling Submit")

        try {
            const response = await fetch(`http://127.0.0.1:5000/edit_experience`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    experience_id: experience.experience_id,
                    experience_name: experienceName,
                    description: description,
                    photo: photoURL,
                    latitude: latitude,
                    longitude: longitude,
                    address: address,
                    keywords: keywords,
                    rating: rating,
                    time_updated: new Date().toISOString()
                }),
        });

        if (!response.ok) {
            throw new Error('Failed to save the experience');
        }
        console.log('Experience saved successfully');
        setSuccess(true);
        navigate('/myExperiences');
        }
        catch (error) {
            setError(error.message);
        }
    };


    return (
        <>
          <NavBar />
          <h1>Edit Experience page</h1>
          <form onSubmit={handleSubmit} id='updateExperience'>
            <div className="title-container">
              <h1>Title</h1>
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
            <div className="description-container">
              <h1>Description</h1>
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
            <div className="image-container">
              <h1>Image</h1>
              <ImageUpload 
                name='image'
                id='imageUpload'
                value={photoURL}
                onChange={setPhotoURL} />
            </div>
            <div className="rating-container">
              <h1>Rating</h1>
              <Rating 
                name='rating'
                id='createExperienceRating'
                value={rating}
                onChange={setRating} />
            </div>
            <ButtonLink type="submit" varient="button-add" buttonName="Save" />
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