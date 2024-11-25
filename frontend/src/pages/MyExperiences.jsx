import { useState,  useEffect } from "react";
import NavBar from "../components/NavBar";
import ButtonLink from "../components/ButtonLink";
import ExperienceTile from "../components/ExperienceTile";
import '../css/MyExperiences.css';

export default function MyExperiences() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/saved_experiences`, {
          headers: {
            Authorization: localStorage.getItem("token")
          }
        }); 
        if (!response.ok){
          throw new Error('Failed to fetch experiences');
        }
        const data = await response.json();
        setExperiences(data)
      }
      catch(error){
        console.error(error)
      }
      finally {
        setTimeout(() => {
          setLoading(false);
        }, 500);
      }
    }
    fetchExperiences();
  }, []);

  const handleExperienceDeleted = (experienceId) => {
    setExperiences((prevExperiences) => prevExperiences.filter(experience => experience.experience_id != experienceId));
  };

  return (
    <>
      <NavBar current="experiences"/>
      <header className='experience-page-header'>
        <h1>My Experiences</h1>
      </header>
      <main className="experiences-container">
        {loading ? (
          <p>Loading experiences...</p>
        ) : experiences.length === 0 ? (
          <p>There are no experiences created.</p>
        ) : (
          experiences.map((experience) => (
            <ExperienceTile key={experience.experience_id} experience={experience} onExperienceDeleted={handleExperienceDeleted} />
          ))
        )}
      </main>
      <div className="action-buttons-container">
        <div className="add-experience-button">
          <ButtonLink varient="button-add" buttonName="+ Experience" routeTo="/createExperience" />
        </div>
        <div className="edit-trash-buttons">
        </div>
      </div>
    </>
  );
}
