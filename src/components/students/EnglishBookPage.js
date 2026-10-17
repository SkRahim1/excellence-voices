import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  Download,
  Eye,
  ExternalLink,
  Sparkles,
  ArrowLeft,
  X,
  Maximize2,
  Minimize2,
  BookOpen,
  Award,
  CheckCircle2,
  Users,
  Search
} from "lucide-react";
import "./Debate2026Page.css";

const BOOK_INFO = {
  title: "English to Start With: Simple Conversations for Real Life!",
  subtitle: "Friendly Learning Conversations with Saniya",
  gradeLevel: "Grades 1 – 5",
  pages: "34 Pages",
  unitsCount: "30 Units",
  fileName: "English_to_Start_With_Friendly_Learning_Conversations.pdf",
  author: "Excellence - Empowering Young Voices",
  description:
    "Specially created for Grades 1 to 5 to learn English through simple and natural conversations from everyday life. Meet Saniya, a cheerful and curious girl, who goes through 30 real-life situations at home, school, with friends, and in the community. Through her conversations, young learners master practical speaking, active listening, and confident everyday communication.",
  highlights: [
    "30 Illustrated everyday conversational scenarios (Home, School, Library, Doctor, Birthday Party)",
    "Natural dialogues between Saniya, family members, teachers, and classmates",
    "'Useful Sentences' vocabulary builder and daily phrase bank on each unit",
    "'Let's Practise!' speaking questions & 'Act It Out' partner roleplay activities"
  ]
};

const UNITS_LIST = [
  { unit: 1, title: "Saniya Wakes Up in the Morning", focus: "Morning greetings & waking up routines" },
  { unit: 2, title: "Saniya with Mother (Getting Ready)", focus: "Brushing teeth, washing face & uniforms" },
  { unit: 3, title: "Saniya with Father", focus: "Packing school bag & asking for help politely" },
  { unit: 4, title: "Saniya in the Bathroom", focus: "Cleanliness habits, towels & neatness" },
  { unit: 5, title: "Saniya Gets Dressed", focus: "Choosing clothes, buttoning shirts & shoes" },
  { unit: 6, title: "Saniya at Breakfast", focus: "Table manners, asking for food & politeness" },
  { unit: 7, title: "Saniya Packs Her Bag", focus: "Timetable check, books, pencil box & lunch box" },
  { unit: 8, title: "Saniya Looks for Her Shoes", focus: "Finding lost items & staying organized" },
  { unit: 9, title: "Saniya Says Goodbye", focus: "Polite farewells to parents before school" },
  { unit: 10, title: "Saniya on the Way to School", focus: "Road safety, walking together & school bus" },
  { unit: 11, title: "Saniya Meets Her Teacher", focus: "Greeting teachers & classroom entry etiquette" },
  { unit: 12, title: "Saniya with Her Friends", focus: "Sharing, borrowing pencils & word games" },
  { unit: 13, title: "Saniya Enters the Classroom", focus: "Walking quietly, opening books & readiness" },
  { unit: 14, title: "Saniya Asks a Question", focus: "Asking doubts politely & asking for examples" },
  { unit: 15, title: "Saniya Needs a Pencil", focus: "Borrowing politely & returning items with thanks" },
  { unit: 16, title: "Saniya Does Not Understand", focus: "Asking teachers to explain again without fear" },
  { unit: 17, title: "Saniya Visits the Washroom", focus: "Asking permission & washing hands with soap" },
  { unit: 18, title: "Saniya During Lunch Break", focus: "Sharing food, eating neatly & cleaning up" },
  { unit: 19, title: "Saniya on the Playground", focus: "Taking turns on swings, slides & safe play" },
  { unit: 20, title: "Saniya in the Library", focus: "Quiet library manners & borrowing storybooks" },
  { unit: 21, title: "Saniya Returns Home", focus: "Greeting parents & sharing highlights of the day" },
  { unit: 22, title: "Saniya Talks About School", focus: "Discussing lessons, friends & answering questions" },
  { unit: 23, title: "Saniya Has a Snack", focus: "Healthy snacks, asking for fruit & washing hands" },
  { unit: 24, title: "Saniya Plays with Friends", focus: "Playing hide-and-seek & fair play rules" },
  { unit: 25, title: "Saniya Helps Her Mother", focus: "Setting the table & helping with family chores" },
  { unit: 26, title: "Saniya Gets Ready for Bed", focus: "Night routine, brushing teeth & sweet dreams" },
  { unit: 27, title: "Saniya at the Shop", focus: "Buying fruits, asking prices & saying thank you" },
  { unit: 28, title: "Saniya Visits a Doctor", focus: "Describing symptoms, taking medicine & resting" },
  { unit: 29, title: "Saniya Talks on the Phone", focus: "Phone etiquette, inviting friends & polite endings" },
  { unit: 30, title: "Saniya at a Birthday Party", focus: "Wishing friends, giving gifts & party manners" }
];

