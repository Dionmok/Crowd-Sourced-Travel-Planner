import NavBar from "../components/NavBar";
import ButtonLink from "../components/ButtonLink";

export default function MyExperiences() {
  return (
    <>
      <NavBar />
      <h1>My Experiences page</h1>
      <ButtonLink varient="button-add" buttonName="+ Experience" routeTo="/createExperience" />

    </>
  );
}
