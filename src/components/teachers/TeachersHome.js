import React, { useState, useCallback, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  Info,
  HelpCircle,
  MessageSquare,
  BookOpen,
  Book,
  FlaskConical,
  Calculator,
  Globe,
  Leaf,
  Cpu,
  Users,
  Sparkles,
  ChevronRight,
  Compass,
  Volume2,
  Square,
  Check,
  Trophy,
  Target,
  UserCircle,
  Lock,
  Clock
} from "lucide-react";
import teachersData from "../data/TeachersData";
import "./TeachersHome.css";

export default function TeachersHome({ teacherName }) {
  const [activeWeek, setActiveWeek] = useState("week-1");
  const [activeSubject, setActiveSubject] = useState("english");
  const [activeCategory, setActiveCategory] = useState("instructions");
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Progress tracking via localStorage
  const [completedWeeks, setCompletedWeeks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("teacherProgress")) || [];
    } catch { return []; }
  });

  // Last completion date (YYYY-MM-DD)
  const [lastCompletionDate, setLastCompletionDate] = useState(
    () => localStorage.getItem("teacherLastCompleteDate") || ""
  );

  // Session time tracker (seconds spent on portal today)
  const [sessionSeconds, setSessionSeconds] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("teacherSessionTime")) || {};
      const today = new Date().toDateString();
      return stored.date === today ? stored.seconds : 0;
    } catch { return 0; }
  });

  // Timer - count up every second
  useEffect(() => {
    const interval = setInterval(() => {
      setSessionSeconds(prev => {
        const updated = prev + 1;
        localStorage.setItem("teacherSessionTime", JSON.stringify({
          date: new Date().toDateString(),
          seconds: updated
        }));
        return updated;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const REQUIRED_MINUTES = 60;
  const requiredSeconds = REQUIRED_MINUTES * 60;
  const timeRemaining = Math.max(0, requiredSeconds - sessionSeconds);
  const hasSpentEnoughTime = sessionSeconds >= requiredSeconds;
  const todayStr = new Date().toISOString().split("T")[0];
  const alreadyCompletedToday = lastCompletionDate === todayStr;

  // Which week is next to complete (sequential)
  const nextWeekToComplete = `week-${completedWeeks.length + 1}`;

  // Check if a week is locked
  const isWeekLocked = (weekId) => {
    const weekNum = parseInt(weekId.split("-")[1]);
    // Completed weeks are never locked
    if (completedWeeks.includes(weekId)) return false;
    // The next week to complete is unlocked
    if (weekId === nextWeekToComplete) return false;
    // All future weeks beyond next are locked
    return weekNum > completedWeeks.length + 1;
  };

  // Can the teacher mark the active week as complete?
  const canMarkComplete = () => {
    if (completedWeeks.includes(activeWeek)) return false; // already done
    if (activeWeek !== nextWeekToComplete) return false; // not sequential
    if (alreadyCompletedToday) return false; // one per day
    if (!hasSpentEnoughTime) return false; // need 60 min
    return true;
  };

  // Get the reason why Mark Complete is disabled
  const getDisabledReason = () => {
    if (completedWeeks.includes(activeWeek)) return null; // show "Completed"
    if (activeWeek !== nextWeekToComplete) {
      const prevWeek = parseInt(activeWeek.split("-")[1]) - 1;
      return `Complete Week ${prevWeek} first`;
    }
    if (alreadyCompletedToday) return "1 week per day limit reached";
    if (!hasSpentEnoughTime) {
      const mins = Math.floor(timeRemaining / 60);
      const secs = timeRemaining % 60;
      return `${mins}m ${secs < 10 ? "0" : ""}${secs}s remaining`;
    }
    return null;
  };

  const handleMarkComplete = () => {
    if (!canMarkComplete()) return;
    const updated = [...completedWeeks, activeWeek];
    setCompletedWeeks(updated);
    localStorage.setItem("teacherProgress", JSON.stringify(updated));
    localStorage.setItem("teacherLastCompleteDate", todayStr);
    setLastCompletionDate(todayStr);
  };

  const progressPercent = Math.round((completedWeeks.length / 24) * 100);

  const milestones = [
    { week: 6, label: "Emerging Communicator", icon: <Target size={14} /> },
    { week: 12, label: "Classroom Speaker", icon: <GraduationCap size={14} /> },
    { week: 18, label: "Confident Communicator", icon: <Sparkles size={14} /> },
    { week: 24, label: "Fluent Facilitator", icon: <Trophy size={14} /> }
  ];

  const currentMilestone = milestones.filter(m => completedWeeks.length >= m.week).pop();

  const weeks = Array.from({ length: 24 }, (_, i) => `week-${i + 1}`);

  const subjects = [
    { id: "english", label: "English", icon: <Book size={18} /> },
    { id: "mathematics", label: "Mathematics", icon: <Calculator size={18} /> },
    { id: "science", label: "Science", icon: <FlaskConical size={18} /> },
    { id: "evs", label: "EVS", icon: <Leaf size={18} /> },
    { id: "socialStudies", label: "Social Studies", icon: <Globe size={18} /> },
    { id: "computerScience", label: "Computer Science", icon: <Cpu size={18} /> }
  ];

  const categories = [
    { id: "instructions", label: "Instructions", icon: <Info size={16} />, title: "Classroom Commands (10)" },
    { id: "questions", label: "Questions", icon: <HelpCircle size={16} />, title: "Teacher Questions (10)" },
    { id: "stockSentences", label: "Stock Sentences", icon: <MessageSquare size={16} />, title: "Stock Sentences (10)" },
    { id: "explanationSentences", label: "Explanation Sentences", icon: <BookOpen size={16} />, title: "Explanation Sentences (10)" },
    { id: "roleplay", label: "Teacher–Student Roleplay", icon: <Users size={16} />, title: "Roleplay Dialogue" },
    { id: "challenge", label: "Practice Task", icon: <Sparkles size={16} />, title: "This Week's Challenge" }
  ];

  const activeWeekData = useMemo(() => teachersData[activeWeek] || {}, [activeWeek]);
  const currentSubjectData = useMemo(() => activeWeekData[activeSubject] || {}, [activeWeekData, activeSubject]);
  const activeCategoryDetail = categories.find((c) => c.id === activeCategory);

  // Retrieve contents depending on active category selection
  let contentList = [];
  if (["instructions", "questions", "stockSentences", "explanationSentences"].includes(activeCategory)) {
    contentList = currentSubjectData[activeCategory] || [];
  }

  // Stop speech when switching tabs/weeks/subjects
  useEffect(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, [activeWeek, activeSubject, activeCategory]);

  // Cleanup on unmount
  useEffect(() => {
    return () => window.speechSynthesis.cancel();
  }, []);

  const handleReadAloud = useCallback(() => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    let textToRead = "";

    if (["instructions", "questions", "stockSentences", "explanationSentences"].includes(activeCategory)) {
      const items = currentSubjectData[activeCategory] || [];
      textToRead = items.map((item, i) => `${i + 1}. ${item}`).join(". ");
    } else if (activeCategory === "roleplay") {
      const dialogues = currentSubjectData.roleplays || [];
      textToRead = dialogues.map(d => `${d.speaker}: ${d.text}`).join(". ");
    } else if (activeCategory === "challenge") {
      textToRead = activeWeekData.challenge || "";
    }

    if (!textToRead) return;

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = "en-IN";
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  }, [isSpeaking, activeCategory, currentSubjectData, activeWeekData]);

  return (
    <div className="teachers-portal container">
      {/* HEADER SECTION */}
      <motion.div
        className="teachers-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="badge">
          <GraduationCap size={16} /> Teachers Resource Hub
        </div>
        {teacherName && (
          <div className="teacher-welcome">
            <UserCircle size={22} />
            <span>Welcome, <strong>{teacherName}</strong></span>
          </div>
        )}
        <h1 className="hero-title">
          Teachers <span>Portal</span>
        </h1>
        <p className="para">
          Equip yourself with structured classroom communication resources. Browse through week-by-week instructions, questions, dialogue skits, and practical challenges.
        </p>
      </motion.div>

      {/* PROGRESS BAR */}
      <motion.div
        className="progress-container"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08, duration: 0.5 }}
      >
        <div className="progress-header">
          <div className="progress-label">
            <Trophy size={16} />
            <span>Your Progress</span>
          </div>
          <div className="progress-stats">
            <span className="progress-fraction">{completedWeeks.length}/24 Weeks</span>
            <span className="progress-percentage">{progressPercent}%</span>
          </div>
        </div>
        <div className="progress-bar-track">
          <motion.div
            className="progress-bar-fill"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
          {milestones.map(m => (
            <div
              key={m.week}
              className={`milestone-marker ${completedWeeks.length >= m.week ? "reached" : ""}`}
              style={{ left: `${(m.week / 24) * 100}%` }}
              title={m.label}
            />
          ))}
        </div>
        <div className="milestone-labels">
          {milestones.map(m => (
            <div
              key={m.week}
              className={`milestone-tag ${completedWeeks.length >= m.week ? "reached" : ""}`}
            >
              {m.icon}
              <span>{m.label}</span>
            </div>
          ))}
        </div>
        {currentMilestone && (
          <div className="current-milestone-badge">
            {currentMilestone.icon} Current Level: <strong>{currentMilestone.label}</strong>
          </div>
        )}
      </motion.div>

      {/* WEEK SELECTION BAR */}
      <motion.div
        className="weeks-selector-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <div className="weeks-selector-label">
          <Compass size={16} /> Select Week:
        </div>
        <div className="weeks-scroll-wrapper">
          {weeks.map((wk, idx) => {
            const isActive = activeWeek === wk;
            const isCompleted = completedWeeks.includes(wk);
            const locked = isWeekLocked(wk);
            const isCurrent = wk === nextWeekToComplete;
            return (
              <button
                key={wk}
                className={`week-capsule ${isActive ? "active" : ""} ${isCompleted ? "completed" : ""} ${locked ? "locked" : ""} ${isCurrent && !isCompleted ? "current" : ""}`}
                onClick={() => !locked && setActiveWeek(wk)}
                disabled={locked}
                title={locked ? "Complete previous weeks first" : ""}
              >
                {locked && <Lock size={10} className="week-lock-icon" />}
                {isCompleted && <Check size={12} className="week-check-icon" />}
                Week {idx + 1}
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* CURRICULUM FOCUS BANNER */}
      <motion.div
        className="curriculum-banner"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        key={activeWeek}
      >
        <div className="curriculum-banner-left">
          <div className="curriculum-focus">
            <strong>Focus:</strong> {activeWeekData.focus}
          </div>
          <div className="curriculum-theme">
            <strong>Weekly Theme:</strong> {activeWeekData.theme}
          </div>
        </div>
        <div className="curriculum-banner-right">
          {completedWeeks.includes(activeWeek) ? (
            <div className="mark-complete-btn completed">
              <Check size={14} /> Completed
            </div>
          ) : (
            <>
              <button
                className={`mark-complete-btn ${canMarkComplete() ? "ready" : "disabled"}`}
                onClick={handleMarkComplete}
                disabled={!canMarkComplete()}
              >
                {canMarkComplete() ? (
                  <><Check size={14} /> Mark Complete</>
                ) : (
                  <><Clock size={14} /> {getDisabledReason()}</>
                )}
              </button>
            </>
          )}
        </div>
      </motion.div>

      {/* SUBJECTS SELECTOR */}
      <motion.div
        className="subject-tabs-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25, duration: 0.5 }}
      >
        <div className="subject-tabs">
          {subjects.map((sub) => {
            const isActive = activeSubject === sub.id;
            return (
              <button
                key={sub.id}
                className={`subject-tab-btn ${isActive ? "active" : ""}`}
                onClick={() => setActiveSubject(sub.id)}
              >
                {sub.icon}
                <span>{sub.label}</span>
                {isActive && (
                  <motion.div
                    className="active-indicator"
                    layoutId="activeSubjectIndicator"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* PORTAL MAIN CONTENT AREA */}
      <div className="portal-layout">
        {/* SIDEBAR FOR CATEGORIES */}
        <motion.div
          className="portal-sidebar"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="category-list">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  className={`category-item-btn ${isActive ? "active" : ""}`}
                  onClick={() => setActiveCategory(cat.id)}
                >
                  <div className="category-item-content">
                    {cat.icon}
                    <span>{cat.label}</span>
                  </div>
                  <ChevronRight size={14} className="arrow-icon" />
                  {isActive && (
                    <motion.div
                      className="category-active-bg"
                      layoutId="activeCategoryBg"
                      transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* DETAILS PANEL */}
        <div className="portal-details-panel">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeWeek}-${activeSubject}-${activeCategory}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="details-content-card"
            >
              <div className="details-header">
                <h3>{currentSubjectData.title || activeSubject.toUpperCase()}</h3>
                <div className="details-header-right">
                  <button
                    className={`read-aloud-btn ${isSpeaking ? "speaking" : ""}`}
                    onClick={handleReadAloud}
                  >
                    {isSpeaking ? (
                      <><Square size={14} /> Stop Reading</>
                    ) : (
                      <><Volume2 size={14} /> Read Aloud</>
                    )}
                  </button>
                  <span className="category-badge">
                    {activeCategoryDetail?.icon}
                    {activeCategoryDetail?.title}
                  </span>
                </div>
              </div>

              <div className="details-body">
                {/* Standard sentence lists (10 items) */}
                {["instructions", "questions", "stockSentences", "explanationSentences"].includes(activeCategory) && (
                  <ul className="content-list">
                    {contentList.map((item, index) => (
                      <motion.li
                        key={index}
                        className="content-item"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <div className="bullet-point">{index + 1}</div>
                        <div className="content-text">{item}</div>
                      </motion.li>
                    ))}
                  </ul>
                )}

                {/* Roleplays view */}
                {activeCategory === "roleplay" && (
                  <div className="roleplay-chat">
                    <p className="roleplay-intro-text">
                      Review the following classroom dialogue. Practice reading both sides aloud to build natural conversational flow.
                    </p>
                    <div className="dialogue-container">
                      {(currentSubjectData.roleplays || []).map((utterance, index) => {
                        const isTeacher = utterance.speaker === "Teacher";
                        return (
                          <motion.div
                            key={index}
                            className={`dialogue-bubble-wrapper ${isTeacher ? "teacher-wrapper" : "student-wrapper"}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <span className="speaker-tag">{utterance.speaker}</span>
                            <div className={`dialogue-bubble ${isTeacher ? "teacher-bubble" : "student-bubble"}`}>
                              {utterance.text}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Challenge view */}
                {activeCategory === "challenge" && (
                  <motion.div
                    className="challenge-card"
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <div className="challenge-icon-container">
                      <Sparkles size={32} />
                    </div>
                    <h4>Practice Challenge</h4>
                    <p className="challenge-main-text">{activeWeekData.challenge}</p>
                    <div className="challenge-action-steps">
                      <h5>Action Plan:</h5>
                      <ul>
                        <li>Pick 5 classroom instructions from the list and use them repeatedly.</li>
                        <li>Ask at least 3 queries from the questions section during your lesson.</li>
                        <li>Deliver at least 2 verbal praises using the stock sentences provided.</li>
                        <li>Observe student responsiveness and note improvements daily.</li>
                      </ul>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
