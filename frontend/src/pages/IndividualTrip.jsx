import { useLocation } from "react-router-dom";
import NavBar from "../components/NavBar";
import ButtonLink from "../components/ButtonLink";

export default function IndividualTrip(){
  const location = useLocation();
  const { trip } = location.state;

  return (
    <>
    <NavBar />
    <h1>{trip.trip_name}</h1>
    <p>{trip.trip_description}</p>
    <p>Start Date: {new Date(trip.start_date).toLocaleDateString()}</p>
    <ButtonLink variant="button-back" buttonName="Back" routeTo="/myTrips" />
    </>
  )
}

