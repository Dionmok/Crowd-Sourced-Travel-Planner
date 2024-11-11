import NavBar from "../components/NavBar";
import ImageUpload from "../components/ImageUpload";
import ButtonLink from "../components/ButtonLink";
import TextBox from "../components/TextBox";
import Keywords from "../components/Keywords";
import GeolocationInput from "../components/GeolocationInput";
import Rating from "../components/Rating";
import { useState } from "react";

export default function CreateExperience() {
  const [error, setError] = useState("");
  
  const [experienceName, setExperienceName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [keywords, setKeywords] = useState([]);
  const [photoURL, setPhotoURL] = useState("");
  const [rating, setRating] = useState("");

  // handle form submission 
  const handleSubmit = async (e) => {
    e.preventDefault(); 
    console.log("Handling Submit");
    
    // check if all required fields are filled
    if (!experienceName || !description || !address || !latitude || !longitude || !address || keywords.length === 0 || !photoURL || !rating ) {
      setError("Please fill in all required fields");
      return;
    }
    setError(""); // clear error message


    try {
      const userId = 123; // Hardcoded for testing; replace with dynamic user_id fetching logic
      const response = await fetch(`http:///127.0.0.1:5000/save_experience`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          experience_name: experienceName,
          description: description,
          photo: photoURL,
          latitude: latitude,
          longitude: longitude,
          address: address,
          keywords: keywords,
          rating: rating,
          time_created: new Date().toISOString()
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save the experience');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <>
      <NavBar />
      <h1>Create Experience page</h1>
      <form onSubmit={handleSubmit} id='createExperience'>
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
