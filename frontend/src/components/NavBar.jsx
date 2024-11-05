import { Link, useNavigate, useLocation } from "react-router-dom";
import "../css/NavBar.css";

export default function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();

  function logout() {
    localStorage.removeItem("token");
    navigate("/");
  }

  return (
    <>
      {localStorage.getItem("token") ? (
        <nav>
          <div>
            <Link to="/">
              <button>Home</button>
            </Link>
            <Link>
              <button>Feed</button>
            </Link>
            <Link to="/myTrips">
              <button>My Trips</button>
            </Link>
            <Link to="/myExperiences">
              <button>My Experiences</button>
            </Link>
          </div>
          <div>
            <Link to="/">
              <span>
                Welcome{" "}
                {JSON.parse(atob(localStorage.getItem("token").split(".")[1]))
                  .username || ""}
              </span>
            </Link>
            <span onClick={logout}>Logout</span>
          </div>
        </nav>
      ) : (
        <nav>
          <div>
            <Link to="/">
              <button>Home</button>
            </Link>
            <Link>
              <button>Feed</button>
            </Link>
          </div>
          <div>
            <Link to="/login" state={{ from: location.pathname }}>
              <span>Login</span>
            </Link>
            <Link to="/createAccount">
              <span>Create Account</span>
            </Link>
          </div>
        </nav>
      )}
    </>
  );
}
