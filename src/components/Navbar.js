import React from "react";
import { ArrowRight, Menu, X, ChevronRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "./Navbar.css";

export default function Navbar({
  navItems,
  activeSection,
  scrollTo,
  menuOpen,
  setMenuOpen,
}) {
  const location = useLocation();

  // Mobile menu slide/fade configurations
  const menuVariants = {
    hidden: { opacity: 0, y: -15, scale: 0.98 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 140,
        damping: 18,
        staggerChildren: 0.04,
        delayChildren: 0.05
      }
    },
    exit: { 
      opacity: 0, 
      y: -10, 
      scale: 0.99,
      transition: { duration: 0.15, ease: "easeIn" }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 15 },
    visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 120 } }
  };

  return (
    <header className="navbar">
      {/* BRAND */}
      <div className="brand">
        <img src="/logo.png" alt="Logo" className="logo" />

        <div>
          <div className="brand-title">Excellence</div>
          <div className="brand-subtitle">Empowering Young Voices</div>
        </div>
      </div>

      {/* DESKTOP NAV */}
      <nav className="nav-links">
        {navItems.map((item) => {
          if (
            item.id === "home" ||
            item.id === "about" ||
            item.id === "programs" ||
            item.id === "students" ||
            item.id === "trainers" ||
            item.id === "free-demo" ||
            item.id === "contact"
          ) {
            return (
              <Link
                key={item.id}
                to={item.path}
                className={`nav-btn ${
                  location.pathname === item.path ? "active" : ""
                }`}
              >
                {item.label}
              </Link>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className={`nav-btn ${
                activeSection === item.id ? "active" : ""
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* JOIN BUTTON */}
      <Link to="/contact" className="join-btn">
        Join Now <ArrowRight size={16} />
      </Link>

      {/* MOBILE MENU TOGGLE WITH ROTATION ANIMATION */}
      <motion.button 
        className="menu-btn" 
        onClick={() => setMenuOpen(!menuOpen)}
        animate={{ rotate: menuOpen ? 90 : 0 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
      >
        {menuOpen ? <X size={26} /> : <Menu size={26} />}
      </motion.button>

      {/* DYNAMIC ANIMATED MOBILE DROPDOWN - MOUNTED INSIDE HEADER */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div 
            className="mobile-menu"
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;

              if (
                item.id === "home" ||
                item.id === "about" ||
                item.id === "programs" ||
                item.id === "students" ||
                item.id === "trainers" ||
                item.id === "free-demo" ||
                item.id === "contact"
              ) {
                return (
                  <motion.div key={item.id} variants={itemVariants}>
                    <Link
                      to={item.path}
                      className={`mobile-nav-btn ${isActive ? "active" : ""}`}
                      onClick={() => setMenuOpen(false)}
                    >
                      {item.label}
                      <ChevronRight size={15} style={{ opacity: isActive ? 1 : 0.5 }} />
                    </Link>
                  </motion.div>
                );
              }

              const isSectionActive = activeSection === item.id;
              return (
                <motion.div key={item.id} variants={itemVariants}>
                  <button
                    onClick={() => {
                      scrollTo(item.id);
                      setMenuOpen(false);
                    }}
                    className={`mobile-nav-btn ${isSectionActive ? "active" : ""}`}
                  >
                    {item.label}
                    <ChevronRight size={15} style={{ opacity: isSectionActive ? 1 : 0.5 }} />
                  </button>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
