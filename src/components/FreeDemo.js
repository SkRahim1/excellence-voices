import React from "react";
import { ArrowRight } from "lucide-react";

export default function FreeDemo({ activeSection, scrollTo }) {
  return (
    <section
      id="free-demo"
      className={`section ${activeSection === "free-demo" ? "highlight" : ""}`}
    >
      <div className="container">
        <h2 className="heading">Free Demo Session</h2>

        <p className="para">
          Excellence provides a <b>Free Demo Session</b> only for school
          students. In this demo, we check speaking level, correct mistakes, and
          guide students with confidence-building activities.
        </p>

        <div className="demo-box">
          <h3>What Students Learn in Free Demo?</h3>

          <ul>
            <li>✔ Fluency check and speaking assessment</li>

            <li>✔ Pronunciation correction</li>

            <li>✔ Roleplay and Q&A practice</li>

            <li>✔ Confidence building activities</li>

            <li>✔ Personal roadmap for improvement</li>
          </ul>

          <div className="demo-contact">
            <div className="demo-contact-title">📞 Call Now</div>

            <div className="demo-number">+91 9284306159</div>

            <div className="demo-number">+91 6304300983</div>

            <div className="demo-number">+91 8125318601</div>
          </div>

          <button className="main-btn" onClick={() => scrollTo("contact")}>
            Book Free Demo <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
