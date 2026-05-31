import React, { useState, useEffect, useRef } from "react";
import { Mic, PhoneOff, Shield, SkipForward, Play, Pause, X, AlertCircle } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import studentsData from "../data/StudentsData";
import "./VoiceBot.css";

export default function VoiceBot() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const [appState, setAppState] = useState("IDLE"); // 'IDLE', 'SPEAKING', 'LISTENING', 'PROCESSING'
  const [mode, setMode] = useState("NAVIGATION"); // 'NAVIGATION', 'READING', 'ROLEPLAY'
  
  const [studentText, setStudentText] = useState("");
  const [permissionError, setPermissionError] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  
  // Caption state for single-line display
  const [currentCaptionLine, setCurrentCaptionLine] = useState("");

  // Reading states
  const [readingTitle, setReadingTitle] = useState("");
  const [readingIndex, setReadingIndex] = useState(-1);
  const [readingLines, setReadingLines] = useState([]);

  // Roleplay states
  const [roleplayTitle, setRoleplayTitle] = useState("");
  const [roleplayIndex, setRoleplayIndex] = useState(-1);
  const [roleplayLines, setRoleplayLines] = useState([]);
  const [userRole, setUserRole] = useState("");
  const [botRole, setBotRole] = useState("");

  // Quiz states
  const [quizQuestion, setQuizQuestion] = useState("");
  const [quizKeywords, setQuizKeywords] = useState([]);
  const [quizAnswerHint, setQuizAnswerHint] = useState("");

  // Refs to avoid stale closures in listeners
  const appStateRef = useRef("IDLE");
  const modeRef = useRef("NAVIGATION");
  const recognitionRef = useRef(null);
  const activeUtteranceRef = useRef(null);
  const captionTimersRef = useRef([]);
  const isOpenRef = useRef(false);

  const readingLinesRef = useRef([]);
  const readingIndexRef = useRef(-1);
  const readingTitleRef = useRef("");
  
  const roleplayLinesRef = useRef([]);
  const roleplayIndexRef = useRef(-1);
  const userRoleRef = useRef("");
  const botRoleRef = useRef("");

  const quizKeywordsRef = useRef([]);
  const quizAnswerHintRef = useRef("");

  // Sync refs with state
  useEffect(() => { appStateRef.current = appState; }, [appState]);
  useEffect(() => { modeRef.current = mode; }, [mode]);
  useEffect(() => { isOpenRef.current = isOpen; }, [isOpen]);
  useEffect(() => { readingLinesRef.current = readingLines; }, [readingLines]);
  useEffect(() => { readingIndexRef.current = readingIndex; }, [readingIndex]);
  useEffect(() => { readingTitleRef.current = readingTitle; }, [readingTitle]);
  useEffect(() => { roleplayLinesRef.current = roleplayLines; }, [roleplayLines]);
  useEffect(() => { roleplayIndexRef.current = roleplayIndex; }, [roleplayIndex]);
  useEffect(() => { userRoleRef.current = userRole; }, [userRole]);
  useEffect(() => { botRoleRef.current = botRole; }, [botRole]);
  useEffect(() => { quizKeywordsRef.current = quizKeywords; }, [quizKeywords]);
  useEffect(() => { quizAnswerHintRef.current = quizAnswerHint; }, [quizAnswerHint]);

  // Clean up all active caption timeouts
  const clearCaptionTimers = () => {
    if (captionTimersRef.current) {
      captionTimersRef.current.forEach(clearTimeout);
      captionTimersRef.current = [];
    }
  };

  // Split text by punctuation marks and run a timer-based display loop matching normal speech rate
  const startCaptionRunner = (fullText) => {
    clearCaptionTimers();

    const segments = fullText.split(/(?<=[.,!?;])\s+/).filter(s => s.trim().length > 0);
    
    if (segments.length === 0) {
      setCurrentCaptionLine(fullText);
      return;
    }

    setCurrentCaptionLine(segments[0]);

    let accumulatedTime = 0;
    for (let i = 1; i < segments.length; i++) {
      const previousSegment = segments[i - 1];
      const wordCount = previousSegment.split(/\s+/).length;
      
      const duration = (wordCount * 420) + 150;
      accumulatedTime += duration;

      const timer = setTimeout(() => {
        setCurrentCaptionLine(segments[i]);
      }, accumulatedTime);

      captionTimersRef.current.push(timer);
    }
  };

  // Speak synthesizer with watchdog timer to prevent onend missed GC bug
  const speak = (text, callback) => {
    if (!window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    clearCaptionTimers();

    setAppState("SPEAKING");
    startCaptionRunner(text);

    const utterance = new SpeechSynthesisUtterance(text);
    activeUtteranceRef.current = utterance;

    // Chrome's Indian English voice — find en-IN, which Chrome provides natively
    const voices = window.speechSynthesis.getVoices();

    // Pick the first en-IN voice Chrome provides (e.g. "Google हिन्दी" / Indian English)
    const selectedVoice = voices.find(v => v.lang === "en-IN");

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    // Always set lang to en-IN so Chrome uses Indian English pronunciation
    utterance.lang = "en-IN";
    
    utterance.pitch = 1.15;
    utterance.rate = 0.95;

    let hasEnded = false;
    const estimatedDuration = (text.length * 80) + 2000; // 80ms per char + 2s padding

    const handleEnd = () => {
      if (hasEnded) return;
      hasEnded = true;
      clearTimeout(watchdog);
      activeUtteranceRef.current = null;
      clearCaptionTimers();
      
      if (!isOpenRef.current) {
        return;
      }

      if (callback) {
        callback();
      } else {
        if (appStateRef.current !== "IDLE") {
          setAppState("LISTENING");
        }
      }
    };

    utterance.onend = handleEnd;

    utterance.onerror = (e) => {
      console.error("Speech Synthesis Error:", e);
      handleEnd();
    };

    const watchdog = setTimeout(() => {
      console.warn("Watchdog timeout: SpeechSynthesis.onend missed.");
      handleEnd();
    }, estimatedDuration);

    window.speechSynthesis.speak(utterance);
  };

  // Start general session
  const startVoiceMode = () => {
    setIsOpen(true);
    setStudentText("");
    setCurrentCaptionLine("");
    setPermissionError(false);
    setMode("NAVIGATION");
    setAppState("SPEAKING");

    const welcome = "Welcome to Excellence Voices! I am Praveena, your Excellence AI Trainer. You can say: Go to Class 9, Read 1st story of Class 2, Read 3rd skit, or just Read 4th story if you are already in a class.";
    speak(welcome);
  };

  // Stop session
  const stopVoiceMode = () => {
    setIsOpen(false);
    isOpenRef.current = false; // set immediately to prevent race conditions
    setAppState("IDLE");
    setMode("NAVIGATION");
    clearCaptionTimers();
    activeUtteranceRef.current = null;
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
  };

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const rec = new SpeechRecognition();
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = "en-US"; // Standard en-US for maximum platform compatibility

    rec.onstart = () => {
      setPermissionError(false);
    };

    rec.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setStudentText(transcript);
      setAppState("PROCESSING");
      
      handleSpeechInput(transcript);
    };

    rec.onerror = (e) => {
      console.error("Speech Recognition Error:", e.error);
      if (e.error === "not-allowed" || e.error === "service-not-allowed") {
        setPermissionError(true);
        setAppState("IDLE");
      } else if (e.error === "no-speech") {
        if (appStateRef.current === "LISTENING") {
          restartListening();
        }
      } else {
        if (appStateRef.current === "LISTENING") {
          setAppState("LISTENING");
        }
      }
    };

    rec.onend = () => {
      if (appStateRef.current === "LISTENING") {
        restartListening();
      }
    };

    recognitionRef.current = rec;

    return () => {
      clearCaptionTimers();
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Monitor appState changes to control microphone
  useEffect(() => {
    if (!recognitionRef.current) return;

    if (appState === "LISTENING") {
      try {
        recognitionRef.current.start();
      } catch (e) {}
    } else {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
  }, [appState]);

  const restartListening = () => {
    if (recognitionRef.current && appStateRef.current === "LISTENING") {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      
      setTimeout(() => {
        if (appStateRef.current === "LISTENING") {
          try {
            recognitionRef.current.start();
          } catch (e) {}
        }
      }, 300);
    }
  };

  // Helper to extract title matching item in studentsData
  const findItemByTitle = (titleQuery) => {
    const cleanQuery = titleQuery.toLowerCase().trim();
    let foundItem = null;
    let foundClass = "";
    let foundCategory = "";

    Object.keys(studentsData).forEach((clsKey) => {
      Object.keys(studentsData[clsKey]).forEach((catKey) => {
        const itemsList = studentsData[clsKey][catKey];
        if (Array.isArray(itemsList)) {
          const matched = itemsList.find((i) => 
            i.title.toLowerCase().includes(cleanQuery) || 
            cleanQuery.includes(i.title.toLowerCase())
          );
          if (matched) {
            foundItem = matched;
            foundClass = clsKey;
            foundCategory = catKey;
          }
        }
      });
    });

    return foundItem ? { item: foundItem, classKey: foundClass, categoryKey: foundCategory } : null;
  };

  // Helper to get active item on the current route (if any)
  const getCurrentItem = () => {
    const pathParts = location.pathname.split("/");
    if (pathParts.length >= 5) {
      const classId = pathParts[2];
      const category = pathParts[3];
      const id = pathParts[4];
      return studentsData[classId]?.[category]?.find((i) => i.id === Number(id));
    }
    return null;
  };

  // Normalize number words to digits/ordinals
  // Uses simple string replacement (no \b) for max compatibility across browsers/mobile
  const normalizeNumbers = (text) => {
    let t = text.toLowerCase();
    // Ordinal words first (longer matches first to avoid partial replacements)
    t = t.replace(/\btwelfth\b/g, "12th").replace(/\beleventh\b/g, "11th").replace(/\btenth\b/g, "10th");
    t = t.replace(/\bninth\b/g, "9th").replace(/\beighth\b/g, "8th").replace(/\bseventh\b/g, "7th");
    t = t.replace(/\bsixth\b/g, "6th").replace(/\bfifth\b/g, "5th").replace(/\bfourth\b/g, "4th");
    t = t.replace(/\bthird\b/g, "3rd").replace(/\bsecond\b/g, "2nd").replace(/\bfirst\b/g, "1st");
    // Cardinal words (longer first to avoid 'twelve' matching inside nothing, but still safe)
    t = t.replace(/\btwelve\b/g, "12").replace(/\beleven\b/g, "11").replace(/\bten\b/g, "10");
    t = t.replace(/\bnine\b/g, "9").replace(/\beight\b/g, "8").replace(/\bseven\b/g, "7");
    t = t.replace(/\bsix\b/g, "6").replace(/\bfive\b/g, "5").replace(/\bfour\b/g, "4");
    t = t.replace(/\bthree\b/g, "3").replace(/\btwo\b/g, "2").replace(/\bone\b/g, "1");
    return t;
  };

  /**
   * Smart ordinal command parser — handles flexible word order & context-awareness.
   *
   * Supported patterns:
   *  - "read 1st story of class 2"           → item 1 in class-2 stories
   *  - "read 1st story of 2nd class"          → item 1 in class-2 stories
   *  - "go to 1st class read 4th story"       → item 4 in class-1 stories
   *  - "read 4th story" (when on class-8 page)→ item 4 in class-8 stories (uses URL context)
   *  - "read 3rd skit" (on class-8 skits page)→ item 3 in class-8 skits (uses URL+category context)
   *
   * @param {string} query Raw voice transcript
   * @param {string} currentPath Current URL pathname for context fallback
   */
  const parseOrdinalCommand = (query, currentPath = "") => {
    const normalized = normalizeNumbers(query);

    // Determine action verb
    let action = "";
    if (normalized.includes("read")) action = "read";
    else if (normalized.includes("practice") || normalized.includes("start")) action = "practice";
    else if (normalized.includes("open") || normalized.includes("go to")) action = "open";
    if (!action) return null;

    // Detect category keyword
    let category = "";
    if (normalized.includes("stor")) category = "stories";           // story / stories
    else if (normalized.includes("roleplay") || normalized.includes("role play")) category = "roleplays";
    else if (normalized.includes("skit")) category = "skits";
    else if (normalized.includes("activit")) category = "activities"; // activity / activities
    else if (normalized.includes("thought")) category = "goodThoughts";
    else if (normalized.includes("speaking") || normalized.includes("speech")) category = "publicSpeaking";
    else if (normalized.includes("sentence")) category = "stockSentences";

    // Extract ALL numbers with optional ordinal suffix, preserving their position
    const numPattern = /(\d+)(?:st|nd|rd|th)?/g;
    const allNums = [];
    let m;
    while ((m = numPattern.exec(normalized)) !== null) {
      allNums.push({ value: parseInt(m[1], 10), index: m.index });
    }

    if (allNums.length === 0) return null;

    // --- Resolve CLASS number ---
    let classNum = null;

    // Strategy 1: number immediately after the word "class"
    const classWordPos = normalized.lastIndexOf("class");
    if (classWordPos !== -1) {
      // find the first number AFTER "class"
      const afterClass = allNums.filter(n => n.index > classWordPos);
      if (afterClass.length > 0) classNum = afterClass[0].value;
    }

    // Strategy 2: number immediately BEFORE the word "class" (e.g. "2nd class")
    if (classNum === null && classWordPos !== -1) {
      const beforeClass = allNums.filter(n => n.index < classWordPos);
      if (beforeClass.length > 0) classNum = beforeClass[beforeClass.length - 1].value;
    }

    // Strategy 3: fall back to URL context (current class from path)
    if (classNum === null && currentPath) {
      const pathParts = currentPath.split("/");
      // e.g. /students/class-8/skits/3  → pathParts[2] = "class-8"
      const classSegment = pathParts.find(p => p.startsWith("class-"));
      if (classSegment) classNum = parseInt(classSegment.replace("class-", ""), 10);
    }

    if (classNum === null) return null;
    const classKey = `class-${classNum}`;

    // --- Resolve ITEM (category) category from URL context if not said ---
    if (!category && currentPath) {
      const pathParts = currentPath.split("/");
      // e.g. /students/class-8/skits/3 → pathParts[3] = "skits"
      const knownCategories = ["stories", "roleplays", "skits", "activities", "goodThoughts", "publicSpeaking", "stockSentences"];
      const urlCat = pathParts.find(p => knownCategories.includes(p));
      if (urlCat) category = urlCat;
    }

    if (!category) return null;

    // --- Resolve ITEM ordinal index ---
    // It's the number NOT used for class.
    // If class was resolved from URL context, all numbers are candidates for item index.
    let itemOrdinal = null;
    if (allNums.length === 1) {
      // Only one number found → it is the item index (class came from URL context)
      itemOrdinal = allNums[0].value;
    } else {
      // Multiple numbers: pick the one NOT used as the class number.
      // The class number we matched is 'classNum'. Find the OTHER number.
      // Prefer the number associated with a category keyword (nearest to category word).
      const catWordPos = normalized.search(/stor|roleplay|skit|activit|thought|speaking|sentence/);
      if (catWordPos !== -1) {
        // closest number to the category word that is not classNum
        const candidates = allNums.filter(n => n.value !== classNum || allNums.filter(x => x.value === classNum).length > 1);
        if (candidates.length > 0) {
          const nearest = candidates.reduce((a, b) =>
            Math.abs(a.index - catWordPos) < Math.abs(b.index - catWordPos) ? a : b
          );
          itemOrdinal = nearest.value;
        }
      }
      // Fallback: use the first number that isn't classNum
      if (itemOrdinal === null) {
        const other = allNums.find(n => n.value !== classNum);
        itemOrdinal = other ? other.value : allNums[0].value;
      }
    }

    if (itemOrdinal === null) return null;

    return {
      action,
      ordinalIndex: itemOrdinal - 1,   // convert 1-based to 0-based
      category,
      classKey
    };
  };

  // Routing speech transcripts
  const handleSpeechInput = (transcript) => {
    // Normalize number words immediately so ALL checks below work correctly
    // e.g. speech API gives "read first story from class eight" → "read 1st story from class 8"
    const query = normalizeNumbers(transcript.trim());

    // Global Exit Check
    const exitKeywords = ["stop", "cancel", "exit", "bye", "close", "quit"];
    const isExitCommand = exitKeywords.some(kw => {
      if (query === kw) return true;
      if (query.includes(kw) && query.length < 25) {
        if (modeRef.current === "ROLEPLAY") {
          const currentLine = roleplayLinesRef.current[roleplayIndexRef.current] || "";
          const dialogueText = currentLine.split(":").slice(1).join(":").trim().toLowerCase();
          if (!dialogueText.includes(kw)) {
            return true;
          }
          return false;
        }
        return true;
      }
      return false;
    });

    if (isExitCommand) {
      speak("Closing voice session. Keep speaking confidently! Goodbye!", () => {
        stopVoiceMode();
      });
      return;
    }

    // --- 0. QUIZ ACTIVE INPUT HANDLING ---
    if (modeRef.current === "QUIZ") {
      let feedback = "";
      if (quizKeywordsRef.current.length === 0) {
        // Fallback story quiz where exact keywords aren't defined
        feedback = `Excellent effort! You answered: "${transcript}". That's a great attempt. Keep practicing! Returning to Excellence Voices dashboard.`;
      } else {
        const isCorrect = quizKeywordsRef.current.some(k => query.includes(k));
        if (isCorrect) {
          feedback = `Excellent! You answered: "${transcript}". That is correct! Brilliant listening. Returning to Excellence Voices dashboard.`;
        } else {
          feedback = `Nice try! You answered: "${transcript}". The correct answer is related to ${quizAnswerHintRef.current}. You are doing great, keep practicing! Returning to Excellence Voices dashboard.`;
        }
      }
      speak(feedback, () => {
        endQuiz();
      });
      return;
    }

    // --- 1. ROLEPLAY ACTIVE INPUT HANDLING ---
    if (modeRef.current === "ROLEPLAY") {
      // Advancing turn after user speaks
      setTimeout(() => {
        if (modeRef.current === "ROLEPLAY") {
          const nextIdx = roleplayIndexRef.current + 1;
          setRoleplayIndex(nextIdx);
          playRoleplayTurn(nextIdx);
        }
      }, 1500);
      return;
    }

    // --- 2. READING ACTIVE INPUT HANDLING (ignores verbal commands unless "stop") ---
    if (modeRef.current === "READING") {
      setAppState("IDLE"); // Keep idle until they choose another action or return
      return;
    }

    // --- 3. GENERAL NAVIGATION & INITIATION COMMANDS ---
    // Ordinal Voice Commands — now context-aware, e.g.:
    //  "read 1st story of class 2", "read 1st story of 2nd class",
    //  "go to 1st class read 4th story", "read 4th story" (when on a class page)
    const ordinalCmd = parseOrdinalCommand(query, location.pathname);
    if (ordinalCmd) {
      const { action, ordinalIndex, category, classKey } = ordinalCmd;
      const classData = studentsData[classKey];
      if (classData) {
        const itemsList = classData[category];
        if (itemsList && itemsList[ordinalIndex]) {
          const item = itemsList[ordinalIndex];
          navigate(`/students/${classKey}/${category}/${item.id}`);
          if (action === "read") {
            startReading(item);
          } else if (action === "practice") {
            setupRoleplay(item);
          } else {
            speak(`Opening ${item.title}.`, () => {
              setAppState("LISTENING");
            });
          }
          return;
        } else {
          const totalCount = itemsList ? itemsList.length : 0;
          const displayCategory = category === "goodThoughts" ? "good thoughts" : category === "publicSpeaking" ? "public speaking" : category === "stockSentences" ? "stock sentences" : category;
          speak(`Class ${classKey.split("-")[1]} only has ${totalCount} ${displayCategory}.`, () => {
            setAppState("LISTENING");
          });
          return;
        }
      }
    }

    // Class Navigation — supports both "class 8" and "class eight" (already normalized)
    if (query.includes("go to class") || query.includes("open class") || query.includes("go class")) {
      const match = query.match(/class\s*(\d+)/);
      if (match) {
        const classNum = match[1];
        navigate(`/students/class-${classNum}`);
        speak(`Opening Class ${classNum}. You can now select a story or dialogue to practice.`, () => {
          setAppState("LISTENING");
        });
        return;
      }
    }

    // Navigation Home
    if (query.includes("go home") || query.includes("go back") || query === "back" || query.includes("open portal")) {
      navigate("/students");
      speak("Opening Students Portal Dashboard.", () => {
        setAppState("LISTENING");
      });
      return;
    }

    // Start reading current page story
    if ((query.includes("read story") || query.includes("read this") || query.includes("read aloud")) && getCurrentItem()) {
      startReading(getCurrentItem());
      return;
    }

    // Start roleplaying current page dialogue
    if ((query.includes("practice dialogue") || query.includes("practice skit") || query.includes("start practice") || query.includes("practice this")) && getCurrentItem()) {
      setupRoleplay(getCurrentItem());
      return;
    }

    // Read target story
    if (query.startsWith("read ") || query.includes("read story ")) {
      const titleQuery = query.replace("read story", "").replace("read", "").replace("story", "").trim();
      const matchInfo = findItemByTitle(titleQuery);
      if (matchInfo) {
        navigate(`/students/${matchInfo.classKey}/${matchInfo.categoryKey}/${matchInfo.item.id}`);
        startReading(matchInfo.item);
        return;
      }
    }

    // Practice target skit
    if (query.startsWith("practice ") || query.includes("practice skit ") || query.includes("practice dialogue ")) {
      const titleQuery = query.replace("practice skit", "").replace("practice dialogue", "").replace("practice", "").replace("dialogue", "").replace("skit", "").trim();
      const matchInfo = findItemByTitle(titleQuery);
      if (matchInfo) {
        navigate(`/students/${matchInfo.classKey}/${matchInfo.categoryKey}/${matchInfo.item.id}`);
        setupRoleplay(matchInfo.item);
        return;
      }
    }

    // Help command
    if (query.includes("help") || query.includes("what can i say")) {
      speak("You can say: Go to Class 9. Read 1st story of Class 2. Read 1st story of 2nd class. Or if you are already in a class, just say Read 4th story or Read 3rd skit. You can also say Practice Skit or Go Back.", () => {
        setAppState("LISTENING");
      });
      return;
    }

    // Fallback instruction
    speak("I didn't recognize that command. Try saying: Go to Class 9, or read followed by a story title.", () => {
      setAppState("LISTENING");
    });
  };

  // --- READING CONTROLLER LOOP ---
  const startReading = (item) => {
    if (!item || !item.content) return;

    // Clean and segment lines (ignore empty lines)
    const rawLines = item.content.trim().split("\n");
    const storyLines = rawLines
      .map(line => line.trim())
      .filter(line => line !== "" && !line.startsWith("Scene") && !line.startsWith("Characters") && !line.startsWith("Props"));

    if (storyLines.length === 0) {
      speak("This page doesn't contain readable sentences.", () => {
        setAppState("LISTENING");
      });
      return;
    }

    setMode("READING");
    setReadingTitle(item.title);
    setReadingLines(storyLines);
    setReadingIndex(0);

    const intro = `Now reading: ${item.title}. Let's listen!`;
    speak(intro, () => {
      if (modeRef.current !== "READING" || appStateRef.current === "IDLE") return;
      playReadingTurn(0, storyLines);
    });
  };

  const playReadingTurn = (idx, lines = readingLinesRef.current) => {
    if (idx >= lines.length) {
      startQuiz(readingTitleRef.current);
      return;
    }

    // Render the caption line
    setCurrentCaptionLine(lines[idx]);
    speak(lines[idx], () => {
      if (modeRef.current !== "READING" || appStateRef.current === "IDLE") return;
      const nextIdx = idx + 1;
      setReadingIndex(nextIdx);
      playReadingTurn(nextIdx, lines);
    });
  };

  const pauseReading = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    clearCaptionTimers();
    setAppState("IDLE");
  };

  const resumeReading = () => {
    setAppState("SPEAKING");
    playReadingTurn(readingIndexRef.current);
  };

  const endReading = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    clearCaptionTimers();
    setMode("NAVIGATION");
    setReadingIndex(-1);
    setReadingLines([]);
    setReadingTitle("");
    setCurrentCaptionLine("Read story aloud or start dialogue practice!");
    setAppState("LISTENING");
  };

  // Story quizzes database
  const storyQuizzes = {
    "the lost pencil": {
      question: "Who lost their new pencil at school?",
      keywords: ["riya", "ria"],
      answerHint: "Riya"
    },
    "the lion and the mouse": {
      question: "Who woke up the sleeping lion angrily?",
      keywords: ["mouse", "rat", "little mouse"],
      answerHint: "the mouse"
    },
    "the thirsty crow": {
      question: "What did the thirsty crow drop into the pitcher to raise the water?",
      keywords: ["pebble", "pebbles", "stone", "stones"],
      answerHint: "pebbles or stones"
    },
    "the boy who cried wolf": {
      question: "What animal did the shepherd boy lie about to trick the villagers?",
      keywords: ["wolf", "wolves"],
      answerHint: "a wolf"
    },
    "the tortoise and the hare": {
      question: "Who won the running race in the end?",
      keywords: ["tortoise", "turtle", "tortise"],
      answerHint: "the tortoise"
    },
    "two silly goats": {
      question: "Where did the two goats meet and refuse to give way?",
      keywords: ["bridge", "narrow bridge"],
      answerHint: "a narrow bridge"
    },
    "the fox and the grapes": {
      question: "What did the fox say about the grapes when he could not reach them?",
      keywords: ["sour", "sour grapes"],
      answerHint: "they are sour"
    }
  };

  const getStoryQuiz = (title) => {
    const cleanTitle = title.toLowerCase().trim();
    if (storyQuizzes[cleanTitle]) {
      return storyQuizzes[cleanTitle];
    }
    const foundKey = Object.keys(storyQuizzes).find(k => cleanTitle.includes(k) || k.includes(cleanTitle));
    if (foundKey) {
      return storyQuizzes[foundKey];
    }
    return {
      question: `Who was the main character in this story?`,
      keywords: [],
      answerHint: "the main character"
    };
  };

  const startQuiz = (title) => {
    const quiz = getStoryQuiz(title);
    setMode("QUIZ");
    setQuizQuestion(quiz.question);
    setQuizKeywords(quiz.keywords);
    setQuizAnswerHint(quiz.answerHint);
    
    // Clear reading states
    setReadingIndex(-1);
    setReadingLines([]);
    setReadingTitle("");

    const quizText = "Story reading completed! Now, let's answer a quick question. " + quiz.question;
    speak(quizText);
  };

  const endQuiz = () => {
    setMode("NAVIGATION");
    setQuizQuestion("");
    setQuizKeywords([]);
    setQuizAnswerHint("");
    setCurrentCaptionLine("Read story aloud or start dialogue practice!");
    setAppState("LISTENING");
  };

  // --- ROLEPLAY CONTROLLER LOOP ---
  const setupRoleplay = (item) => {
    if (!item || !item.content) return;

    // Extract dialogues
    const rawLines = item.content.trim().split("\n");
    const dialogueLines = rawLines
      .map(l => l.trim())
      .filter(l => l !== "" && l.split(":").length > 1 && !l.startsWith("Scene") && !l.startsWith("Characters") && !l.startsWith("Moral") && !l.startsWith("Props"));

    if (dialogueLines.length === 0) {
      speak("This content doesn't contain standard dialogues to practice. Try a Skit or Roleplay page!", () => {
        setAppState("LISTENING");
      });
      return;
    }

    const speakers = Array.from(new Set(dialogueLines.map(l => l.split(":")[0].trim())));
    if (speakers.length < 2) {
      speak("This dialogue requires at least two characters to practice speaking.", () => {
        setAppState("LISTENING");
      });
      return;
    }

    const cBot = speakers[0];
    const cUser = speakers[1];

    setMode("ROLEPLAY");
    setRoleplayTitle(item.title);
    setBotRole(cBot);
    setUserRole(cUser);
    setRoleplayLines(dialogueLines);
    setRoleplayIndex(0);

    const intro = `Starting Skit: ${item.title}. I will speak as ${cBot}, and you will speak as ${cUser}. Let's begin!`;
    speak(intro, () => {
      if (modeRef.current !== "ROLEPLAY" || appStateRef.current === "IDLE") return;
      playRoleplayTurn(0, dialogueLines, cBot, cUser);
    });
  };

  const playRoleplayTurn = (idx, lines = roleplayLinesRef.current, bChar = botRoleRef.current, uChar = userRoleRef.current) => {
    if (idx >= lines.length) {
      speak("Awesome practice session! Skit completed. Returning to Excellence Voices dashboard.", () => {
        endRoleplay();
      });
      return;
    }

    const currentLine = lines[idx];
    const parts = currentLine.split(":");
    const speaker = parts[0].trim();
    const dialogueText = parts.slice(1).join(":").trim();

    const isBotLine = (speaker.toLowerCase() === bChar.toLowerCase());

    if (isBotLine) {
      setCurrentCaptionLine(currentLine);
      speak(dialogueText, () => {
        if (modeRef.current !== "ROLEPLAY" || appStateRef.current === "IDLE") return;
        const nextIdx = idx + 1;
        setRoleplayIndex(nextIdx);
        playRoleplayTurn(nextIdx, lines, bChar, uChar);
      });
    } else {
      // User's turn
      setCurrentCaptionLine(currentLine);
      setStudentText("");
      setAppState("LISTENING");
    }
  };

  const skipUserTurn = () => {
    if (modeRef.current !== "ROLEPLAY") return;

    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    clearCaptionTimers();

    const currentLine = roleplayLinesRef.current[roleplayIndexRef.current];
    const parts = currentLine.split(":");
    const dialogueText = parts.slice(1).join(":").trim();

    setCurrentCaptionLine(`(Praveena Reading) ${currentLine}`);
    speak(dialogueText, () => {
      if (modeRef.current !== "ROLEPLAY" || appStateRef.current === "IDLE") return;
      const nextIdx = roleplayIndexRef.current + 1;
      setRoleplayIndex(nextIdx);
      playRoleplayTurn(nextIdx);
    });
  };

  const endRoleplay = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    clearCaptionTimers();
    setMode("NAVIGATION");
    setRoleplayIndex(-1);
    setRoleplayLines([]);
    setRoleplayTitle("");
    setBotRole("");
    setUserRole("");
    setCurrentCaptionLine("Select another dialogue or story!");
    setAppState("LISTENING");
  };

  // Button style definitions
  const secondaryBtnStyle = {
    padding: "12px 20px",
    border: "1px solid rgba(255, 255, 255, 0.15)",
    fontFamily: "inherit",
    fontWeight: "600",
    fontSize: "14px",
    cursor: "pointer",
    borderRadius: "12px",
    transition: "all 0.3s ease",
    background: "rgba(255, 255, 255, 0.05)",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
    backdropFilter: "blur(10px)"
  };

  return (
    <>
      {/* Floating launcher trigger button */}
      <button 
        className={`assistant-toggle ${isOpen ? "active" : ""}`}
        onClick={startVoiceMode}
        title="Talk with Voice Speaking Tutors"
      >
        <div className="assistant-pulse"></div>
        <Mic size={28} />
      </button>

      {/* Immersive voice session overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="voice-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <div className="voice-container">
              
              {/* Header Info */}
              <div className="voice-header" style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ visibility: "hidden", width: "28px" }}></div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                  <span className="voice-logo">EXCELLENCE<span className="voice-logo-dot">.</span>VOICES</span>
                  <span className="voice-helper-tip">
                    {!isSupported && "⚠️ Unsupported Browser"}
                    {isSupported && mode === "NAVIGATION" && "🎙️ Offline Voice Controller"}
                    {isSupported && mode === "READING" && `🔊 Reading: ${readingTitle}`}
                    {isSupported && mode === "ROLEPLAY" && `🗣️ Practice: ${roleplayTitle}`}
                    {isSupported && mode === "QUIZ" && "📝 Story Comprehension Quiz"}
                  </span>
                </div>
                <button 
                  onClick={stopVoiceMode} 
                  style={{ 
                    background: "rgba(255, 255, 255, 0.05)", 
                    border: "1px solid rgba(255, 255, 255, 0.1)", 
                    borderRadius: "50%", 
                    color: "white", 
                    width: "36px", 
                    height: "36px", 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center", 
                    cursor: "pointer" 
                  }}
                >
                  <X size={18} />
                </button>
              </div>

              {!isSupported ? (
                // Unsupported browser warning
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1, padding: "20px" }}>
                  <div style={{ 
                    background: "rgba(239, 68, 68, 0.08)", 
                    border: "1px solid rgba(239, 68, 68, 0.20)", 
                    borderRadius: "16px", 
                    padding: "24px", 
                    maxWidth: "400px", 
                    display: "flex", 
                    flexDirection: "column", 
                    alignItems: "center", 
                    gap: "12px",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.3)"
                  }}>
                    <AlertCircle size={40} color="#ef4444" />
                    <h4 style={{ color: "#fca5a5", fontSize: "1.1rem", margin: 0, fontWeight: "bold" }}>Browser Speech Not Supported</h4>
                    <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.70)", margin: 0, lineHeight: "1.5" }}>
                      This browser does not support standard Speech Recognition.
                    </p>
                    <div style={{ textAlign: "left", width: "100%", background: "rgba(0,0,0,0.25)", padding: "12px 16px", borderRadius: "10px", fontSize: "0.80rem", color: "rgba(255,255,255,0.85)", lineHeight: "1.4" }}>
                      <strong>Recommended browsers:</strong>
                      <ul style={{ margin: "6px 0 0 16px", padding: 0 }}>
                        <li>Google Chrome (recommended)</li>
                        <li>Microsoft Edge</li>
                        <li>Safari (iOS / macOS)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              ) : permissionError ? (
                // Detailed instructions for blocked mic or insecure HTTP context
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1, padding: "20px" }}>
                  {!window.isSecureContext ? (
                    <div style={{ 
                      background: "rgba(245, 158, 11, 0.1)", 
                      border: "1px solid rgba(245, 158, 11, 0.25)", 
                      borderRadius: "16px", 
                      padding: "24px", 
                      maxWidth: "400px", 
                      display: "flex", 
                      flexDirection: "column", 
                      alignItems: "center", 
                      gap: "12px",
                      boxShadow: "0 8px 32px rgba(0,0,0,0.3)"
                    }}>
                      <AlertCircle size={40} color="#f59e0b" />
                      <h4 style={{ color: "#fde047", fontSize: "1.1rem", margin: 0, fontWeight: "bold" }}>Insecure Connection (HTTP)</h4>
                      <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.70)", margin: 0, lineHeight: "1.5" }}>
                        Web browsers block microphone prompts on insecure connections to protect your privacy.
                      </p>
                      <div style={{ textAlign: "left", width: "100%", background: "rgba(0,0,0,0.25)", padding: "12px 16px", borderRadius: "10px", fontSize: "0.80rem", color: "rgba(255,255,255,0.85)", lineHeight: "1.4" }}>
                        <strong>How to resolve:</strong>
                        <ul style={{ margin: "6px 0 0 16px", padding: 0 }}>
                          <li>If testing locally, use <strong>http://localhost:3000</strong> instead of an IP address.</li>
                          <li>In production, ensure you use a secure connection with <strong>https://</strong>.</li>
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <div style={{ 
                      background: "rgba(239, 68, 68, 0.08)", 
                      border: "1px solid rgba(239, 68, 68, 0.20)", 
                      borderRadius: "16px", 
                      padding: "24px", 
                      maxWidth: "400px", 
                      display: "flex", 
                      flexDirection: "column", 
                      alignItems: "center", 
                      gap: "12px",
                      boxShadow: "0 8px 32px rgba(0,0,0,0.3)"
                    }}>
                      <Shield size={40} color="#ef4444" />
                      <h4 style={{ color: "#fca5a5", fontSize: "1.1rem", margin: 0, fontWeight: "bold" }}>Microphone Permission Required</h4>
                      <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.70)", margin: 0, lineHeight: "1.5" }}>
                        To use the voice assistant speaking trainer, we need permission to access your microphone.
                      </p>
                      <div style={{ textAlign: "left", width: "100%", background: "rgba(0,0,0,0.25)", padding: "12px 16px", borderRadius: "10px", fontSize: "0.80rem", color: "rgba(255,255,255,0.85)", lineHeight: "1.4" }}>
                        <strong>How to enable:</strong>
                        <ol style={{ margin: "6px 0 0 16px", padding: 0 }}>
                          <li>Click the 🔒 <strong>lock icon</strong> next to the URL in your browser address bar.</li>
                          <li>Toggle the <strong>Microphone</strong> setting to <strong>Allow</strong>.</li>
                          <li>Click the retry button below or reload the page.</li>
                        </ol>
                      </div>
                      <button 
                        onClick={startVoiceMode} 
                        style={{ ...secondaryBtnStyle, marginTop: "12px", width: "100%", justifyContent: "center" }}
                      >
                        🔄 Try request permission again
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {/* Concentric glowing orb states */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div className="voice-orb-wrapper">
                      <div className={`voice-ring ring-1 ${appState.toLowerCase()}`}></div>
                      <div className={`voice-ring ring-2 ${appState.toLowerCase()}`}></div>
                      <div className={`voice-ring ring-3 ${appState.toLowerCase()}`}></div>
                      
                      <div className={`voice-orb ${appState.toLowerCase()}`}>
                        <Mic size={40} />
                      </div>
                    </div>
                    
                    <span style={{ marginTop: "16px", color: "var(--text-secondary)", fontWeight: "700", letterSpacing: "2px", fontSize: "0.85rem", textTransform: "uppercase" }}>
                      {mode === "NAVIGATION" && "Praveena (AI Trainer)"}
                      {mode === "READING" && "Praveena Speaking"}
                      {mode === "ROLEPLAY" && `${botRole} vs ${userRole}`}
                      {mode === "QUIZ" && "Comprehension Quiz"}
                    </span>
                  </div>

                  {/* Current Status title */}
                  <div>
                    <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "2px" }}>STATUS</span>
                    <h3 className={`voice-state-title ${appState.toLowerCase()}`}>
                      {appState === "SPEAKING" && "Speaking..."}
                      {appState === "LISTENING" && "Listening to you..."}
                      {appState === "PROCESSING" && "Processing..."}
                      {appState === "IDLE" && "Paused"}
                    </h3>
                  </div>

                  {/* Karaoke captions box */}
                  <div className="voice-captions-container" style={{ minHeight: "100px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ width: "100%", textAlign: "center" }}>
                      {mode === "QUIZ" && appState === "LISTENING" ? (
                        <div style={{ padding: "0 10px" }}>
                          <span style={{ color: "#10b981", fontWeight: "bold", fontSize: "0.85rem", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>Listen and Speak Your Answer:</span>
                          <div style={{ fontSize: "1.25rem", color: "#ffffff", fontWeight: "bold", lineHeight: "1.4" }}>
                            "{quizQuestion}"
                          </div>
                          <span style={{ color: "var(--text-secondary)", fontSize: "0.75rem", display: "block", marginTop: "6px" }}>(Tip: Speak the answer clearly into your microphone)</span>
                        </div>
                      ) : mode === "ROLEPLAY" && appState === "LISTENING" ? (
                        <div style={{ padding: "0 10px" }}>
                          <span style={{ color: "#d97706", fontWeight: "bold", fontSize: "0.85rem", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>Your Turn to Speak:</span>
                          <div style={{ fontSize: "1.25rem", color: "#ffffff", fontWeight: "bold" }}>
                            "{currentCaptionLine.split(":").slice(1).join(":").trim()}"
                          </div>
                          <span style={{ color: "var(--text-secondary)", fontSize: "0.75rem", display: "block", marginTop: "4px" }}>({userRole} dialogue line)</span>
                        </div>
                      ) : appState === "SPEAKING" ? (
                        <div
                          style={{
                            fontSize: "1.35rem",
                            color: "#ffffff",
                            fontWeight: "700",
                            lineHeight: "1.5",
                            padding: "14px 18px",
                            background: "rgba(0, 0, 0, 0.45)",
                            borderRadius: "12px",
                            border: "1px solid rgba(255,255,255,0.15)",
                            textShadow: "0 1px 6px rgba(0,0,0,0.8)",
                            letterSpacing: "0.3px"
                          }}
                        >
                          "{currentCaptionLine}"
                        </div>
                      ) : studentText && appState !== "IDLE" ? (
                        <div style={{ fontSize: "1.25rem", color: "#ffffff", padding: "0 10px" }}>
                          <span style={{ color: "var(--accent)", fontWeight: "bold", fontSize: "0.80rem", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>You Spoke:</span>
                          "{studentText}"
                        </div>
                      ) : (
                        <div style={{ color: "var(--text-muted)", fontSize: "0.95rem", fontStyle: "italic", padding: "0 10px" }}>
                          {mode === "NAVIGATION" && "Say: \"Go to Class 9\" or \"Read [Story Title]\" to begin!"}
                          {mode === "READING" && "Tutor is reading the content aloud..."}
                          {mode === "ROLEPLAY" && "Waiting..."}
                          {mode === "QUIZ" && "Waiting for answer..."}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Navigation help triggers inside overlay for better tablet/mobile experience */}
                  {mode === "NAVIGATION" && getCurrentItem() && (
                    <div style={{ display: "flex", gap: "12px", marginTop: "-10px" }}>
                      <button style={secondaryBtnStyle} onClick={() => startReading(getCurrentItem())}>
                        📖 Read Story Aloud
                      </button>
                      <button style={secondaryBtnStyle} onClick={() => setupRoleplay(getCurrentItem())}>
                        🗣️ Practice Skit Dialogues
                      </button>
                    </div>
                  )}

                  {/* Controls Tray */}
                  <div className="voice-controls">
                    
                    {/* READING CONTROLS */}
                    {mode === "READING" && (
                      <>
                        {appState === "IDLE" ? (
                          <button style={secondaryBtnStyle} onClick={resumeReading}>
                            <Play size={16} /> Resume
                          </button>
                        ) : (
                          <button style={secondaryBtnStyle} onClick={pauseReading}>
                            <Pause size={16} /> Pause
                          </button>
                        )}
                        <button className="btn btn-secondary btn-end-session" onClick={endReading}>
                          Stop Reading
                        </button>
                      </>
                    )}

                    {/* ROLEPLAY CONTROLS */}
                    {mode === "ROLEPLAY" && (
                      <>
                        {appState === "LISTENING" && (
                          <button style={secondaryBtnStyle} onClick={skipUserTurn}>
                            <SkipForward size={16} /> Skip Line
                          </button>
                        )}
                        <button className="btn btn-secondary btn-end-session" onClick={endRoleplay}>
                          Quit Skit Practice
                        </button>
                      </>
                    )}

                    {/* QUIZ CONTROLS */}
                    {mode === "QUIZ" && (
                      <button className="btn btn-secondary btn-end-session" onClick={endQuiz}>
                        Skip Quiz Question
                      </button>
                    )}

                    {/* NAVIGATION CONTROLS */}
                    {mode === "NAVIGATION" && (
                      <button className="btn btn-secondary btn-end-session" onClick={stopVoiceMode}>
                        <PhoneOff size={18} /> End Session
                      </button>
                    )}

                  </div>
                </>
              )}

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
