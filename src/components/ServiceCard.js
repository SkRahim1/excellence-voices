import React from "react";
import { motion } from "framer-motion";

export default function ServiceCard({ service }) {
  const cardVariants = {
    hidden: { opacity: 0, y: 35 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 90, damping: 14 }
    }
  };

  return (
    <motion.div 
      className="card" 
      variants={cardVariants}
      whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(13, 45, 89, 0.12)" }}
    >
      <div className="icon">{service.icon}</div>

      <h3>{service.title}</h3>

      <p>{service.desc}</p>
    </motion.div>
  );
}
