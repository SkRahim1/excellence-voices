import React, { useState, useEffect } from "react";

import { Link, useParams } from "react-router-dom";
import { getClassCategoryItems } from "../../services/dataService";

export default function CategoryPage() {
  const { classId, category } = useParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    getClassCategoryItems(classId, category).then((data) => {
      if (active) {
        setItems(data);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [classId, category]);

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
        {loading ? (
          <div style={{ textAlign: "center", width: "100%", padding: "40px 0" }}>
            <p style={{ color: "#666", fontSize: "1.1rem" }}>Loading lessons...</p>
          </div>
        ) : items.length > 0 ? (
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
