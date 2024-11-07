import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import NavBar from "../components/NavBar";
import ButtonLink from "../components/ButtonLink";
import TripExperienceTile from "../components/TripExperienceTile"

export default function IndividualTrip(){
  const location = useLocation();
  const { tripId } = useParams();
  const { trip } = location.state;
  const [experiences, setExperiences] = useState([]);

  useEffect(() => {
    // Tries and fetchs experiences from API
    const fetchExperiences = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/trip_experiences/${tripId}`);
        if (!response.ok){
          throw new Error('Failed to fetch experiences');
        }
        const data = await response.json();
        setExperiences(data)
      } catch(error){
        console.error(error)
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
    <h1>{trip.trip_name}</h1>
    <p>{trip.trip_description}</p>
    <p>Start Date: {new Date(trip.start_date).toLocaleDateString()}</p>
    <ButtonLink variant="button-back" buttonName="Back" routeTo="/myTrips" />
    <div className="trips-container">
    {experiences.length == 0 ? (
      <p>There are no experiences added to this trip.</p>
    ) : (
      <div>
        {experiences.map((experience) => (
          <TripExperienceTile key={experience.experience_id} experience={experience} tripId={tripId} onRemove={handleRemoveExperience} />
        ))}
      </div>
    )}
    </div>
    </>
  );
};

