import NavBar from "../components/NavBar";
import ButtonLink from "../components/ButtonLink";

export default function IndividualTrip() {
  return (
    <>
      <NavBar />
      <h1>Individual Trip Page</h1>
      <ButtonLink varient="button-edit" buttonName="Edit Trip" routeTo="/editTrip" />

    </>
  );
}
