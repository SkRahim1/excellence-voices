import React, { useState } from "react";
import "./App.css";

import { Routes, Route } from "react-router-dom";

import { Mic, School, Users, Sparkles } from "lucide-react";

import Topbar from "./components/Topbar";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Programs from "./components/Programs";
import Students from "./components/Students";
import Trainers from "./components/Trainers";
import FreeDemo from "./components/FreeDemo";
import Footer from "./components/Footer";
//students content
import StudentsHome from "./components/students/StudentsHome";
import ClassPage from "./components/students/ClassPage";
import CategoryPage from "./components/students/CategoryPage";
import ContentPage from "./components/students/ContentPage";
export default function App() {
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

        {/* STUDENTS */}
        {/* <Route
          path="/students"
          element={
            <Students
              navItems={navItems}
              activeSection={activeSection}
              scrollTo={scrollTo}
              menuOpen={menuOpen}
              setMenuOpen={setMenuOpen}
            />
          }
        /> */}

        {/* STUDENTS HOME */}
        <Route path="/students" element={<StudentsHome />} />

        {/* CLASS PAGE */}
        <Route path="/students/:classId" element={<ClassPage />} />

        {/* CATEGORY PAGE */}
        <Route path="/students/:classId/:category" element={<CategoryPage />} />

        {/* CONTENT PAGE */}
        <Route
          path="/students/:classId/:category/:id"
          element={<ContentPage />}
        />

        {/* TRAINERS */}
        <Route
          path="/trainers"
          element={
            <Trainers
              navItems={navItems}
              activeSection={activeSection}
              scrollTo={scrollTo}
              menuOpen={menuOpen}
              setMenuOpen={setMenuOpen}
            />
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
      </Routes>
    </div>
  );
}
