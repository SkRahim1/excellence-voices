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
import TeacherProtectedPopup from "./components/TeacherProtectedPopup";
import VoiceBot from "./components/students/VoiceBot";
import TeachersHome from "./components/teachers/TeachersHome";
import PrincipalProtectedPopup from "./components/PrincipalProtectedPopup";
import PrincipalsHome from "./components/principals/PrincipalsHome";
/* PASSWORD PROTECTION */
/* Check if student is currently authenticated (used to gate VoiceBot too) */
function getStudentAuthStatus() {
  const savedLogin = JSON.parse(localStorage.getItem("studentAccess"));
  return savedLogin && savedLogin.loggedIn;
}

function ProtectedRoute({ children, isAuthenticated, setIsAuthenticated }) {
  const [password, setPassword] = useState("");

  const correctPassword = "excellencestudents"; // change password here

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password === correctPassword) {
      localStorage.setItem(
        "studentAccess",
        JSON.stringify({
          loggedIn: true,
        }),
      );

      setIsAuthenticated(true);
    } else {
      alert("Wrong Password");
    }
  };

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

  // Student auth state — lifted up here so VoiceBot can be gated behind it
  const [isStudentAuthenticated, setIsStudentAuthenticated] = useState(getStudentAuthStatus);

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
      label: "Teachers",
      id: "teachers",
      path: "/teachers",
    },

    {
      label: "Principals",
      id: "principals",
      path: "/principals",
    },

    {
      label: "Pro Games",
      id: "pro-games",
      path: "https://pro.excellencevoices.in/",
      isExternal: true,
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
        {/* Only show VoiceBot after student password is successfully entered */}
        {location.pathname.startsWith("/students") && isStudentAuthenticated && <VoiceBot />}
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
              <ProtectedRoute isAuthenticated={isStudentAuthenticated} setIsAuthenticated={setIsStudentAuthenticated}>
                <StudentsHome />
              </ProtectedRoute>
            }
          />

          <Route
            path="/students/:classId"
            element={
              <ProtectedRoute isAuthenticated={isStudentAuthenticated} setIsAuthenticated={setIsStudentAuthenticated}>
                <ClassPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/students/:classId/:category"
            element={
              <ProtectedRoute isAuthenticated={isStudentAuthenticated} setIsAuthenticated={setIsStudentAuthenticated}>
                <CategoryPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/students/:classId/:category/:id"
            element={
              <ProtectedRoute isAuthenticated={isStudentAuthenticated} setIsAuthenticated={setIsStudentAuthenticated}>
                <ContentPage />
              </ProtectedRoute>
            }
          />

          {/* TEACHERS */}
          <Route
            path="/teachers"
            element={
              <TeacherProtectedPopup>
                {(teacherName, teacherSubject, teacherSchoolCode, teacherMobileNumber, handleLogout) => (
                  <TeachersHome 
                    teacherName={teacherName} 
                    teacherSubject={teacherSubject} 
                    teacherSchoolCode={teacherSchoolCode}
                    teacherMobileNumber={teacherMobileNumber}
                    onLogout={handleLogout} 
                  />
                )}
              </TeacherProtectedPopup>
            }
          />

          {/* PRINCIPALS */}
          <Route
            path="/principals"
            element={
              <PrincipalProtectedPopup>
                {(principalName, principalSchoolCode, principalMobileNumber, handleLogout) => (
                  <PrincipalsHome 
                    principalName={principalName} 
                    principalSchoolCode={principalSchoolCode} 
                    principalMobileNumber={principalMobileNumber}
                    onLogout={handleLogout} 
                  />
                )}
              </PrincipalProtectedPopup>
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
