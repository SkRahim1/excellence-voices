import React from "react";
import { motion } from "framer-motion";
import { Cpu, Handshake, BookOpen, GraduationCap } from "lucide-react";
import "./About.css";

export default function About({ activeSection }) {
  // Stagger animation for the badges & team cards
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
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

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    },
  };

  const teamMembers = [
    {
      name: "Rahim Shaikh",
      role: "Co-Founder & Head of Technology",
      qualification: "BCA · BPCH · M.A. English",
      icon: <Cpu size={26} color="#0D2D59" />,
      initials: "RS",
    },
    {
      name: "Raviteja Pendem",
      role: "Co-Founder & Head of School Partnerships",
      qualification: "B.Tech",
      icon: <Handshake size={26} color="#0D2D59" />,
      initials: "RP",
    },
    {
      name: "Lakshya Rana",
      role: "Co-Founder & Training & Operations Lead",
      qualification: "B.A. English",
      icon: <BookOpen size={26} color="#0D2D59" />,
      initials: "LR",
    },
  ];

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

        {/* Leadership Team Section */}
        <motion.div 
          className="leadership-section"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <h3 className="subheading">Meet Our Co-Founders</h3>
          <p className="subpara">
            Driven by passion and expertise to empower young voices across schools.
          </p>

          <motion.div 
            className="team-grid"
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
          >
            {teamMembers.map((member) => (
              <motion.div key={member.name} className="team-card" variants={cardVariants}>
                <div className="team-avatar-wrapper">
                  <div className="team-avatar">
                    <span>{member.initials}</span>
                  </div>
                  <div className="team-icon-badge">
                    {member.icon}
                  </div>
                </div>
                <h4 className="team-name">{member.name}</h4>
                <p className="team-role">{member.role}</p>
                <div className="team-qualification">
                  <GraduationCap size={15} className="qual-icon" />
                  <span>{member.qualification}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
