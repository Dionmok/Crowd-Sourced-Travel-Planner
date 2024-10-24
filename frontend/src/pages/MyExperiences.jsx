import NavBar from "../components/NavBar";
import Button from "../components/Button";
export default function MyExperiences() {
  return (
    <>
      <NavBar />
      <h1>My Experiences page</h1>
      <Button buttonName="+ Experience" routeTo="/createExperience" />

    </>
  );
}
