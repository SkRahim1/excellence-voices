import React, { useState, useCallback, useEffect, useMemo, useRef } from "react";
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
  Clock,
  Dumbbell,
  Mic,
  Star
} from "lucide-react";
import teachersData from "../data/TeachersData";
import "./TeachersHome.css";
import { db } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";

export default function TeachersHome({ teacherName, teacherSubject, teacherSchoolCode, teacherMobileNumber, onLogout }) {
  const [activeWeek, setActiveWeek] = useState("week-1");
  const [activeSubject, setActiveSubject] = useState(teacherSubject || "english");
  const [activeCategory, setActiveCategory] = useState("instructions");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentLang, setCurrentLang] = useState("en"); // "en", "hi", "te"
  const [isTranslating, setIsTranslating] = useState(false);
  const translationCacheRef = useRef({});
  const [translatedList, setTranslatedList] = useState([]);
  const [translatedRoleplay, setTranslatedRoleplay] = useState([]);
  const [translatedChallenge, setTranslatedChallenge] = useState("");
  const [selectedWordInfo, setSelectedWordInfo] = useState(null); // { word, translation, x, y }
  const touchStartRef = useRef(null);

  const [completedSpeechItems, setCompletedSpeechItems] = useState([]);
  const [totalSpeechCount, setTotalSpeechCount] = useState(0);
  const [activeSpeechItem, setActiveSpeechItem] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [speechResult, setSpeechResult] = useState("");
  const [isSpeechMatch, setIsSpeechMatch] = useState(false);
  const [speechError, setSpeechError] = useState("");
  const recognitionRef = useRef(null);

  // Load speech progress and weekly session time when activeWeek/activeCategory changes
  const [weeklySessionSeconds, setWeeklySessionSeconds] = useState(0);

  useEffect(() => {
    const savedCategoryItems = JSON.parse(localStorage.getItem(`speechCompleted_${activeWeek}_${activeCategory}`)) || [];
    setCompletedSpeechItems(savedCategoryItems);

    let totalUnique = 0;
    const categoriesList = ["instructions", "questions", "stockSentences", "explanationSentences", "roleplay", "challenge"];
    categoriesList.forEach(cat => {
      const catItems = JSON.parse(localStorage.getItem(`speechCompleted_${activeWeek}_${cat}`)) || [];
      totalUnique += catItems.length;
    });
    setTotalSpeechCount(totalUnique);

    const savedWeeklyTime = localStorage.getItem(`teacherWeeklySessionTime_${activeWeek}`) || "0";
    setWeeklySessionSeconds(parseInt(savedWeeklyTime, 10));

    setActiveSpeechItem("");
    setSpeechResult("");
    setIsSpeechMatch(false);
    setSpeechError("");

    if (isListening) {
      stopSpeechRecognition();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeWeek, activeCategory]);

  // Clean up recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const startSpeechRecognition = (targetText) => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge.");
      return;
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (err) {
        console.error("Error aborting previous speech recognition:", err);
      }
    }

    setActiveSpeechItem(targetText);
    setSpeechResult("");
    setIsSpeechMatch(false);
    setSpeechError("");
    setIsListening(true);

    const rec = new SpeechRecognition();
    rec.continuous = false;
    rec.interimResults = false;

    if (currentLang === "hi") {
      rec.lang = "hi-IN";
    } else if (currentLang === "te") {
      rec.lang = "te-IN";
    } else {
      rec.lang = "en-IN";
    }

    rec.onstart = () => {
      if (recognitionRef.current === rec) {
        setIsListening(true);
      }
    };

    rec.onend = () => {
      if (recognitionRef.current === rec) {
        setIsListening(false);
      }
    };

    rec.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      if (recognitionRef.current === rec) {
        setIsListening(false);
        if (event.error === "not-allowed") {
          setSpeechError("Microphone access blocked. Please click the mic icon in your browser address bar and choose 'Allow'.");
        } else if (event.error === "no-speech") {
          setSpeechError("No speech detected. Please try again and speak clearly.");
        } else if (event.error === "audio-capture") {
          setSpeechError("No microphone found. Please verify your system settings.");
        } else {
          setSpeechError(`Speech recognition failed: ${event.error}`);
        }
      }
    };

    rec.onresult = (event) => {
      if (recognitionRef.current !== rec) return;

      const transcript = event.results[0][0].transcript;
      setSpeechResult(transcript);

      const cleanTarget = targetText.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()?"]/g, "").replace(/\s{2,}/g, " ").trim();
      const cleanTranscript = transcript.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()?"]/g, "").replace(/\s{2,}/g, " ").trim();

      const wordsTarget = cleanTarget.split(" ");
      const wordsTranscript = cleanTranscript.split(" ");

      const targetWordsCount = wordsTarget.length;
      const transcriptWordsCount = wordsTranscript.length;

      // Word matching ratio (percentage of target words present in the transcript)
      const matchCount = wordsTarget.filter(w => wordsTranscript.includes(w)).length;
      const matchRatio = matchCount / Math.max(targetWordsCount, 1);

      // Length ratio (to avoid short 1-word inputs matching long sentences)
      const lengthRatio = Math.min(targetWordsCount, transcriptWordsCount) / Math.max(targetWordsCount, 1);

      // We match if it is an exact match or if the word overlap is high (>=0.65) and the spoken length is reasonable (>=0.5)
      const isMatch = (cleanTranscript === cleanTarget) || (matchRatio >= 0.65 && lengthRatio >= 0.5);

      if (isMatch) {
        setIsSpeechMatch(true);

        // 1. Add to category-specific completed items
        let categoryItems = JSON.parse(localStorage.getItem(`speechCompleted_${activeWeek}_${activeCategory}`)) || [];
        if (!categoryItems.includes(targetText)) {
          categoryItems.push(targetText);
          localStorage.setItem(`speechCompleted_${activeWeek}_${activeCategory}`, JSON.stringify(categoryItems));
          setCompletedSpeechItems(categoryItems);
        }

        // 2. Recalculate total unique items for the week across all categories
        let totalUnique = 0;
        const categoriesList = ["instructions", "questions", "stockSentences", "explanationSentences", "roleplay", "challenge"];
        categoriesList.forEach(cat => {
          const catItems = JSON.parse(localStorage.getItem(`speechCompleted_${activeWeek}_${cat}`)) || [];
          totalUnique += catItems.length;
        });
        setTotalSpeechCount(totalUnique);
      } else {
        setIsSpeechMatch(false);
      }
    };

    recognitionRef.current = rec;
    rec.start();
  };

  const stopSpeechRecognition = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.error("Error stopping speech recognition:", err);
      }
    }
    setIsListening(false);
  };

  const toggleListening = () => {
    if (isListening) {
      stopSpeechRecognition();
    } else if (activeSpeechItem) {
      startSpeechRecognition(activeSpeechItem);
    }
  };

  useEffect(() => {
    if (teacherSubject) {
      setActiveSubject(teacherSubject);
    }
  }, [teacherSubject]);

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

  // Session time tracker (total seconds spent on portal)
  const [sessionSeconds, setSessionSeconds] = useState(() => {
    try {
      const totalStored = localStorage.getItem("teacherTotalSessionTime");
      if (totalStored) return parseInt(totalStored, 10);
      
      const oldStored = JSON.parse(localStorage.getItem("teacherSessionTime")) || {};
      return oldStored.seconds || 0;
    } catch { return 0; }
  });

  const syncToFirestore = useCallback(async (weeksVal, secondsVal) => {
    if (!teacherMobileNumber && (!teacherName || !teacherSchoolCode)) return;
    try {
      const docId = teacherMobileNumber || `${teacherSchoolCode}_${teacherName.trim().replace(/\s+/g, "_")}_${activeSubject}`;
      await setDoc(doc(db, "teachers", docId), {
        teacherName: teacherName.trim(),
        schoolCode: teacherSchoolCode,
        subject: activeSubject,
        completedWeeks: weeksVal,
        sessionSeconds: secondsVal,
        lastActiveDate: new Date().toISOString().split("T")[0],
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (err) {
      console.error("Error syncing teacher progress to Firestore:", err);
    }
  }, [teacherName, teacherSchoolCode, activeSubject, teacherMobileNumber]);

  // Initial load sync
  useEffect(() => {
    syncToFirestore(completedWeeks, sessionSeconds);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Periodic sync to Firestore: every minute
  useEffect(() => {
    if (sessionSeconds > 0 && sessionSeconds % 60 === 0) {
      syncToFirestore(completedWeeks, sessionSeconds);
    }
  }, [sessionSeconds, completedWeeks, syncToFirestore]);

  // Timer - count up in 1-minute increments (ticks every 60 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      // 1. Increment total session seconds by 60
      setSessionSeconds(prevTotal => {
        const nextTotal = prevTotal + 60;
        localStorage.setItem("teacherTotalSessionTime", nextTotal.toString());
        return nextTotal;
      });

      // 2. Increment weekly session seconds by 60
      setWeeklySessionSeconds(prevWeekly => {
        const nextWeekly = prevWeekly + 60;
        localStorage.setItem(`teacherWeeklySessionTime_${activeWeek}`, nextWeekly.toString());
        return nextWeekly;
      });
    }, 60000); // Ticks every 1 minute
    return () => clearInterval(interval);
  }, [activeWeek]);

  const REQUIRED_MINUTES = 60;
  const requiredSeconds = REQUIRED_MINUTES * 60;
  const timeRemaining = Math.max(0, requiredSeconds - weeklySessionSeconds);
  const hasSpentEnoughTime = weeklySessionSeconds >= requiredSeconds;
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
    if (totalSpeechCount < 3) return false; // need speech practice
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
    if (totalSpeechCount < 3) {
      return `Speak 3 items (Done: ${totalSpeechCount}/3)`;
    }
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
    syncToFirestore(updated, sessionSeconds);
  };

  const progressPercent = Math.round((completedWeeks.length / 10) * 100);

  const milestones = [
    { week: 3, label: "Emerging Communicator", icon: <Target size={14} /> },
    { week: 6, label: "Classroom Speaker", icon: <GraduationCap size={14} /> },
    { week: 8, label: "Confident Communicator", icon: <Sparkles size={14} /> },
    { week: 10, label: "Fluent Facilitator", icon: <Trophy size={14} /> }
  ];

  const currentMilestone = milestones.filter(m => completedWeeks.length >= m.week).pop();

  const weeks = Array.from({ length: 10 }, (_, i) => `week-${i + 1}`);

  const subjects = useMemo(() => {
    const allSubjects = [
      { id: "english", label: "English", icon: <Book size={18} /> },
      { id: "mathematics", label: "Mathematics", icon: <Calculator size={18} /> },
      { id: "science", label: "Science", icon: <FlaskConical size={18} /> },
      { id: "evs", label: "EVS", icon: <Leaf size={18} /> },
      { id: "socialStudies", label: "Social Studies", icon: <Globe size={18} /> },
      { id: "computerScience", label: "Computer Science", icon: <Cpu size={18} /> },
      { id: "physicalTraining", label: "Physical Training", icon: <Dumbbell size={18} /> }
    ];
    if (teacherSubject) {
      return allSubjects.filter(sub => sub.id === teacherSubject);
    }
    return allSubjects;
  }, [teacherSubject]);

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
  const rawContentList = useMemo(() => {
    if (["instructions", "questions", "stockSentences", "explanationSentences"].includes(activeCategory)) {
      return currentSubjectData[activeCategory] || [];
    }
    return [];
  }, [activeCategory, currentSubjectData]);

  // Translate helper using public gtx API
  const translateText = useCallback(async (text, targetLang) => {
    if (!text || targetLang === "en") return text;
    const cacheKey = `${targetLang}-${text}`;
    
    if (translationCacheRef.current[cacheKey]) {
      return translationCacheRef.current[cacheKey];
    }

    try {
      const res = await fetch(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`
      );
      const data = await res.json();
      const translated = data[0].map(item => item[0]).join("");
      translationCacheRef.current[cacheKey] = translated;
      return translated;
    } catch (error) {
      console.error("Translation error:", error);
      return text;
    }
  }, []);

  // Selection change tooltip cleaner
  useEffect(() => {
    const closeTooltip = () => setSelectedWordInfo(null);
    document.addEventListener("click", closeTooltip);
    return () => document.removeEventListener("click", closeTooltip);
  }, []);

  // Selection change translator
  const handleTextSelection = async (e) => {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();
    
    // We only translate if it's a single word (no spaces, length 2 to 30)
    if (!selectedText || selectedText.includes(" ") || selectedText.length < 2 || selectedText.length > 30) {
      return;
    }

    // Clean punctuation
    const cleanWord = selectedText.replace(/[.,/#!$%^&*;:{}=\-_`~()?"]/g, "");
    if (!cleanWord || cleanWord.length < 2) return;

    // Get position for the tooltip relative to viewport
    let x = 0;
    let y = 0;
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      x = rect.left + window.scrollX + rect.width / 2;
      y = rect.top + window.scrollY - 10;
    } else {
      x = e.pageX;
      y = e.pageY - 10;
    }

    setSelectedWordInfo({ word: cleanWord, translation: "...", x, y });

    const telugu = await translateText(cleanWord, "te");
    setSelectedWordInfo({ word: cleanWord, translation: telugu, x, y });
  };

  // Touch long press translator helpers for mobile layout
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    touchStartRef.current = {
      time: Date.now(),
      x: touch.clientX,
      y: touch.clientY
    };
  };

  const handleTouchEnd = async (e) => {
    if (!touchStartRef.current) return;
    const touch = e.changedTouches[0];
    const duration = Date.now() - touchStartRef.current.time;
    const diffX = Math.abs(touch.clientX - touchStartRef.current.x);
    const diffY = Math.abs(touch.clientY - touchStartRef.current.y);

    // If held for > 500ms and didn't drag/move much
    if (duration > 500 && diffX < 10 && diffY < 10) {
      e.preventDefault();
      
      let range;
      let textNode;
      let offset;

      if (document.caretRangeFromPoint) {
        range = document.caretRangeFromPoint(touch.clientX, touch.clientY);
        if (range) {
          textNode = range.startContainer;
          offset = range.startOffset;
        }
      } else if (document.caretPositionFromPoint) {
        const position = document.caretPositionFromPoint(touch.clientX, touch.clientY);
        if (position) {
          textNode = position.offsetNode;
          offset = position.offset;
        }
      }

      if (textNode && textNode.nodeType === Node.TEXT_NODE) {
        const text = textNode.textContent;
        let start = offset;
        while (start > 0 && /\w/.test(text[start - 1])) {
          start--;
        }
        let end = offset;
        while (end < text.length && /\w/.test(text[end])) {
          end++;
        }
        
        const word = text.slice(start, end).replace(/[.,/#!$%^&*;:{}=\-_`~()?"]/g, "").trim();
        if (word && word.length >= 2 && word.length <= 30) {
          const x = touch.pageX;
          const y = touch.pageY - 10;
          
          setSelectedWordInfo({ word, translation: "...", x, y });
          const telugu = await translateText(word, "te");
          setSelectedWordInfo({ word, translation: telugu, x, y });
        }
      }
    }
    touchStartRef.current = null;
  };

  const handleContextMenu = (e) => {
    if (window.innerWidth <= 768) {
      e.preventDefault();
    }
  };

  // Synchronize translation lists
  useEffect(() => {
    let active = true;
    if (currentLang === "en") {
      setTranslatedList(rawContentList);
      setTranslatedRoleplay(currentSubjectData.roleplays || []);
      setTranslatedChallenge(currentSubjectData.challenge || activeWeekData.challenge || "");
      setIsTranslating(false);
      return;
    }

    setIsTranslating(true);
    const translateCurrentView = async () => {
      try {
        if (["instructions", "questions", "stockSentences", "explanationSentences"].includes(activeCategory)) {
          const translated = await Promise.all(
            rawContentList.map(item => translateText(item, currentLang))
          );
          if (active) {
            setTranslatedList(translated);
            setIsTranslating(false);
          }
        } else if (activeCategory === "roleplay") {
          const rawRoleplay = currentSubjectData.roleplays || [];
          const translated = await Promise.all(
            rawRoleplay.map(async item => ({
              speaker: item.speaker,
              text: await translateText(item.text, currentLang)
            }))
          );
          if (active) {
            setTranslatedRoleplay(translated);
            setIsTranslating(false);
          }
        } else if (activeCategory === "challenge") {
          const rawChallenge = currentSubjectData.challenge || activeWeekData.challenge || "";
          const translated = await translateText(rawChallenge, currentLang);
          if (active) {
            setTranslatedChallenge(translated);
            setIsTranslating(false);
          }
        }
      } catch (err) {
        console.error("Translation run error:", err);
        if (active) setIsTranslating(false);
      }
    };

    translateCurrentView();
    return () => {
      active = false;
    };
  }, [activeWeek, activeSubject, activeCategory, currentLang, rawContentList, currentSubjectData, activeWeekData, translateText]);

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
      textToRead = translatedList.map((item, i) => `${i + 1}. ${item}`).join(". ");
    } else if (activeCategory === "roleplay") {
      textToRead = translatedRoleplay.map(d => `${d.speaker}: ${d.text}`).join(". ");
    } else if (activeCategory === "challenge") {
      textToRead = translatedChallenge || "";
    }

    if (!textToRead) return;

    const utterance = new SpeechSynthesisUtterance(textToRead);
    
    if (currentLang === "hi") {
      utterance.lang = "hi-IN";
    } else if (currentLang === "te") {
      utterance.lang = "te-IN";
    } else {
      utterance.lang = "en-IN";
    }

    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  }, [isSpeaking, activeCategory, translatedList, translatedRoleplay, translatedChallenge, currentLang]);

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
            {onLogout && (
              <button className="teacher-logout-btn" onClick={onLogout} title="Change Subject or Logout">
                Log Out
              </button>
            )}
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
            <span className="progress-fraction">{completedWeeks.length}/10 Weeks</span>
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
              style={{ left: `${(m.week / 10) * 100}%` }}
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
        {!completedWeeks.includes(activeWeek) && activeWeek === nextWeekToComplete && (
          <div className="weekly-time-progress-bar" style={{ marginTop: "20px", padding: "14px", background: "rgba(13, 45, 89, 0.03)", borderRadius: "12px", border: "1px dashed rgba(13, 45, 89, 0.15)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: "600", color: "var(--primary)" }}>
                <Clock size={15} style={{ color: "var(--secondary)" }} />
                <span>Time spent this week (Gate):</span>
              </div>
              <span style={{ fontSize: "13px", fontWeight: "700", color: hasSpentEnoughTime ? "#10b981" : "#eab308" }}>
                {Math.floor(weeklySessionSeconds / 60)}m / 60m {hasSpentEnoughTime ? "✓" : ""}
              </span>
            </div>
            <div style={{ width: "100%", height: "6px", background: "rgba(0,0,0,0.06)", borderRadius: "3px", overflow: "hidden" }}>
              <div 
                style={{ 
                  width: `${Math.min(100, (weeklySessionSeconds / 3600) * 100)}%`, 
                  height: "100%", 
                  background: hasSpentEnoughTime ? "linear-gradient(90deg, #10b981, #059669)" : "linear-gradient(90deg, #f59e0b, #d97706)",
                  transition: "width 0.3s ease" 
                }} 
              />
            </div>
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
            <strong>Focus:</strong> {currentSubjectData.focus || activeWeekData.focus}
          </div>
          <div className="curriculum-theme">
            <strong>Weekly Theme:</strong> {currentSubjectData.theme || activeWeekData.theme}
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
                  <div className="language-selector">
                    <button 
                      className={`lang-btn ${currentLang === "en" ? "active" : ""}`} 
                      onClick={() => setCurrentLang("en")}
                    >
                      English
                    </button>
                    <button 
                      className={`lang-btn ${currentLang === "hi" ? "active" : ""}`} 
                      onClick={() => setCurrentLang("hi")}
                    >
                      हिन्दी
                    </button>
                    <button 
                      className={`lang-btn ${currentLang === "te" ? "active" : ""}`} 
                      onClick={() => setCurrentLang("te")}
                    >
                      తెలుగు
                    </button>
                  </div>
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

              <div className="details-body" onMouseUp={handleTextSelection} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} onContextMenu={handleContextMenu}>
                {isTranslating ? (
                  <div className="translation-loading" style={{ textAlign: "center", padding: "40px" }}>
                    <div className="spinner" />
                    <p style={{ marginTop: "12px", color: "var(--text-muted)", fontSize: "14px" }}>
                      Translating to {currentLang === "hi" ? "Hindi" : "Telugu"}...
                    </p>
                  </div>
                ) : (
                  <>
                    {/* SPEECH PRACTICE ZONE */}
                    {!completedWeeks.includes(activeWeek) && activeWeek === nextWeekToComplete && (
                      <div className="speech-practice-card">
                        <div className="speech-practice-header">
                          <div className="speech-practice-title-wrapper">
                            <Mic size={18} className={`mic-pulse-icon ${isListening ? "pulse" : ""}`} />
                            <h4>Speaking Practice (Unlock Gate)</h4>
                          </div>
                          <span className="practice-progress-tag">{completedSpeechItems.length}/3 Completed</span>
                        </div>
                        <p className="practice-desc">
                          To unlock Week {activeWeek.split("-")[1]}, select any instruction, question, or challenge below by clicking its <strong>mic icon 🎙️</strong>, then speak it aloud clearly.
                        </p>
                        <div className="practice-stars">
                          {[1, 2, 3].map(i => (
                            <Star 
                              key={i} 
                              size={22} 
                              className={i <= completedSpeechItems.length ? "star-active" : "star-inactive"} 
                              fill={i <= completedSpeechItems.length ? "#eba925" : "none"} 
                            />
                          ))}
                        </div>
                        
                        {activeSpeechItem ? (
                          <div className="active-practice-area">
                            <div className="practice-target">
                              <strong>Read this sentence:</strong>
                              <p className="target-text-bubble">"{activeSpeechItem}"</p>
                            </div>
                            
                            {isListening && (
                              <div className="listening-indicator">
                                <div className="pulse-ring"></div>
                                <span>Listening... Speak now</span>
                              </div>
                            )}
                            
                            {speechError && (
                              <div className="speech-error-msg" style={{ margin: "10px 0", padding: "10px 14px", background: "#fef2f2", border: "1px solid #fee2e2", borderRadius: "8px", color: "#991b1b", fontSize: "12.5px", fontWeight: "600", display: "flex", alignItems: "center", gap: "6px" }}>
                                <span>⚠️ {speechError}</span>
                              </div>
                            )}
                            
                            {speechResult && (
                              <div className="speech-result-preview">
                                <strong>We heard:</strong>
                                <p className="heard-text-bubble">"{speechResult}"</p>
                                {isSpeechMatch ? (
                                  <span className="speech-success-msg">✓ Excellent! matches target text.</span>
                                ) : (
                                  <span className="speech-retry-msg">✗ Try reading it again clearly.</span>
                                )}
                              </div>
                            )}

                            <div className="practice-actions">
                              <button 
                                type="button" 
                                className={`listen-btn ${isListening ? "active" : ""}`}
                                onClick={toggleListening}
                              >
                                {isListening ? "Stop Listening" : "Start Speaking"}
                              </button>
                              <button 
                                type="button" 
                                className="cancel-practice-btn"
                                onClick={() => {
                                  stopSpeechRecognition();
                                  setActiveSpeechItem("");
                                  setSpeechResult("");
                                }}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p className="select-tip-text">💡 Click the microphone icon next to any text item below to start speaking practice.</p>
                        )}
                      </div>
                    )}

                    {/* Standard sentence lists (10 items) */}
                    {["instructions", "questions", "stockSentences", "explanationSentences"].includes(activeCategory) && (
                      <ul className="content-list">
                        {translatedList.map((item, index) => (
                          <motion.li
                            key={index}
                            className="content-item"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <div className="bullet-point">{index + 1}</div>
                            <div className="content-text">{item}</div>
                            {!completedWeeks.includes(activeWeek) && activeWeek === nextWeekToComplete && (
                              <button 
                                className={`item-practice-btn ${activeSpeechItem === item ? "active" : ""} ${completedSpeechItems.includes(item) ? "completed" : ""}`}
                                onClick={() => startSpeechRecognition(item)}
                                title="Practice speaking this item"
                              >
                                {completedSpeechItems.includes(item) ? <Check size={14} style={{ color: "#10b981" }} /> : <Mic size={14} />}
                              </button>
                            )}
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
                          {translatedRoleplay.map((utterance, index) => {
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
                                <div className="dialogue-bubble-container" style={{ display: "flex", alignItems: "center", gap: "10px", width: "100%", justifyContent: isTeacher ? "flex-end" : "flex-start" }}>
                                  <div className={`dialogue-bubble ${isTeacher ? "teacher-bubble" : "student-bubble"}`}>
                                    {utterance.text}
                                  </div>
                                  {!completedWeeks.includes(activeWeek) && activeWeek === nextWeekToComplete && (
                                    <button 
                                      className={`item-practice-btn dialogue-mic-btn ${activeSpeechItem === utterance.text ? "active" : ""} ${completedSpeechItems.includes(utterance.text) ? "completed" : ""}`}
                                      onClick={() => startSpeechRecognition(utterance.text)}
                                      title="Practice speaking this dialogue line"
                                    >
                                      {completedSpeechItems.includes(utterance.text) ? <Check size={14} style={{ color: "#10b981" }} /> : <Mic size={14} />}
                                    </button>
                                  )}
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
                        <p className="challenge-main-text">{translatedChallenge}</p>
                        {!completedWeeks.includes(activeWeek) && activeWeek === nextWeekToComplete && (
                          <button 
                            type="button"
                            className={`challenge-practice-btn ${activeSpeechItem === translatedChallenge ? "active" : ""} ${completedSpeechItems.includes(translatedChallenge) ? "completed" : ""}`}
                            onClick={() => startSpeechRecognition(translatedChallenge)}
                            style={{
                              marginTop: "20px",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "8px",
                              padding: "10px 18px",
                              background: completedSpeechItems.includes(translatedChallenge) ? "linear-gradient(135deg, #10b981 0%, #059669 100%)" : "linear-gradient(135deg, #0d2d59 0%, #1e40af 100%)",
                              color: "white",
                              border: "none",
                              borderRadius: "10px",
                              cursor: "pointer",
                              fontWeight: "600",
                              fontSize: "13.5px"
                            }}
                          >
                            {completedSpeechItems.includes(translatedChallenge) ? <Check size={14} /> : <Mic size={14} />} Practice Speaking Challenge
                          </button>
                        )}
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
                  </>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      {selectedWordInfo && (
        <div 
          className="word-translation-tooltip"
          style={{
            position: "absolute",
            left: `${selectedWordInfo.x}px`,
            top: `${selectedWordInfo.y}px`,
            transform: "translate(-50%, -100%)",
            zIndex: 10000,
            background: "var(--primary)",
            color: "white",
            padding: "6px 12px",
            borderRadius: "8px",
            fontSize: "12.5px",
            fontWeight: "600",
            boxShadow: "0 4px 15px rgba(13, 45, 89, 0.25)",
            pointerEvents: "none",
            animation: "fadeInUp 0.15s ease-out"
          }}
        >
          <span style={{ opacity: 0.8, marginRight: "6px" }}>{selectedWordInfo.word} →</span>
          <span>{selectedWordInfo.translation}</span>
          <div 
            className="tooltip-arrow"
            style={{
              position: "absolute",
              bottom: "-4px",
              left: "50%",
              transform: "translateX(-50%) rotate(45deg)",
              width: "8px",
              height: "8px",
              background: "var(--primary)"
            }}
          />
        </div>
      )}
    </div>
  );
}
