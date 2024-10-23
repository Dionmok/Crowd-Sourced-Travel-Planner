import { Link, useNavigate, useLocation } from "react-router-dom";

export default function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();

  function mockLogin() {
    localStorage.setItem("token", "test");
  }

  function logout() {
    localStorage.removeItem("token");
    navigate(location.pathname);
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
            <Link>
              <button>My Trips</button>
            </Link>
            <Link>
              <button>My Experiences</button>
            </Link>
          </div>
          <div>
            <Link>
              <span>
                Welcome, {"<"}Username{">"}
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
            <Link to="/login" onClick={mockLogin}>
              <span>Login</span>
            </Link>
            <Link>
              <span>Create Account</span>
            </Link>
          </div>
        </nav>
      )}
    </>
  );
}
