import React, { useState } from "react";
import { SCHOOL_MAPPING, SCHOOL_PRINCIPAL_PASSWORDS, normalizeSchoolCode } from "../services/schoolConfig";
import "./PrincipalProtectedPopup.css";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function PrincipalProtectedPopup({ children }) {
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = useState(
    localStorage.getItem("principalAuth") === "true"
  );
  const [name, setName] = useState(
    localStorage.getItem("principalName") || ""
  );
  const [schoolCode, setSchoolCode] = useState(
    localStorage.getItem("principalSchoolCode") || "exscl-01"
  );
  const [mobileNumber, setMobileNumber] = useState(
    localStorage.getItem("principalMobileNumber") || ""
  );

  const [activeTab, setActiveTab] = useState("login"); // "register" | "login"
  const [nameInput, setNameInput] = useState("");
  const [mobileInput, setMobileInput] = useState("");
  const [schoolInput, setSchoolInput] = useState("exscl-01");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const normalizeMobileNumber = (value) => {
    let cleaned = value.replace(/\D/g, "");
    if (cleaned.startsWith("91") && cleaned.length === 12) {
      cleaned = cleaned.slice(2);
    } else if (cleaned.startsWith("0") && cleaned.length === 11) {
      cleaned = cleaned.slice(1);
    }
    return cleaned.slice(0, 10);
  };

  const isValidMobile = (num) => {
    return /^[6-9]\d{9}$/.test(num);
  };

  const handleRegister = async () => {
    const cleanMobile = normalizeMobileNumber(mobileInput);
    if (!nameInput.trim()) {
      setError("Please enter your name");
      return;
    }
    if (!isValidMobile(cleanMobile)) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }

    const normalizedSelectedCode = normalizeSchoolCode(schoolInput);
    const expectedPassword = SCHOOL_PRINCIPAL_PASSWORDS[normalizedSelectedCode];

    if (password !== expectedPassword) {
      setError("Incorrect Password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const docRef = doc(db, "principals", cleanMobile);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setError("Profile already exists with this mobile number. Please log in.");
        setLoading(false);
        return;
      }

      const newProfile = {
        principalName: nameInput.trim(),
        mobileNumber: cleanMobile,
        schoolCode: normalizedSelectedCode,
        createdAt: new Date().toISOString()
      };

      await setDoc(docRef, newProfile);

      localStorage.setItem("principalAuth", "true");
      localStorage.setItem("principalName", nameInput.trim());
      localStorage.setItem("principalSchoolCode", normalizedSelectedCode);
      localStorage.setItem("principalMobileNumber", cleanMobile);

      setName(nameInput.trim());
      setSchoolCode(normalizedSelectedCode);
      setMobileNumber(cleanMobile);
      setAuthenticated(true);
    } catch (err) {
      console.error(err);
      setError("Failed to register. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    const cleanMobile = normalizeMobileNumber(mobileInput);
    if (!isValidMobile(cleanMobile)) {
      setError("Please enter your registered 10-digit mobile number");
      return;
    }
    if (!password) {
      setError("Please enter your school admin password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const docRef = doc(db, "principals", cleanMobile);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        setError("No profile found for this mobile number. Please register instead.");
        setLoading(false);
        return;
      }

      const data = docSnap.data();
      const normalizedCode = normalizeSchoolCode(data.schoolCode || "exscl-01");
      const expectedPassword = SCHOOL_PRINCIPAL_PASSWORDS[normalizedCode];

      if (password !== expectedPassword) {
        setError("Incorrect Password");
        setLoading(false);
        return;
      }

      localStorage.setItem("principalAuth", "true");
      localStorage.setItem("principalName", data.principalName);
      localStorage.setItem("principalSchoolCode", normalizedCode);
      localStorage.setItem("principalMobileNumber", cleanMobile);

      setName(data.principalName);
      setSchoolCode(normalizedCode);
      setMobileNumber(cleanMobile);
      setAuthenticated(true);
    } catch (err) {
      console.error(err);
      setError("Failed to login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("principalAuth");
    localStorage.removeItem("principalName");
    localStorage.removeItem("principalSchoolCode");
    localStorage.removeItem("principalMobileNumber");
    setName("");
    setSchoolCode("exscl-01");
    setMobileNumber("");
    setAuthenticated(false);
  };

  if (authenticated) {
    return typeof children === "function" ? children(name, schoolCode, mobileNumber, handleLogout) : children;
  }

  return (
    <div className="principal-popup-overlay">
      <div className="principal-popup-box animate-scaleUp">
        {/* CLOSE BUTTON */}
        <button className="principal-close-btn" onClick={() => navigate("/")} aria-label="Close">
          <X size={20} />
        </button>

        <div className="principal-popup-icon">🎓</div>
        <h1>Principals Portal</h1>
        <p>Access your administration dashboard.</p>

        {/* Tab Switcher */}
        <div className="principal-tab-switcher">
          <button
            type="button"
            className={activeTab === "register" ? "active" : ""}
            onClick={() => { setActiveTab("register"); setError(""); setPassword(""); }}
          >
            Register
          </button>
          <button
            type="button"
            className={activeTab === "login" ? "active" : ""}
            onClick={() => { setActiveTab("login"); setError(""); setPassword(""); }}
          >
            Log In
          </button>
        </div>

        {activeTab === "register" ? (
          <>
            <input
              type="text"
              placeholder="Enter Principal Name"
              value={nameInput}
              onChange={(e) => { setNameInput(e.target.value); setError(""); }}
            />

            <input
              type="tel"
              placeholder="Enter 10-Digit Mobile Number"
              value={mobileInput}
              onChange={(e) => { setMobileInput(normalizeMobileNumber(e.target.value)); setError(""); }}
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

            <input
              type="password"
              placeholder="Enter School Admin Password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
            />

            {error && <span className="principal-popup-error">{error}</span>}

            <button className="principal-submit-btn" onClick={handleRegister} disabled={loading}>
              {loading ? "Registering..." : "Register Profile"}
            </button>
          </>
        ) : (
          <>
            <input
              type="tel"
              placeholder="Enter Registered Mobile Number"
              value={mobileInput}
              onChange={(e) => { setMobileInput(normalizeMobileNumber(e.target.value)); setError(""); }}
            />

            <input
              type="password"
              placeholder="Enter School Admin Password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
            />

            {error && <span className="principal-popup-error">{error}</span>}

            <button className="principal-submit-btn" onClick={handleLogin} disabled={loading}>
              {loading ? "Logging In..." : "Unlock Access"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
