import React from "react";
import { ArrowRight, Sparkles, Star } from "lucide-react";
import { motion } from "framer-motion";

export default function Hero({ scrollTo, activeSection }) {
  // Staggered layout animations for stats
  const statsContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.5,
      },
    },
  };

  const statItem = {
    hidden: { opacity: 0, y: 25 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 15 }
    },
  };

  return (
    <section
      id="home"
      className={`section light ${activeSection === "home" ? "highlight" : ""}`}
    >
      <div className="container">
        {/* Trusted Badge */}
        <motion.div 
          className="badge"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 120 }}
        >
          <Star size={16} color="#EBA925" fill="#EBA925" />
          Trusted by 20 Schools
        </motion.div>

        {/* Title */}
        <motion.h1 
          className="hero-title"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          Speak English with <span>Confidence</span>
        </motion.h1>

        {/* Description */}
        <motion.p 
          className="para"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25, ease: "easeOut" }}
        >
          Excellence provides communication training exclusively for school
          students through practical speaking sessions, roleplays, debates, and
          daily conversation practice.
        </motion.p>

        {/* Action Buttons */}
        <motion.div 
          className="btn-row"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        >
          <button className="main-btn" onClick={() => scrollTo("programs")}>
            Explore Programs <ArrowRight size={18} />
          </button>

          <button className="outline-btn" onClick={() => scrollTo("free-demo")}>
            Book Free Demo <Sparkles size={18} />
          </button>
        </motion.div>

        {/* Stats Row with Staggered Entrance */}
        <motion.div 
          className="stats-row"
          variants={statsContainer}
          initial="hidden"
          animate="show"
        >
          <motion.div className="stat-box" variants={statItem}>
            <h2>5000+</h2>
            <p>Students Trained</p>
          </motion.div>

          <motion.div className="stat-box" variants={statItem}>
            <h2>50+</h2>
            <p>School Visits</p>
          </motion.div>

          <motion.div className="stat-box" variants={statItem}>
            <h2>100%</h2>
            <p>Daily Practice</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
