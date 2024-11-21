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
        setLoading(false)
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
      <div className="experiences-container">
        <div className="flex-box-container"> 
          <div className="left-side-container">
            <h1>Your Saved Experiences</h1>
            <div className="add-experience-button">
              <ButtonLink varient="button-add" buttonName="+ Experience" routeTo="/createExperience" />
            </div>
          </div>
          <div className="right-side-container">
            <div className='experience-list'>
              { loading ? (
                    <p>Loading experiences...</p>
              ): experiences.length == 0 ? (
                <p className="no-experience-text">There are no experiences created.</p>
              ) : (
                <div>
                  {experiences.map((experience) => (
                    <ExperienceTile key={experience.experience_id} experience={experience} onExperienceDeleted={handleExperienceDeleted} />
                  ))}
                </div >
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
