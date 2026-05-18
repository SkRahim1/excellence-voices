import React from "react";

import { ArrowRight, Menu, X } from "lucide-react";

import { Link, useLocation } from "react-router-dom";

export default function Navbar({
  navItems,
  activeSection,
  scrollTo,
  menuOpen,
  setMenuOpen,
}) {
  const location = useLocation();

  return (
    <>
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
            // ROUTE LINKS
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

            // FALLBACK BUTTON
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

        {/* MOBILE MENU BUTTON */}
        <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </header>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="mobile-menu">
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
                  className={`mobile-nav-btn ${
                    location.pathname === item.path ? "active" : ""
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              );
            }

            return (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`mobile-nav-btn ${
                  activeSection === item.id ? "active" : ""
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </>
  );
}
