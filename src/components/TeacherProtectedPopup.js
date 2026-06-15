import React, { useState } from "react";
import "./TeacherProtectedPopup.css";

export default function TeacherProtectedPopup({ children }) {
  const [authenticated, setAuthenticated] = useState(
    localStorage.getItem("teacherAuth") === "true"
  );
  const [name, setName] = useState(
    localStorage.getItem("teacherName") || ""
  );
  const [subject, setSubject] = useState(
    localStorage.getItem("teacherSubject") || "english"
  );
  const [nameInput, setNameInput] = useState("");
  const [subjectInput, setSubjectInput] = useState("english");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (!nameInput.trim()) {
      setError("Please enter your name");
      return;
    }
    if (password === "excellenceteachers24") {
      localStorage.setItem("teacherAuth", "true");
      localStorage.setItem("teacherName", nameInput.trim());
      localStorage.setItem("teacherSubject", subjectInput);
      setName(nameInput.trim());
      setSubject(subjectInput);
      setAuthenticated(true);
    } else {
      setError("Incorrect Password");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  const handleLogout = () => {
    localStorage.removeItem("teacherAuth");
    localStorage.removeItem("teacherName");
    localStorage.removeItem("teacherSubject");
    setName("");
    setSubject("english");
    setAuthenticated(false);
  };

  if (authenticated) {
    return typeof children === "function" ? children(name, subject, handleLogout) : children;
  }

  return (
    <div className="teacher-popup-overlay">
      <div className="teacher-popup-box">
        <div className="teacher-popup-icon">👩‍🏫</div>
        <h1>Teachers Portal</h1>
        <p>Enter details to access your portal.</p>

        <input
          type="text"
          placeholder="Enter Your Name"
          value={nameInput}
          onChange={(e) => { setNameInput(e.target.value); setError(""); }}
          onKeyDown={handleKeyDown}
          autoFocus
        />

        <select
          value={subjectInput}
          onChange={(e) => setSubjectInput(e.target.value)}
        >
          <option value="english">English</option>
          <option value="mathematics">Mathematics</option>
          <option value="science">Science</option>
          <option value="evs">EVS</option>
          <option value="socialStudies">Social Studies</option>
          <option value="computerScience">Computer Science</option>
          <option value="physicalTraining">Physical Training</option>
        </select>

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => { setPassword(e.target.value); setError(""); }}
          onKeyDown={handleKeyDown}
        />

        {error && <span className="teacher-popup-error">{error}</span>}

        <button onClick={handleLogin}>Unlock Access</button>

        <div className="teacher-popup-brand" style={{ fontSize: "0.8em", opacity: 0.7, marginTop: "15px", textAlign: "center" }}>
          A product of <a href="https://renvixteach.in" target="_blank" rel="noopener noreferrer" style={{ color: "#38bdf8", textDecoration: "underline" }}>Renvix Technologies</a>
        </div>
      </div>
    </div>
  );
}
