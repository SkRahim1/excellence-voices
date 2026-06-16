import React, { useState, useEffect, useCallback } from "react";
import { getSchoolName } from "../../services/schoolConfig";
import { db } from "../../firebase";
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  getDoc, 
  setDoc, 
  deleteDoc 
} from "firebase/firestore";
import { 
  Users, 
  GraduationCap, 
  Clock, 
  Search, 
  RefreshCw, 
  LogOut, 
  Calendar,
  BookOpen,
  Trash2,
  Plus,
  X
} from "lucide-react";
import "./PrincipalsHome.css";

export default function PrincipalsHome({ principalName, principalSchoolCode, onLogout }) {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");

  // Add teacher modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTeacherName, setNewTeacherName] = useState("");
  const [newTeacherMobile, setNewTeacherMobile] = useState("");
  const [newTeacherSubject, setNewTeacherSubject] = useState("english");
  const [modalError, setModalError] = useState("");
  const [modalLoading, setModalLoading] = useState(false);

  const schoolName = getSchoolName(principalSchoolCode);

  const fetchTeachersProgress = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const q = query(
        collection(db, "teachers"),
        where("schoolCode", "==", principalSchoolCode)
      );
      const querySnapshot = await getDocs(q);
      const teacherList = [];
      querySnapshot.forEach((doc) => {
        teacherList.push({ id: doc.id, ...doc.data() });
      });
      setTeachers(teacherList);
    } catch (err) {
      console.error("Error fetching teachers data:", err);
      setError("Failed to fetch teacher progress reports from database.");
    } finally {
      setLoading(false);
    }
  }, [principalSchoolCode]);

  useEffect(() => {
    fetchTeachersProgress();
  }, [fetchTeachersProgress]);

  // Format seconds to hours and minutes
  const formatTime = (totalSeconds) => {
    if (!totalSeconds) return "0 mins";
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    if (hrs > 0) {
      return `${hrs}h ${mins}m`;
    }
    return `${mins} mins`;
  };

  // Filter teachers based on search query and subject filter (memoized)
  const filteredTeachers = React.useMemo(() => {
    return teachers.filter((t) => {
      const nameMatch = t.teacherName || "";
      const matchesSearch = nameMatch.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSubject = subjectFilter === "all" || t.subject === subjectFilter;
      return matchesSearch && matchesSubject;
    });
  }, [teachers, searchQuery, subjectFilter]);

  // Calculate statistics (memoized)
  const { totalTeachers, avgProgress, totalTimeSpent } = React.useMemo(() => {
    const total = teachers.length;
    const avg = teachers.length > 0 
      ? Math.round(
          (teachers.reduce((acc, curr) => acc + (curr.completedWeeks?.length || 0), 0) / (teachers.length * 10)) * 100
        )
      : 0;
    const time = teachers.reduce((acc, curr) => acc + (curr.sessionSeconds || 0), 0);
    return { totalTeachers: total, avgProgress: avg, totalTimeSpent: time };
  }, [teachers]);

  // List of unique subjects represented (memoized)
  const subjectsList = React.useMemo(() => {
    return Array.from(new Set(teachers.map((t) => t.subject || "english")));
  }, [teachers]);

  const resetForm = () => {
    setNewTeacherName("");
    setNewTeacherMobile("");
    setNewTeacherSubject("english");
    setModalError("");
  };

  const handleAddTeacherSubmit = async (e) => {
    e.preventDefault();
    if (!newTeacherName.trim()) {
      setModalError("Please enter teacher name.");
      return;
    }
    if (!/^[6-9]\d{9}$/.test(newTeacherMobile)) {
      setModalError("Please enter a valid 10-digit mobile number.");
      return;
    }

    setModalLoading(true);
    setModalError("");

    try {
      const docRef = doc(db, "teachers", newTeacherMobile);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setModalError("A teacher with this mobile number is already registered.");
        setModalLoading(false);
        return;
      }

      const newTeacherProfile = {
        teacherName: newTeacherName.trim(),
        mobileNumber: newTeacherMobile,
        schoolCode: principalSchoolCode,
        subject: newTeacherSubject,
        completedWeeks: [],
        sessionSeconds: 0,
        lastActiveDate: new Date().toISOString().split("T")[0],
        updatedAt: new Date().toISOString()
      };

      await setDoc(docRef, newTeacherProfile);

      setTeachers(prev => [{ id: newTeacherMobile, ...newTeacherProfile }, ...prev]);
      setShowAddModal(false);
      resetForm();
    } catch (err) {
      console.error("Error adding teacher profile:", err);
      setModalError("Failed to add teacher profile. Please try again.");
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteTeacher = async (teacherId, name) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete ${name}'s profile and training records? This action cannot be undone.`);
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "teachers", teacherId));
      setTeachers(prev => prev.filter(t => t.id !== teacherId));
    } catch (err) {
      console.error("Error deleting teacher:", err);
      alert("Failed to delete teacher. Please try again.");
    }
  };

  return (
    <div className="principal-dashboard">
      {/* HEADER BAR */}
      <header className="principal-header">
        <div className="header-info">
          <span className="school-tag">🏫 {principalSchoolCode.toUpperCase()}</span>
          <h1>{schoolName}</h1>
          <p className="subtitle">Welcome, Principal <strong>{principalName}</strong></p>
        </div>
        
        <div className="header-actions">
          <button onClick={() => setShowAddModal(true)} className="action-btn add-btn" title="Add Teacher Profile">
            <Plus size={16} />
            Add Teacher
          </button>
          <button onClick={fetchTeachersProgress} className="action-btn refresh-btn" title="Refresh Live Data">
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
          <button onClick={onLogout} className="action-btn logout-btn">
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </header>

      {/* METRICS ROW */}
      <section className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon blue">
            <Users size={24} />
          </div>
          <div className="metric-data">
            <h3>Active Teachers</h3>
            <p className="value">{totalTeachers}</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon gold">
            <GraduationCap size={24} />
          </div>
          <div className="metric-data">
            <h3>Average Course Completion</h3>
            <p className="value">{avgProgress}%</p>
            <div className="progress-track-bg">
              <div className="progress-bar-fill" style={{ width: `${avgProgress}%` }}></div>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon green">
            <Clock size={24} />
          </div>
          <div className="metric-data">
            <h3>Total Portal Activity</h3>
            <p className="value">{formatTime(totalTimeSpent)}</p>
          </div>
        </div>
      </section>

      {/* CONTROL BAR */}
      <div className="table-controls">
        <div className="search-bar">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search teacher by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filters">
          <select value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)}>
            <option value="all">All Subjects</option>
            {subjectsList.map((sub) => (
              <option key={sub} value={sub}>
                {sub.charAt(0).toUpperCase() + sub.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* MAIN DATA SECTION */}
      <main className="table-container">
        {loading ? (
          <div className="state-message">
            <div className="loading-spinner"></div>
            <p>Loading teacher progress records...</p>
          </div>
        ) : error ? (
          <div className="state-message error">
            <p>⚠️ {error}</p>
            <button onClick={fetchTeachersProgress} className="retry-btn">Try Again</button>
          </div>
        ) : filteredTeachers.length === 0 ? (
          <div className="state-message empty">
            <BookOpen size={48} className="empty-icon" />
            <p>{teachers.length === 0 ? "No teacher accounts registered or synced in this school yet." : "No teachers match your search filter."}</p>
          </div>
        ) : (
          <table className="progress-table">
            <thead>
              <tr>
                <th>Teacher Name</th>
                <th>Subject</th>
                <th>Training Progress</th>
                <th>Time Spent Today</th>
                <th>Last Active</th>
                <th className="actions-header">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTeachers.map((t) => {
                const completedCount = t.completedWeeks?.length || 0;
                const percentage = Math.round((completedCount / 10) * 100);
                
                return (
                  <tr key={t.id}>
                    <td className="teacher-name-cell">
                      <div className="avatar-circle">
                        {t.teacherName ? t.teacherName.charAt(0).toUpperCase() : "?"}
                      </div>
                      <div>
                        <span className="name-bold">{t.teacherName || "Unnamed Teacher"}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`subject-badge ${t.subject}`}>
                        {t.subject || "English"}
                      </span>
                    </td>
                    <td>
                      <div className="progress-cell">
                        <div className="progress-header">
                          <span className="percentage">{percentage}%</span>
                          <span className="weeks-count">{completedCount}/10 Weeks</span>
                        </div>
                        <div className="progress-track-bg">
                          <div 
                            className="progress-bar-fill" 
                            style={{ 
                              width: `${percentage}%`,
                              background: percentage >= 100 ? "linear-gradient(135deg, #10b981 0%, #059669 100%)" : "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)"
                            }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="time-cell">
                      <Clock size={14} className="cell-icon" />
                      {formatTime(t.sessionSeconds)}
                    </td>
                    <td className="date-cell">
                      <Calendar size={14} className="cell-icon" />
                      {t.lastActiveDate || "Not tracked"}
                    </td>
                    <td className="actions-cell">
                      <button 
                        onClick={() => handleDeleteTeacher(t.id, t.teacherName || "Teacher")} 
                        className="delete-btn-row" 
                        title="Delete Profile"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </main>

      {/* ADD TEACHER MODAL */}
      {showAddModal && (
        <div className="principal-modal-overlay">
          <div className="principal-modal-box animate-scaleUp">
            <button className="principal-modal-close-btn" onClick={() => { setShowAddModal(false); resetForm(); }}>
              <X size={20} />
            </button>
            <h2>Add New Teacher</h2>
            <p>Create a teacher profile for {schoolName}.</p>
            
            <form onSubmit={handleAddTeacherSubmit} className="principal-modal-form">
              <div className="form-group">
                <label>Teacher Name</label>
                <input
                  type="text"
                  placeholder="Enter Name"
                  value={newTeacherName}
                  onChange={(e) => { setNewTeacherName(e.target.value); setModalError(""); }}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Mobile Number</label>
                <input
                  type="tel"
                  placeholder="Enter 10-Digit Mobile Number"
                  value={newTeacherMobile}
                  onChange={(e) => { setNewTeacherMobile(e.target.value.replace(/\D/g, "").slice(0, 10)); setModalError(""); }}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Subject Specialist</label>
                <select
                  value={newTeacherSubject}
                  onChange={(e) => setNewTeacherSubject(e.target.value)}
                >
                  <option value="english">English</option>
                  <option value="mathematics">Mathematics</option>
                  <option value="science">Science</option>
                  <option value="evs">EVS</option>
                  <option value="socialStudies">Social Studies</option>
                  <option value="computerScience">Computer Science</option>
                  <option value="physicalTraining">Physical Training</option>
                </select>
              </div>
              
              {modalError && <span className="modal-error-text">{modalError}</span>}
              
              <button 
                type="submit" 
                className="principal-modal-submit-btn" 
                disabled={modalLoading}
              >
                {modalLoading ? "Adding..." : "Add Teacher"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
