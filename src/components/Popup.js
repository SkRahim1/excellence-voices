import React, { useState, useEffect } from "react";

import { Sparkles, GraduationCap, Mic, BookOpen, X } from "lucide-react";

import "./Popup.css";

export default function Popup() {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const alreadySeen = sessionStorage.getItem("popupShown");

    if (!alreadySeen) {
      setTimeout(() => {
        setShowPopup(true);

        sessionStorage.setItem("popupShown", "true");
      }, 700);
    }
  }, []);

  if (!showPopup) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-box">
        {/* CLOSE */}
        <button className="close-btn" onClick={() => setShowPopup(false)}>
          <X size={22} />
        </button>

        {/* TOP ICON */}
        <div className="popup-icon">
          <Sparkles size={34} />
        </div>

        {/* TITLE */}
        <h1>
          Welcome to
          <span> Excellence Voices</span>
        </h1>

        {/* SUBTITLE */}
        <p className="popup-subtitle">
          Empowering students with confidence, communication, public speaking,
          and spoken English skills.
        </p>

        {/* FEATURES */}
        <div className="popup-features">
          <div className="feature-card">
            <Mic size={26} />

            <span>AI-Based Speaking Practice</span>
          </div>

          <div className="feature-card">
            <BookOpen size={26} />

            <span>Stories, Skits & Activities</span>
          </div>

          <div className="feature-card">
            <GraduationCap size={26} />

            <span>Designed for School Students</span>
          </div>
        </div>

        {/* BUTTONS */}
        <div className="popup-buttons">
          <button
            className="popup-main-btn"
            onClick={() => setShowPopup(false)}
          >
            Explore Platform
          </button>

          <button
            className="popup-secondary-btn"
            onClick={() => (window.location.href = "/free-demo")}
          >
            Book Free Demo
          </button>
        </div>

        {/* FOOTER */}
        <div className="popup-footer">
          Trusted by Schools • Built for Student Confidence
        </div>
      </div>
    </div>
  );
}
