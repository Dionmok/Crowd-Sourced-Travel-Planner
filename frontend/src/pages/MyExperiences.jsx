import { useState,  useEffect } from "react";
import NavBar from "../components/NavBar";
import ButtonLink from "../components/ButtonLink";
import ExperienceTile from "../components/ExperienceTile";
import '../css/MyTrips.css';

export default function MyExperiences({userId}) {
  const [experiences, setExperiences] = useState([]);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/experiences/123`); // TODO Hardcoded for testing; replace with dynamic user_id fetching logic
        if (!response.ok){
          throw new Error('Failed to fetch experiences');
        }
        const data = await response.json();
        setExperiences(data)
      }
      catch(error){
        console.error(error)
      }
    }
    fetchExperiences();
  }, [userId]);

  const handleExperienceDeleted = (experienceId) => {
    setExperiences((prevExperiences) => prevExperiences.filter(experience => experience.experience_id != experienceId));
  };

  return (
    <>
      <NavBar />
      <h1>My Experiences page</h1>
      <ButtonLink varient="button-add" buttonName="+ Experience" routeTo="/createExperience" />
      <div className="trips-container">
        {experiences.length == 0 ? (
          <p>There are no experiences created.</p>
        ) : (
          <div>
            {experiences.map((experience) => (
              <ExperienceTile key={experience.experience_id} experience={experience} userId={userId} onExperienceDeleted={handleExperienceDeleted} />
            ))}
          </div >
        )}
      </div>
    </>
  );
}