export default function EnglishBookPage() {
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isViewerOpen) {
        setIsViewerOpen(false);
        setIsFullscreen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isViewerOpen]);

  const pdfUrl = `${process.env.PUBLIC_URL || ""}/debate2026/${BOOK_INFO.fileName}`;

  const filteredUnits = UNITS_LIST.filter(
    (u) =>
      u.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.focus.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.unit.toString() === searchQuery.trim()
  );

  return (
    <div className="debate-container">
      {/* BREADCRUMBS */}
      <nav className="debate-breadcrumb" aria-label="Breadcrumb">
        <Link to="/students">
          <ArrowLeft size={16} /> Students Portal
        </Link>
        <span className="breadcrumb-separator">/</span>
        <Link to="/students/other-materials">Other Materials</Link>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-active">English to Start With</span>
      </nav>

      {/* HERO BANNER */}
      <div className="debate-hero-card" style={{ background: "linear-gradient(135deg, #0d2d59 0%, #1d4ed8 60%, #eba925 100%)" }}>
        <div className="debate-badge" style={{ background: "rgba(255, 255, 255, 0.2)", color: "#ffffff", borderColor: "rgba(255, 255, 255, 0.4)" }}>
          <Sparkles size={14} /> Grades 1 – 5 Foundational Series
        </div>
        <h1 className="debate-title">English to Start With</h1>
        <p className="debate-subtitle">
          Simple conversations for real life! Follow Saniya through 30 fun and relatable daily situations at home, school, and play—building English speaking confidence naturally.
        </p>

        <div className="debate-meta-tags">
          <div className="debate-meta-pill">
            <BookOpen size={15} color="#eba925" /> 34 Full-Colour Illustrated Pages
          </div>
          <div className="debate-meta-pill">
            <CheckCircle2 size={15} color="#4ade80" /> 30 Real-Life Conversation Units
          </div>
          <div className="debate-meta-pill">
            <Users size={15} color="#60a5fa" /> Dialogues, Useful Sentences & Roleplays
          </div>
          <div className="debate-meta-pill">
            <Award size={15} color="#eba925" /> Grades 1 to 5
          </div>
        </div>
      </div>

      {/* FEATURED BOOK CARD (Matching debate modules presentation) */}
      <div className="debate-card featured-card" style={{ marginBottom: "40px" }}>
        <div className="debate-card-header">
          <span className="module-number-tag" style={{ background: "rgba(37, 99, 235, 0.12)", color: "#1d4ed8" }}>
            Illustrated Book • Grades 1–5
          </span>
          <span className="pdf-icon-badge">
            <FileText size={13} /> {BOOK_INFO.pages}
          </span>
        </div>

        <h2 className="debate-card-title" style={{ fontSize: "24px" }}>
          {BOOK_INFO.title}
        </h2>
        <p style={{ fontSize: "15px", fontWeight: "600", color: "#1e40af", margin: "0 0 12px 0" }}>
          {BOOK_INFO.subtitle}
        </p>
        <p className="debate-card-desc">{BOOK_INFO.description}</p>

        {/* HIGHLIGHT TOPICS */}
        <ul className="debate-card-topics">
          {BOOK_INFO.highlights.map((h, i) => (
            <li key={i}>
              <span className="dot">•</span>
              <span>{h}</span>
            </li>
          ))}
        </ul>

        <div className="debate-card-author">{BOOK_INFO.author}</div>

        {/* ACTIONS */}
        <div className="debate-card-actions">
          <button
            className="btn-primary-view"
            onClick={() => setIsViewerOpen(true)}
            style={{ fontSize: "15px", padding: "12px 24px" }}
          >
            <Eye size={18} /> View Book (Interactive PDF)
          </button>

          <a
            href={pdfUrl}
            download={BOOK_INFO.fileName}
            className="btn-secondary-action"
            title="Download PDF to device"
            style={{ fontSize: "14px", padding: "12px 20px" }}
          >
            <Download size={16} /> Download PDF
          </a>

          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary-action"
            title="Open in new browser tab"
            style={{ fontSize: "14px", padding: "12px 18px" }}
          >
            <ExternalLink size={16} /> Open in New Tab
          </a>
        </div>
      </div>

      {/* 30 UNITS BREAKDOWN / INDEX */}
      <div style={{ marginTop: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px", marginBottom: "24px" }}>
          <div>
            <h3 style={{ fontSize: "24px", fontWeight: "800", color: "var(--primary)", margin: 0 }}>
              Book Contents: 30 Conversation Units
            </h3>
            <p style={{ color: "var(--text-muted)", fontSize: "14px", margin: "4px 0 0 0" }}>
              Explore the everyday English situations covered in this book.
            </p>
          </div>

          <div className="debate-search-box" style={{ maxWidth: "320px" }}>
            <Search size={16} className="debate-search-icon" />
            <input
              type="text"
              className="debate-search-input"
              placeholder="Search units (e.g. breakfast, school)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ padding: "10px 14px 10px 38px", fontSize: "13px" }}
            />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
          {filteredUnits.map((u) => (
            <div
              key={u.unit}
              style={{
                background: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: "14px",
                padding: "16px 18px",
                display: "flex",
                flexDirection: "column",
                gap: "6px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.03)",
                transition: "all 0.2s"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span
                  style={{
                    background: "rgba(13, 45, 89, 0.08)",
                    color: "var(--primary)",
                    fontSize: "11px",
                    fontWeight: "700",
                    padding: "3px 8px",
                    borderRadius: "6px"
                  }}
                >
                  Unit {u.unit}
                </span>
                <span style={{ fontSize: "12px", color: "#94a3b8" }}>Page {u.unit}</span>
              </div>
              <h4 style={{ margin: "4px 0 0 0", fontSize: "15px", fontWeight: "700", color: "#1e293b" }}>
                {u.title}
              </h4>
              <p style={{ margin: 0, fontSize: "12px", color: "#64748b", lineHeight: "1.4" }}>
                {u.focus}
              </p>
            </div>
          ))}
        </div>

        {filteredUnits.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 20px", color: "#64748b" }}>
            No units matched "{searchQuery}".
          </div>
        )}
      </div>

      {/* INTERACTIVE PDF VIEWER MODAL */}
      {isViewerOpen && (
        <div
          className="pdf-modal-overlay"
          onClick={() => {
            setIsViewerOpen(false);
            setIsFullscreen(false);
          }}
        >
          <div
            className={`pdf-modal-container ${isFullscreen ? "fullscreen-modal" : ""}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* MODAL HEADER */}
            <div className="pdf-modal-header">
              <div className="pdf-modal-title-area">
                <BookOpen size={20} color="#eba925" />
                <h3 className="pdf-modal-title">
                  {BOOK_INFO.title}
                </h3>
              </div>

              <div className="pdf-modal-controls">
                <button
                  className="pdf-control-btn"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                >
                  {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                </button>

                <a
                  href={pdfUrl}
                  download={BOOK_INFO.fileName}
                  className="pdf-control-btn"
                  title="Download book"
                >
                  <Download size={16} />
                  <span>Download</span>
                </a>

                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pdf-control-btn"
                  title="Open in new tab"
                >
                  <ExternalLink size={16} />
                </a>

                <button
                  className="pdf-close-btn"
                  onClick={() => {
                    setIsViewerOpen(false);
                    setIsFullscreen(false);
                  }}
                  title="Close viewer (Esc)"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* MODAL BODY */}
            <div className="pdf-modal-body">
              <iframe
                title={BOOK_INFO.title}
                src={`${pdfUrl}#toolbar=1&navpanes=0`}
                className="pdf-iframe"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
