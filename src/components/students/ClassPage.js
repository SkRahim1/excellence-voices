import React from "react";

import { Link, useParams } from "react-router-dom";

export default function ClassPage() {
  const { classId } = useParams();

  const categories = [
    "roleplays",
    "activities",
    "skits",
    "stories",
    "goodThoughts",
    "publicSpeaking",
    "stockSentences",
  ];

  return (
    <div className="container">
      <h1 className="heading">{classId.replace("-", " ").toUpperCase()}</h1>

      <p className="para">Choose a category.</p>

      <div className="cards">
        {categories.map((cat) => (
          <Link key={cat} to={`/students/${classId}/${cat}`} className="card">
            <h2>
              {cat === "goodThoughts"
                ? "GOOD THOUGHTS"
                : cat === "publicSpeaking"
                  ? "PUBLIC SPEAKING"
                  : cat === "stockSentences"
                    ? "STOCK SENTENCES"
                    : cat.toUpperCase()}
            </h2>
          </Link>
        ))}
      </div>
    </div>
  );
}
