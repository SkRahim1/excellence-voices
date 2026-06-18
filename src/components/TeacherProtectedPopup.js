import React, { useState } from "react";
import { SCHOOL_MAPPING, SCHOOL_TEACHER_PASSWORDS, normalizeSchoolCode } from "../services/schoolConfig";
import "./TeacherProtectedPopup.css";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function TeacherProtectedPopup({ children }) {
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = useState(
    localStorage.getItem("teacherAuth") === "true"
  );
  const [name, setName] = useState(
    localStorage.getItem("teacherName") || ""
  );
  const [subject, setSubject] = useState(
    localStorage.getItem("teacherSubject") || "english"
  );
  const [schoolCode, setSchoolCode] = useState(
    localStorage.getItem("teacherSchoolCode") || "exscl-01"
  );
  const [mobileNumber, setMobileNumber] = useState(
    localStorage.getItem("teacherMobileNumber") || ""
  );

  const [activeTab, setActiveTab] = useState("register"); // "register" | "login"
  const [nameInput, setNameInput] = useState("");
  const [mobileInput, setMobileInput] = useState("");
  const [schoolInput, setSchoolInput] = useState("exscl-01");
  const [subjectInput, setSubjectInput] = useState("english");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isValidMobile = (num) => {
    return /^[6-9]\d{9}$/.test(num);
  };

  const handleRegister = async () => {
    if (!nameInput.trim()) {
      setError("Please enter your name");
      return;
    }
    if (!isValidMobile(mobileInput)) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }
    const normalizedSelectedCode = normalizeSchoolCode(schoolInput);
    const expectedPassword = SCHOOL_TEACHER_PASSWORDS[normalizedSelectedCode];

    if (password !== expectedPassword) {
      setError("Incorrect Password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const docRef = doc(db, "teachers", mobileInput);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setError("Profile already exists with this mobile number. Please log in.");
        setLoading(false);
        return;
      }

      const newProfile = {
        teacherName: nameInput.trim(),
        mobileNumber: mobileInput,
        schoolCode: normalizedSelectedCode,
        subject: subjectInput,
        completedWeeks: [],
        sessionSeconds: 0,
        lastActiveDate: new Date().toISOString().split("T")[0],
        updatedAt: new Date().toISOString()
      };

      await setDoc(docRef, newProfile);

      localStorage.setItem("teacherAuth", "true");
      localStorage.setItem("teacherName", nameInput.trim());
      localStorage.setItem("teacherSubject", subjectInput);
      localStorage.setItem("teacherSchoolCode", normalizedSelectedCode);
      localStorage.setItem("teacherMobileNumber", mobileInput);
      localStorage.setItem("teacherProgress", JSON.stringify([]));
      localStorage.setItem("teacherSessionTime", JSON.stringify({
        date: new Date().toDateString(),
        seconds: 0
      }));
      localStorage.setItem("teacherTotalSessionTime", "0");

      setName(nameInput.trim());
      setSubject(subjectInput);
      setSchoolCode(normalizedSelectedCode);
      setMobileNumber(mobileInput);
      setAuthenticated(true);
    } catch (err) {
      console.error(err);
      setError("Failed to register. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!isValidMobile(mobileInput)) {
      setError("Please enter your registered 10-digit mobile number");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const docRef = doc(db, "teachers", mobileInput);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        setError("No profile found for this mobile number. Please register instead.");
        setLoading(false);
        return;
      }

      const data = docSnap.data();
      const weeks = data.completedWeeks || [];
      const seconds = data.sessionSeconds || 0;

      localStorage.setItem("teacherAuth", "true");
      localStorage.setItem("teacherName", data.teacherName);
      localStorage.setItem("teacherSubject", data.subject || "english");
      localStorage.setItem("teacherSchoolCode", data.schoolCode || "exscl-01");
      localStorage.setItem("teacherMobileNumber", mobileInput);
      localStorage.setItem("teacherProgress", JSON.stringify(weeks));
      localStorage.setItem("teacherSessionTime", JSON.stringify({
        date: new Date().toDateString(),
        seconds: seconds
      }));
      localStorage.setItem("teacherTotalSessionTime", seconds.toString());

      setName(data.teacherName);
      setSubject(data.subject || "english");
      setSchoolCode(data.schoolCode || "exscl-01");
      setMobileNumber(mobileInput);
      setAuthenticated(true);
    } catch (err) {
      console.error(err);
      setError("Failed to login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("teacherAuth");
    localStorage.removeItem("teacherName");
    localStorage.removeItem("teacherSubject");
    localStorage.removeItem("teacherSchoolCode");
    localStorage.removeItem("teacherMobileNumber");
    localStorage.removeItem("teacherProgress");
    localStorage.removeItem("teacherSessionTime");
    localStorage.removeItem("teacherTotalSessionTime");
    
    // Clear weekly timers and speech progress from local storage
    Object.keys(localStorage).forEach(key => {
      if (
        key.startsWith("teacherWeeklySessionTime_") ||
        key.startsWith("speechProgress_") ||
        key.startsWith("speechCompleted_") ||
        key.startsWith("speechCounts_")
      ) {
        localStorage.removeItem(key);
      }
    });

    setName("");
    setSubject("english");
    setSchoolCode("exscl-01");
    setMobileNumber("");
    setAuthenticated(false);
  };

  if (authenticated) {
    return typeof children === "function" ? children(name, subject, schoolCode, mobileNumber, handleLogout) : children;
  }

  return (
    <div className="teacher-popup-overlay">
      <div className="teacher-popup-box">
        {/* CLOSE BUTTON */}
        <button className="teacher-close-btn" onClick={() => navigate("/")} aria-label="Close">
          <X size={20} />
        </button>

        <div className="teacher-popup-icon">👩‍🏫</div>
        <h1>Teachers Portal</h1>
        <p>Access your training portal dashboard.</p>

        {/* Tab Switcher */}
        <div className="teacher-tab-switcher">
          <button
            type="button"
            className={activeTab === "register" ? "active" : ""}
            onClick={() => { setActiveTab("register"); setError(""); }}
          >
            Register
          </button>
          <button
            type="button"
            className={activeTab === "login" ? "active" : ""}
            onClick={() => { setActiveTab("login"); setError(""); }}
          >
            Log In
          </button>
        </div>

        {activeTab === "register" ? (
          <>
            <input
              type="text"
              placeholder="Enter Your Name"
              value={nameInput}
              onChange={(e) => { setNameInput(e.target.value); setError(""); }}
            />

            <input
              type="tel"
              placeholder="Enter 10-Digit Mobile Number"
              value={mobileInput}
              onChange={(e) => { setMobileInput(e.target.value.replace(/\D/g, "").slice(0, 10)); setError(""); }}
            />

            <select
              value={schoolInput}
              onChange={(e) => setSchoolInput(e.target.value)}
            >
              {Object.entries(SCHOOL_MAPPING).map(([code, schoolName]) => (
                <option key={code} value={code}>
                  {code.toUpperCase()}
                </option>
              ))}
            </select>

            <select
              value={subjectInput}
              onChange={(e) => setSubjectInput(e.target.value)}
            >
              <option value="english">English</option>
              <option value="mathematics">Mathematics</option>
              <option value="science">Science</option>
              <option value="evs">EVS</option>
              <option value="socialStudies">Social Studies</option>
              <option value="computerScience">Computer Science</option>
              <option value="physicalTraining">Physical Training</option>
            </select>

            <input
              type="password"
              placeholder="Enter School Password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
            />

            {error && <span className="teacher-popup-error">{error}</span>}

            <button className="teacher-submit-btn" onClick={handleRegister} disabled={loading}>
              {loading ? "Registering..." : "Register Profile"}
            </button>
          </>
        ) : (
          <>
            <input
              type="tel"
              placeholder="Enter Registered Mobile Number"
              value={mobileInput}
              onChange={(e) => { setMobileInput(e.target.value.replace(/\D/g, "").slice(0, 10)); setError(""); }}
            />

            {error && <span className="teacher-popup-error">{error}</span>}

            <button className="teacher-submit-btn" onClick={handleLogin} disabled={loading}>
              {loading ? "Logging In..." : "Unlock Access"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}


