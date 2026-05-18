import React from "react";

import { Link, useParams } from "react-router-dom";

// import studentsData from "../data/StudentData";
import studentsData from "../data/StudentsData";

export default function CategoryPage() {
  const { classId, category } = useParams();

  const items = studentsData[classId]?.[category] || [];

  return (
    <div className="container">
      <h1 className="heading">{classId.replace("-", " ").toUpperCase()}</h1>

      <h2
        style={{
          marginTop: "10px",
        }}
      >
        {category.toUpperCase()}
      </h2>

      <div className="cards">
        {items.length > 0 ? (
          items.map((item) => (
            <Link
              key={item.id}
              to={`/students/${classId}/${category}/${item.id}`}
              className="card"
            >
              <h3>{item.title}</h3>
            </Link>
          ))
        ) : (
          <p
            style={{
              marginTop: "30px",
            }}
          >
            No content added yet.
          </p>
        )}
      </div>
    </div>
  );
}
