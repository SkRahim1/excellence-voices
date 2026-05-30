import React from "react";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function FreeDemo({ activeSection, scrollTo }) {
  return (
    <section
      id="free-demo"
      className={`section ${activeSection === "free-demo" ? "highlight" : ""}`}
    >
      <div className="container">
        {/* Title */}
        <motion.h2 
          className="heading"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
        >
          Free Demo Session
        </motion.h2>

        {/* Subtitle */}
        <motion.p 
          className="para"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          Excellence provides a <b>Free Demo Session</b> only for school
          students. In this demo, we check speaking level, correct mistakes, and
          guide students with confidence-building activities.
        </motion.p>

        {/* Floating Demo Details Box */}
        <motion.div 
          className="demo-box"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ type: "spring", stiffness: 70, damping: 15, delay: 0.2 }}
        >
          <h3>What Students Learn in Free Demo?</h3>

          <ul>
            <li>Fluency check and speaking assessment</li>

            <li>Pronunciation correction</li>

            <li>Roleplay and Q&A practice</li>

            <li>Confidence building activities</li>

            <li>Personal roadmap for improvement</li>
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
        </motion.div>
      </div>
    </section>
  );
}
