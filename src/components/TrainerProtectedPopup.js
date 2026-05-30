import React, { useState } from "react";

import "./TrainerProtectedPopup.css";

export default function TrainerProtectedPopup({ children }) {
  const [authenticated, setAuthenticated] = useState(
    localStorage.getItem("trainerAuth") === "true",
  );

  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const handleLogin = () => {
    if (password === "trainer123") {
      localStorage.setItem("trainerAuth", "true");

      setAuthenticated(true);
    } else {
      setError("Incorrect Password");
    }
  };

  if (authenticated) {
    return children;
  }

  return (
    <div className="trainer-popup-overlay">
      <div className="trainer-popup-box">
        <h1>Trainer Access</h1>

        <p>Enter password to continue.</p>

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <span>{error}</span>}

        <button onClick={handleLogin}>Unlock Access</button>
      </div>
    </div>
  );
}
