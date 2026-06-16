import React, { useState } from "react";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./TrainerProtectedPopup.css";

export default function TrainerProtectedPopup({ children }) {
  const navigate = useNavigate();
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
        {/* CLOSE BUTTON */}
        <button className="trainer-close-btn" onClick={() => navigate("/")} aria-label="Close">
          <X size={20} />
        </button>

        <h1>Trainer Access</h1>

        <p>Enter password to continue.</p>

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <span>{error}</span>}

        <button className="trainer-submit-btn" onClick={handleLogin}>Unlock Access</button>
      </div>
    </div>
  );
}
