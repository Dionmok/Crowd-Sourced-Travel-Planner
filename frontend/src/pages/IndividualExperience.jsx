import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import ButtonLink from "../components/ButtonLink";
import AddExperienceToTripButton from "../components/AddExperienceToTripButton";
import '../css/IndividualExperience.css';

export default function IndividualExperience() {
    const location = useLocation(); 
    const navigate = useNavigate(); 
    const experience = location.state?.experience;  // Get the experience object from the location state
    const from = location.state?.from;

    const [experienceName, setExperienceName] = useState(experience.experience_name);
    const [description, setDescription] = useState(experience.description);
    const [address, setAddress] = useState(experience.address);
    const [latitude, setLatitude] = useState(experience.latitude);
    const [longitude, setLongitude] = useState(experience.longitude);
    const [keywords, setKeywords] = useState([]);
    const [photoURL, setPhotoURL] = useState(experience.photo || "testurl");
    const [rating, setRating] = useState("Loading...");
    const [userRating, setUserRating] = useState("");
    const [timeCreated, setTimeCreated] = useState(experience.time_created);

    const [error, setError] = useState("");
 
    // Fetch the keywords and current user rating for the experience
    useEffect(() => {
        const fetchKeywords = async () => {
            try {
              const response = await fetch(`${import.meta.env.VITE_API_URL}/experience_keywords/${experience.experience_id}`, {
                  headers: {
                    Authorization: localStorage.getItem("token")
                  }
                });
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

        const fetchUserRating = async () => {
          if (!localStorage.getItem("token")) {
            return;
          }

          try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/experience_user_rating/${experience.experience_id}`, {
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: localStorage.getItem("token")
              }
            });
            if (response.ok) {
              const data = await response.json();
              setUserRating(data.user_rating);
            }
          } catch(error) {
            console.error(error)
          }
        };
        fetchUserRating();

        const fetchExperienceRating = async () => {
          try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/experience_rating/${experience.experience_id}`, {
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              }
            });
            if (response.ok) {
              const data = await response.json();
              setRating(data.rating);
            }
          } catch(error) {
            console.error(error)
          }
        }
        fetchExperienceRating();
    }, [experience.experience_id]);

    async function handleRatingChange(e) {
      if (!localStorage.getItem("token")) {
        return;
      }

      setUserRating(e.target.value);

      await fetch(`${import.meta.env.VITE_API_URL}/rate_experience`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify({
          experience_id: experience.experience_id,
          user_rating: e.target.value,
        }),
      });

      const response = await fetch(`${import.meta.env.VITE_API_URL}/experience_rating/${experience.experience_id}`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        }
      });
      const data = await response.json();

      setRating(data.rating);
    };

    return (
        <>
          <NavBar />
          <form id='updateExperience'>
            <div className="experience-container">
              {/* Tile  */}
              <div className="title">
                    <h1>{experienceName} </h1>
              </div>
              {/* Boxes next to each other  */}
              <div className="row-container">
                {/* left side  */}
                <div className="left-container">
                  <img src={photoURL} alt="Experience Image" />           
                  <ButtonLink varient="button-back" buttonName="Back" />
                </div>
                {/* right side  */}
                <div className="right-container">
                <div className="rating-container">
                    <h1>Rating: {rating}</h1>
                    {localStorage.getItem("token") &&
                    <div>
                      <span>Your rating: </span>
                      <select name="rating" value={userRating} onChange={handleRatingChange}>
                        <option value="">Select Rating</option>
                        <option value="1">1 Star</option>
                        <option value="2">2 Stars</option>
                        <option value="3">3 Stars</option>
                        <option value="4">4 Stars</option>
                        <option value="5">5 Stars</option>
                      </select>
                    </div>
                    }
                  </div>
                  <div className="description-container">
                    <h1>Description: </h1>
                    <h2> {description} </h2>
                  </div>
                  <div className="address-container">
                    <h1>Address:</h1>
                    <h2> {address} </h2>
                  </div>
                    <div className="geolocation-container">
                    <h1>Geolocation: </h1>
                    <div className='geolocation-input-container'>
                      <div className="geo-item">
                          <h2>Latitude</h2>
                          <p>{latitude}</p>
                      </div>
                      <div className="geo-item">
                          <h2>Longitude</h2>
                          <p>{longitude}</p>
                      </div>
                    </div>
                  </div>
                  <div className="keywords-container">
                    <h1>Keywords:</h1>
                      <div className='keywords-list'>
                          {keywords.map((keyword, index) => (
                          <h2 key={index}>
                              {keyword}  
                          </h2> 
                          ))}
                      </div>
                  </div>
                  <p>Created on: {timeCreated}</p>
                  <div className="right-button-container">
                    <AddExperienceToTripButton experienceId={experience.experience_id} />
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