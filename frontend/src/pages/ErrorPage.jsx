import { Link } from "react-router-dom";
import NavBar from "../components/NavBar";

export default function ErrorPage() {
  return (
    <>
      <NavBar />
      <h1>404: Not Found <Link to="/">Go Home</Link></h1>
    </>
  );
}
