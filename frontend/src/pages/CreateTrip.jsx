import NavBar from "../components/NavBar";
import ButtonLink from "../components/ButtonLink";
export default function CreateTrip() {
  return (
    <>
      <NavBar />
      <h1>Create Trip page</h1>
      <ButtonLink varient="button-add" buttonName="Save" routeTo="/myTrips" />
      <ButtonLink varient="button-back" buttonName="Cancel" routeTo="/myTrips" />
    </>
  );
}
