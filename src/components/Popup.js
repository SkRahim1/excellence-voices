import React, { useState, useEffect } from "react";
import { Sparkles, GraduationCap, Mic, BookOpen, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import "./Popup.css";

export default function Popup() {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const alreadySeen = sessionStorage.getItem("popupShown");

    if (!alreadySeen) {
      const timer = setTimeout(() => {
        setShowPopup(true);
        sessionStorage.setItem("popupShown", "true");
      }, 700);
      return () => clearTimeout(timer);
    }
  }, []);

  // Card list stagger variants
  const featuresContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const featureItem = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <AnimatePresence>
      {showPopup && (
        <motion.div 
          className="popup-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div 
            className="popup-box"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", stiffness: 85, damping: 15 }}
          >
            {/* CLOSE */}
            <button className="close-btn" onClick={() => setShowPopup(false)}>
              <X size={22} />
            </button>

            {/* TOP ICON */}
            <motion.div 
              className="popup-icon"
              initial={{ rotate: -15, scale: 0.8 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ delay: 0.15, type: "spring", stiffness: 120 }}
            >
              <Sparkles size={34} />
            </motion.div>

            {/* TITLE */}
            <h1>
              Welcome to
              <span> Excellence Voices</span>
            </h1>

            {/* SUBTITLE */}
            <p className="popup-subtitle">
              Empowering students with confidence, communication, public speaking,
              and spoken English skills.
            </p>

            {/* FEATURES */}
            <motion.div 
              className="popup-features"
              variants={featuresContainer}
              initial="hidden"
              animate="show"
            >
              <motion.div className="feature-card" variants={featureItem}>
                <Mic size={26} />
                <span>AI-Based Speaking Practice</span>
              </motion.div>

              <motion.div className="feature-card" variants={featureItem}>
                <BookOpen size={26} />
                <span>Stories, Skits & Activities</span>
              </motion.div>

              <motion.div className="feature-card" variants={featureItem}>
                <GraduationCap size={26} />
                <span>Designed for School Students</span>
              </motion.div>
            </motion.div>

            {/* BUTTONS */}
            <div className="popup-buttons">
              <button
                className="popup-main-btn"
                onClick={() => setShowPopup(false)}
              >
                Explore Platform
              </button>

              <button
                className="popup-secondary-btn"
                onClick={() => (window.location.href = "/free-demo")}
              >
                Book Free Demo
              </button>
            </div>

            {/* FOOTER */}
            <div className="popup-footer">
              Trusted by Schools • Built for Student Confidence
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
