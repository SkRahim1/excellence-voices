import React from "react";
import ServiceCard from "./ServiceCard";

export default function Programs({ activeSection, services }) {
  return (
    <section
      id="programs"
      className={`section light ${
        activeSection === "programs" ? "highlight" : ""
      }`}
    >
      <div className="container">
        <h2 className="heading">Programs & Services</h2>

        <p className="para">
          Practical training sessions designed only for school students.
        </p>

        <div className="cards">
          {services.map((service) => (
            <ServiceCard key={service.title} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
}
