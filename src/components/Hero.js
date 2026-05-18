import React from "react";
import { ArrowRight, Sparkles, Star } from "lucide-react";

export default function Hero({ scrollTo, activeSection }) {
  return (
    <section
      id="home"
      className={`section light ${activeSection === "home" ? "highlight" : ""}`}
    >
      <div className="container">
        <div className="badge">
          <Star size={16} color="#EBA925" />
          Trusted by 20 Schools
        </div>

        <h1 className="hero-title">
          Speak English with <span>Confidence</span>
        </h1>

        <p className="para">
          Excellence provides communication training exclusively for school
          students through practical speaking sessions, roleplays, debates, and
          daily conversation practice.
        </p>

        <div className="btn-row">
          <button className="main-btn" onClick={() => scrollTo("programs")}>
            Explore Programs <ArrowRight size={18} />
          </button>

          <button className="outline-btn" onClick={() => scrollTo("free-demo")}>
            Book Free Demo <Sparkles size={18} />
          </button>
        </div>

        <div className="stats-row">
          <div className="stat-box">
            <h2>5000+</h2>
            <p>Students Trained</p>
          </div>

          <div className="stat-box">
            <h2>50+</h2>
            <p>School Visits</p>
          </div>

          <div className="stat-box">
            <h2>100%</h2>
            <p>Daily Practice</p>
          </div>
        </div>
      </div>
    </section>
  );
}
