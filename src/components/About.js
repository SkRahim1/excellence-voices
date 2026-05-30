import React from "react";
import { motion } from "framer-motion";

export default function About({ activeSection }) {
  // Stagger animation for the badges
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const tagVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 10 },
    show: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 100 }
    },
  };

  return (
    <section
      id="about"
      className={`section ${activeSection === "about" ? "highlight" : ""}`}
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
          About Excellence
        </motion.h2>

        {/* Paragraph 1 */}
        <motion.p 
          className="para"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          Excellence is a professional English communication training company
          that works exclusively with school students, focusing on confidence,
          fluency, and personality development.
        </motion.p>

        {/* Paragraph 2 */}
        <motion.p 
          className="para"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          We conduct structured training sessions only in schools, helping
          students speak naturally and correctly.
        </motion.p>

        {/* Staggered Tag Badges */}
        <motion.div 
          className="tags"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.span className="tag" variants={tagVariants}>Only for School Students</motion.span>
          <motion.span className="tag" variants={tagVariants}>School Training</motion.span>
          <motion.span className="tag" variants={tagVariants}>Spoken English</motion.span>
          <motion.span className="tag" variants={tagVariants}>Stage Confidence</motion.span>
        </motion.div>
      </div>
    </section>
  );
}
