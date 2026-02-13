import React, { useState } from "react";
import "./App.css";
import {
  Mic,
  School,
  Users,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  Star,
  Menu,
  X,
} from "lucide-react";

export default function App() {
  const [activeSection, setActiveSection] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollTo = (id) => {
    setActiveSection(id);
    setMenuOpen(false);

    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const navItems = [
    { label: "Home", id: "home" },
    { label: "About", id: "about" },
    { label: "Programs", id: "programs" },
    { label: "Free Demo", id: "free-demo" },
    { label: "Contact", id: "contact" },
  ];

  const services = [
    {
      title: "Spoken English Training",
      desc: "Fluency-focused training with daily speaking practice and real-life conversation patterns.",
      icon: <Mic size={30} color="#0D2D59" />,
    },
    {
      title: "Personality Development",
      desc: "Confidence building, body language, stage presence, and effective communication habits.",
      icon: <Sparkles size={30} color="#EBA925" />,
    },
    {
      title: "School Training Programs",
      desc: "We visit schools and conduct structured communication sessions for students.",
      icon: <School size={30} color="#0D2D59" />,
    },
    {
      title: "Public Speaking & Events",
      desc: "Debates, speeches, roleplays, storytelling competitions, and stage confidence practice.",
      icon: <Users size={30} color="#EBA925" />,
    },
  ];

  return (
    <div className="app">
      {/* Top Bar */}
      <div className="topbar">
        <div className="topbar-left">
          <span>
            <Phone size={14} /> +91 9284306159
          </span>
          <span>
            <Mail size={14} /> excellence@gmail.com
          </span>
        </div>

        <div className="topbar-right">
          <MapPin size={14} /> India
        </div>
      </div>

      {/* Navbar */}
      <header className="navbar">
        <div className="brand">
          <img src="/logo.png" alt="Excellence Logo" className="logo" />

          <div>
            <div className="brand-title">Excellence</div>
            <div className="brand-subtitle">Empowering Young Voices</div>
          </div>
        </div>

        {/* Desktop Menu */}
        <nav className="nav-links">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className={`nav-btn ${activeSection === item.id ? "active" : ""}`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <button className="join-btn" onClick={() => scrollTo("contact")}>
          Join Now <ArrowRight size={16} />
        </button>

        {/* Mobile Menu Icon */}
        <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </header>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="mobile-menu">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className={`mobile-nav-btn ${
                activeSection === item.id ? "active" : ""
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}

      {/* HOME */}
      <section
        id="home"
        className={`section light ${
          activeSection === "home" ? "highlight" : ""
        }`}
      >
        <div className="container">
          <div className="badge">
            <Star size={16} color="#EBA925" />
            Trusted by 20 Schools
          </div>

          <h1 className="hero-title">
            Speak English with <span>Confidence</span>
          </h1>

          <p className="para">
            Excellence provides communication training exclusively for school
            students through practical speaking sessions, roleplays, debates,
            and daily conversation practice.
          </p>

          <div className="btn-row">
            <button className="main-btn" onClick={() => scrollTo("programs")}>
              Explore Programs <ArrowRight size={18} />
            </button>

            <button
              className="outline-btn"
              onClick={() => scrollTo("free-demo")}
            >
              Book Free Demo <Sparkles size={18} />
            </button>
          </div>

          <div className="stats-row">
            <div className="stat-box">
              <h2>500+</h2>
              <p>Students Trained</p>
            </div>

            <div className="stat-box">
              <h2>50+</h2>
              <p>School Visits</p>
            </div>

            <div className="stat-box">
              <h2>100%</h2>
              <p>Daily Practice</p>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section
        id="about"
        className={`section ${activeSection === "about" ? "highlight" : ""}`}
      >
        <div className="container">
          <h2 className="heading">About Excellence</h2>

          <p className="para">
            Excellence is a professional English communication training company
            that works exclusively with school students, focusing on confidence,
            fluency, and personality development.
          </p>

          <p className="para">
            We conduct structured training sessions only in schools, helping
            students speak naturally and correctly.
          </p>

          <div className="tags">
            <span className="tag">Only for School Students</span>
            <span className="tag">School Training</span>
            <span className="tag">Spoken English</span>
            <span className="tag">Stage Confidence</span>
          </div>
        </div>
      </section>

      {/* PROGRAMS */}
      <section
        id="programs"
        className={`section light ${
          activeSection === "programs" ? "highlight" : ""
        }`}
      >
        <div className="container">
          <h2 className="heading">Programs & Services</h2>
          <p className="para">
            Practical training sessions designed only for school students.
          </p>

          <div className="cards">
            {services.map((s) => (
              <div className="card" key={s.title}>
                <div className="icon">{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FREE DEMO */}
      <section
        id="free-demo"
        className={`section ${
          activeSection === "free-demo" ? "highlight" : ""
        }`}
      >
        <div className="container">
          <h2 className="heading">Free Demo Session</h2>

          <p className="para">
            Excellence provides a <b>Free Demo Session</b> only for school
            students. In this demo, we check speaking level, correct mistakes,
            and guide students with confidence-building activities.
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

            <h2 className="call-now">
              📞 Call Now: <span>+91 9284306159</span>
            </h2>

            <button className="main-btn" onClick={() => scrollTo("contact")}>
              Book Free Demo <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section
        id="contact"
        className={`section dark ${
          activeSection === "contact" ? "highlight-dark" : ""
        }`}
      >
        <div className="container">
          <h2 className="heading white">Contact Us</h2>

          <p className="para white">
            We provide training only in schools. Contact us for school training
            programs.
          </p>

          <div className="contact-info">
            <p>📞 +91 9284306159</p>
            <p>📧 excellence@gmail.com</p>
            <p>📍 India</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        © {new Date().getFullYear()} Excellence - Empowering Young Voices. All
        Rights Reserved.
      </footer>
    </div>
  );
}
