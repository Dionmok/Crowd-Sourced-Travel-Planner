import NavBar from "../components/NavBar";
import ButtonLink from "../components/ButtonLink";
import Description from "../components/Description";

export default function CreateTrip() {
  return (
    <>
      <NavBar />
      <h1>Create Trip page</h1>
      <ButtonLink varient="button-add" buttonName="Save" routeTo="/myTrips" />
      <ButtonLink varient="button-back" buttonName="Cancel" routeTo="/myTrips" />
      <div>
        <h1>Description</h1>
        <Description maxChars='200' varient="description-default "/>
      </div>

    </>
  );
}
