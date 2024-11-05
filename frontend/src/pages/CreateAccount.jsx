import NavBar from "../components/NavBar";
import "../css/CreateAccountLogin.css";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function CreateAccount() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const [createAccountSuccess, setCreateAccountSuccess] = useState(null);

  async function submitCreateAccount(e) {
    e.preventDefault();

    // Validate user input
    const inputErrors = [];
    if (username.length < 4 || username.length > 16) {
      inputErrors.push("Username must be between 4 & 16 characters long");
    }
    if (!username.match(/^[A-Za-z0-9]+$/)) {
      inputErrors.push(
        "Username must only contain letters and/or numbers (A-Z, a-z, 0-9)"
      );
    }
    if (!password.match(/[A-Z]+/)) {
      inputErrors.push(
        "Password must contain at least one uppercase letter (A-Z)"
      );
    }
    if (!password.match(/[a-z]+/)) {
      inputErrors.push(
        "Password must contain at least one lowercase letter (a-z)"
      );
    }
    if (!password.match(/\d+/)) {
      inputErrors.push("Password must contain at least one number (0-9)");
    }
    if (!password.match(/[~!@#$%^&*=+.?]+/)) {
      inputErrors.push(
        "Password must contain at least one special character ~!@#$%^&*=+.?"
      );
    }
    if (password.length < 8 || password.length > 256) {
      inputErrors.push("Password must be between 8 & 256 characters long");
    }
    if (password !== confirmPassword) {
      inputErrors.push("Password and Confirm Password do not match");
    }

    // If user input is invalid, set errors
    if (inputErrors.length > 0) {
      setErrors(inputErrors);
      return;
    }
    
    setErrors([]);

    // Send request to backend to create new account
    const res = await fetch(`${import.meta.env.VITE_API_URL}/create-account`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
        confirm_password: confirmPassword,
      }),
    });

    // If account created successfully, update setCreateAccountSuccess, otherwise set error(s)
    if (res.status === 200) {
      const user = await res.json();
      setCreateAccountSuccess(user);
    } else {
      const errors = await res.json();
      setErrors(errors.errors);
    }
  }

  if (createAccountSuccess) {
    return (
      <div className="createAccountLoginPage">
        <NavBar />
        <div className="createAccountLoginContainer">
          <h1>Thank you, {username} for creating an account!</h1>
          <Link to="/login">Login with your new account!</Link>
        </div>
      </div>
    );
  } else {
    return (
      <div className="createAccountLoginPage">
        <NavBar />
        <div className="createAccountLoginContainer">
          <h1>Create an Account</h1>
          <form onSubmit={(e) => submitCreateAccount(e)}>
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
              <div className="formInput">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
            <div className="criteriaContainer">
              <div className="criteria">
                <h2>Username Criteria</h2>
                <span>4-16 characters long</span>
                <span>Only letters and/or numbers (A-Z, a-z, 0-9)</span>
              </div>
              <div className="criteria">
                <h2>Password Criteria</h2>
                <span>At least one uppercase letter (A-Z)</span>
                <span>At least one lowercase letter (a-z)</span>
                <span>At least one number (0-9)</span>
                <span>At least one special character {"~!@#$%^&*+=.?"}</span>
                <span>8-256 characters long</span>
              </div>
            </div>
            {errors.length > 0 && (
              <div className="errors">
                {errors.map((error, i) => (
                  <p key={i}>{error}</p>
                ))}
              </div>
            )}
            <button>Create</button>
          </form>
          <span>
            Already have an account?<Link to="/login"> Login here!</Link>
          </span>
        </div>
      </div>
    );
  }
}
