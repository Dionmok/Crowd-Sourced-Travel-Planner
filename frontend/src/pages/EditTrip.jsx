import NavBar from "../components/NavBar";
import ButtonLink from "../components/ButtonLink";
import Description from "../components/Description";

export default function EditTrip() {
  return (
    <>
      <NavBar />
      <h1>Edit Trip Page</h1>
      <ButtonLink varient="button-add" buttonName="Save" routeTo="/individualTrip" />
      <ButtonLink varient="button-delete" buttonName="Delete" routeTo="/myTrips" />
      <ButtonLink varient="button-back" buttonName="Cancel" routeTo="/individualTrip" />
    </>
  );
}
