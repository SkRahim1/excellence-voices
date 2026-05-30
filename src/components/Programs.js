import React from "react";
import ServiceCard from "./ServiceCard";
import { motion } from "framer-motion";

export default function Programs({ activeSection, services }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.2,
      },
    },
  };

  return (
    <section
      id="programs"
      className={`section light ${
        activeSection === "programs" ? "highlight" : ""
      }`}
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
          Programs & Services
        </motion.h2>

        {/* Subtitle */}
        <motion.p 
          className="para"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          Practical training sessions designed only for school students.
        </motion.p>

        {/* Staggered Cards Grid */}
        <motion.div 
          className="cards"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {services.map((service) => (
            <ServiceCard key={service.title} service={service} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
