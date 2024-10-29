import NavBar from "../components/NavBar";
import "../css/CreateAccountLogin.css";
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { from } = location.state || { from: "/" };

  async function submitLogin(e) {
    e.preventDefault();

    // Validate user input a username and password
    const inputErrors = [];
    if (!username.length > 0 || !password.length > 0) {
      inputErrors.push(["You must input a username and password"]);
    }

    // If user input is invalid, set errors, otherwise clear errors and log user in
    if (inputErrors.length > 0) {
      setErrors(inputErrors);
    } else {
      setErrors([]);
      localStorage.setItem("token", "mockLogin");
      navigate(from);
    }
  }

  if (localStorage.getItem("token")) {
    return (
      <div className="createAccountLoginPage">
        <NavBar />
        <div className="createAccountLoginContainer">
          <h1>You&apos;re already signed in!</h1>
          <Link to="/">Return Home</Link>
        </div>
      </div>
    );
  } else {
    return (
      <div className="createAccountLoginPage">
        <NavBar />
        <div className="createAccountLoginContainer">
          <h1>Login</h1>
          <form className="loginForm" onSubmit={(e) => submitLogin(e)}>
            <div className="formInputsContainer">
              <div className="formInput">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  value={username}
                  autoComplete="off"
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="formInput">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            {errors.length > 0 && (
              <div className="errors">
                {errors.map((error, i) => (
                  <p key={i}>{error}</p>
                ))}
              </div>
            )}
            <button>Login</button>
          </form>
          <span>
            Don&apos;t have an account?
            <Link to="/createAccount"> Create one here!</Link>
          </span>
        </div>
      </div>
    );
  }
}
