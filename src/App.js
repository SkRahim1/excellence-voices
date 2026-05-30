import React, { useState } from "react";
import "./App.css";

import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import { Mic, School, Users, Sparkles } from "lucide-react";
import Popup from "./components/Popup";
import Topbar from "./components/Topbar";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Programs from "./components/Programs";
// import Students from "./components/Students";
import Trainers from "./components/Trainers";
import FreeDemo from "./components/FreeDemo";
import Footer from "./components/Footer";

// students content
import StudentsHome from "./components/students/StudentsHome";
import ClassPage from "./components/students/ClassPage";
import CategoryPage from "./components/students/CategoryPage";
import ContentPage from "./components/students/ContentPage";
//trainer route protection
import TrainerProtectedPopup from "./components/TrainerProtectedPopup";
import VoiceBot from "./components/students/VoiceBot";
/* PASSWORD PROTECTION */
function ProtectedRoute({ children }) {
  const [password, setPassword] = useState("");

  // CHECK SAVED LOGIN
  const savedLogin = JSON.parse(localStorage.getItem("studentAccess"));

  // CHECK IF LOGIN IS STILL VALID
  const isStillValid =
    savedLogin && savedLogin.loggedIn && Date.now() < savedLogin.expiry;

  const [isAuthenticated, setIsAuthenticated] = useState(isStillValid);

  const correctPassword = "excellencestudents"; // change password here

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password === correctPassword) {
      // 1 DAY LOGIN
      const oneDay = 24 * 60 * 60 * 1000;

      localStorage.setItem(
        "studentAccess",
        JSON.stringify({
          loggedIn: true,
          expiry: Date.now() + oneDay,
        }),
      );

      setIsAuthenticated(true);
    } else {
      alert("Wrong Password");
    }
  };

  // REMOVE LOGIN IF EXPIRED
  if (!isStillValid) {
    localStorage.removeItem("studentAccess");
  }

  if (!isAuthenticated) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#f4f4f4",
          padding: "20px",
        }}
      >
        <form
          onSubmit={handleSubmit}
          style={{
            background: "#fff",
            padding: "40px",
            borderRadius: "18px",
            boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
            width: "100%",
            maxWidth: "400px",
          }}
        >
          <h2
            style={{
              textAlign: "center",
              marginBottom: "25px",
              color: "#0D2D59",
            }}
          >
            Student Access
          </h2>

          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "12px",
              border: "1px solid #ccc",
              marginBottom: "20px",
              fontSize: "16px",
              outline: "none",
            }}
          />

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "14px",
              border: "none",
              borderRadius: "12px",
              background: "#0D2D59",
              color: "#fff",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Enter
          </button>
        </form>
      </div>
    );
  }

  return children;
}

export default function App() {
  const location = useLocation();
  const [activeSection, setActiveSection] = useState("home");

  const [menuOpen, setMenuOpen] = useState(false);

  const scrollTo = (id) => {
    setActiveSection(id);
    setMenuOpen(false);

    const el = document.getElementById(id);

    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const navItems = [
    {
      label: "Home",
      id: "home",
      path: "/",
    },

    {
      label: "About",
      id: "about",
      path: "/about",
    },

    {
      label: "Programs",
      id: "programs",
      path: "/programs",
    },

    {
      label: "Students",
      id: "students",
      path: "/students",
    },

    {
      label: "Trainers",
      id: "trainers",
      path: "/trainers",
    },

    {
      label: "Free Demo",
      id: "free-demo",
      path: "/free-demo",
    },

    {
      label: "Contact",
      id: "contact",
      path: "/contact",
    },
  ];

  const services = [
    {
      title: "Spoken English Training",

      desc: "Fluency-focused training.",

      icon: <Mic size={30} color="#0D2D59" />,
    },

    {
      title: "Personality Development",

      desc: "Confidence building training.",

      icon: <Sparkles size={30} color="#EBA925" />,
    },

    {
      title: "School Training Programs",

      desc: "Structured communication sessions.",

      icon: <School size={30} color="#0D2D59" />,
    },

    {
      title: "Public Speaking & Events",

      desc: "Debates and roleplays.",

      icon: <Users size={30} color="#EBA925" />,
    },
  ];

  return (
    <div className="app">
      <Topbar />

      <Navbar
        navItems={navItems}
        activeSection={activeSection}
        scrollTo={scrollTo}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
      />
      <>
        {/* BACKGROUND BLOBS */}
        <div className="bg-blur bg1"></div>
        <div className="bg-blur bg2"></div>
        <div className="bg-blur bg3"></div>

        <Popup />
        {location.pathname.startsWith("/students") && <VoiceBot />}
        <Routes>
          {/* HOME */}
          <Route
            path="/"
            element={
              <>
                <Hero scrollTo={scrollTo} activeSection={activeSection} />

                <About activeSection={activeSection} />

                <Programs activeSection={activeSection} services={services} />

                <FreeDemo activeSection={activeSection} scrollTo={scrollTo} />

                <Footer />
              </>
            }
          />

          {/* ABOUT */}
          <Route
            path="/about"
            element={<About activeSection={activeSection} />}
          />

          {/* PROGRAMS */}
          <Route
            path="/programs"
            element={
              <Programs activeSection={activeSection} services={services} />
            }
          />

          {/* STUDENTS PROTECTED */}
          <Route
            path="/students"
            element={
              <ProtectedRoute>
                <StudentsHome />
              </ProtectedRoute>
            }
          />

          <Route
            path="/students/:classId"
            element={
              <ProtectedRoute>
                <ClassPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/students/:classId/:category"
            element={
              <ProtectedRoute>
                <CategoryPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/students/:classId/:category/:id"
            element={
              <ProtectedRoute>
                <ContentPage />
              </ProtectedRoute>
            }
          />

          {/* TRAINERS */}
          <Route
            path="/trainers"
            element={
              <TrainerProtectedPopup>
                <Trainers
                  navItems={navItems}
                  activeSection={activeSection}
                  scrollTo={scrollTo}
                  menuOpen={menuOpen}
                  setMenuOpen={setMenuOpen}
                />
              </TrainerProtectedPopup>
            }
          />

          {/* FREE DEMO */}
          <Route
            path="/free-demo"
            element={
              <FreeDemo activeSection={activeSection} scrollTo={scrollTo} />
            }
          />

          {/* CONTACT */}
          <Route path="/contact" element={<Footer />} />

          {/* FALLBACK */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </>
    </div>
  );
}
