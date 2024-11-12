import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import NavBar from "../components/NavBar";
import ButtonLink from "../components/ButtonLink";
import TripExperienceTile from "../components/TripExperienceTile"
import '../css/IndividualTrip.css'

export default function IndividualTrip(){
  const location = useLocation();
  const { tripId } = useParams();
  const { trip } = location.state;
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Tries and fetchs experiences from API
    const fetchExperiences = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/trip_experiences/${tripId}`);
        if (!response.ok){
          throw new Error('Failed to fetch experiences');
        }
        const data = await response.json();
        setExperiences(data)
      } catch(error){
        console.error(error)
      } finally {
        setLoading(false)
      }
    };

    fetchExperiences();
  }, [tripId]);

  const handleRemoveExperience = (experienceId) => {
    setExperiences(prevExperiences => prevExperiences.filter(exp => exp.experience_id != experienceId));
  };

  return (
    <>
    <NavBar />
    <div className="page-container">
    <div className='back-button'>
      <ButtonLink varient="button-cancel" buttonName="Back" routeTo="/myTrips" />
    </div>
    <div className="individual-trip-page-title">
      <h2>{trip.trip_name}</h2>
    </div>
    <div className='Individual-trip-description'>
      <p>Description: {trip.trip_description}</p>
    </div>
    <div className='trip-date'>
      <p>Start Date: {new Date(trip.start_date).toLocaleDateString()}</p>
    </div>
    <div className='trips-experience-container'>
      <div className='trips-experience-list'>
      {loading ? (
                <p>Loading experiences...</p>
      ) : experiences.length == 0 ? (
        <p>There are no experiences added to this trip.</p>
      ) : (
        <div>
          {experiences.map((experience) => (
            <TripExperienceTile key={experience.experience_id} experience={experience} tripId={tripId} onRemove={handleRemoveExperience} />
          ))}
        </div>
      )}
      </div>
    </div>
    </div>
    </>
  );
};

