import React from "react";

import { useParams } from "react-router-dom";

import studentsData from "../data/StudentsData";

export default function ContentPage() {
  const { classId, category, id } = useParams();

  const item = studentsData[classId]?.[category]?.find(
    (i) => i.id === Number(id),
  );

  if (!item) {
    return (
      <div className="container">
        <h1>Content Not Found</h1>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="heading">{item.title}</h1>

      <div
        className="content-box"
        style={{
          whiteSpace: "pre-line",
          textAlign: "left",
          marginTop: "30px",
          lineHeight: "1",
          fontSize: "20px",
          background: "#fff",
          padding: "35px",
          borderRadius: "18px",
          boxShadow: "0px 5px 15px rgba(0,0,0,0.08)",
        }}
      >
        {item.content.split("\n").map((line, index) => {
          const parts = line.split(":");

          if (parts.length > 1) {
            return (
              <p
                key={index}
                style={{
                  marginBottom: "6px",
                }}
              >
                <span
                  style={{
                    fontWeight: "bold",
                    color: "#0D2D59",
                    fontSize: "21px",
                  }}
                >
                  {parts[0]}:
                </span>{" "}
                <span>{parts.slice(1).join(":")}</span>
              </p>
            );
          }

          return <p key={index}>{line}</p>;
        })}
      </div>
    </div>
  );
}
