import React from "react";

export default function About({ activeSection }) {
  return (
    <section
      id="about"
      className={`section ${activeSection === "about" ? "highlight" : ""}`}
    >
      <div className="container">
        <h2 className="heading">About Excellence</h2>

        <p className="para">
          Excellence is a professional English communication training company
          that works exclusively with school students, focusing on confidence,
          fluency, and personality development.
        </p>

        <p className="para">
          We conduct structured training sessions only in schools, helping
          students speak naturally and correctly.
        </p>

        <div className="tags">
          <span className="tag">Only for School Students</span>
          <span className="tag">School Training</span>
          <span className="tag">Spoken English</span>
          <span className="tag">Stage Confidence</span>
        </div>
      </div>
    </section>
  );
}
