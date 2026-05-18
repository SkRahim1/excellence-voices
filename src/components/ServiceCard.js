import React from "react";

export default function ServiceCard({ service }) {
  return (
    <div className="card">
      <div className="icon">{service.icon}</div>

      <h3>{service.title}</h3>

      <p>{service.desc}</p>
    </div>
  );
}
