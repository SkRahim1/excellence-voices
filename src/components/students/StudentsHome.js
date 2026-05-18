import React from "react";

import { Link } from "react-router-dom";

export default function StudentsHome() {
  const classes = [
    "class-1",
    "class-2",
    "class-3",
    "class-4",
    "class-5",
    "class-6",
    "class-7",
    "class-8",
    "class-9",
  ];

  return (
    <div className="container">
      <h1 className="heading">Students Portal</h1>

      <p className="para">
        Select your class to explore roleplays, activities, skits, and stories.
      </p>

      <div className="cards">
        {classes.map((cls) => (
          <Link key={cls} to={`/students/${cls}`} className="card">
            <h2>{cls.replace("-", " ").toUpperCase()}</h2>
          </Link>
        ))}
      </div>
    </div>
  );
}
