import NavBar from "../components/NavBar";
import ButtonLink from "../components/ButtonLink";

export default function MyTrips() {
  return (
    <>
      <NavBar />
      <h1>My Trips page</h1>
      <ButtonLink varient="button-add" buttonName="+ Trip" routeTo="/createTrip" />

    </>
  );
}
