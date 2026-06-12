import React, { useState } from "react";
import "./TeacherProtectedPopup.css";

export default function TeacherProtectedPopup({ children }) {
  const [authenticated, setAuthenticated] = useState(
    localStorage.getItem("teacherAuth") === "true"
  );
  const [name, setName] = useState(
    localStorage.getItem("teacherName") || ""
  );
  const [password, setPassword] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (!nameInput.trim()) {
      setError("Please enter your name");
      return;
    }
    if (password === "excellenceteachers24") {
      localStorage.setItem("teacherAuth", "true");
      localStorage.setItem("teacherName", nameInput.trim());
      setName(nameInput.trim());
      setAuthenticated(true);
    } else {
      setError("Incorrect Password");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  if (authenticated) {
    return typeof children === "function" ? children(name) : children;
  }

  return (
    <div className="teacher-popup-overlay">
      <div className="teacher-popup-box">
        <div className="teacher-popup-icon">👩‍🏫</div>
        <h1>Teachers Portal</h1>
        <p>Enter your name and password to access resources.</p>

        <input
          type="text"
          placeholder="Enter Your Name"
          value={nameInput}
          onChange={(e) => { setNameInput(e.target.value); setError(""); }}
          onKeyDown={handleKeyDown}
          autoFocus
        />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => { setPassword(e.target.value); setError(""); }}
          onKeyDown={handleKeyDown}
        />

        {error && <span className="teacher-popup-error">{error}</span>}

        <button onClick={handleLogin}>Unlock Access</button>
      </div>
    </div>
  );
}
