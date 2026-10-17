import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  Download,
  Eye,
  ExternalLink,
  Search,
  Sparkles,
  ArrowLeft,
  X,
  Maximize2,
  Minimize2,
  BookOpen,
  Award,
  CheckCircle2
} from "lucide-react";
import "./Debate2026Page.css";

const DEBATE_MODULES = [
  {
    id: 1,
    type: "module",
    moduleNumber: "Module 1",
    title: "Discovering Debate",
    subtitle: "Foundations, Rules, and Speaker Roles",
    description:
      "Introduction to structured debating vs discussion, defining motions, supporting vs opposing positions, speaker roles, and essential debate vocabulary.",
    fileName: "Excellence_Voices_Debate_Module_1.pdf",
    pages: "8 Pages",
    author: "Prepared by Rahim Shaikh (Co-founder, Curriculum Director)",
    keyTopics: [
      "Debate vs. Discussion differences",
      "Motion definitions & For vs. Against sides",
      "Speaker roles (1st, 2nd, 3rd, Final Speaker)",
      "Essential debate vocabulary & rules of good debate"
    ]
  },
  {
    id: 2,
    type: "module",
    moduleNumber: "Module 2",
    title: "Building Strong Arguments",
    subtitle: "Claim → Reason → Example Framework",
    description:
      "Master the three-part argument structure (CRE), develop deep explanations with the 'Why?' technique, and turn opinions into persuasive claims with evidence.",
    fileName: "Excellence_Voices_Debate_Module_2.pdf",
    pages: "8 Pages",
    author: "Prepared by Rahim Shaikh (Co-founder, Curriculum Director)",
    keyTopics: [
      "Opinions vs. Logical Arguments",
      "Claim → Reason → Example (CRE) formula",
      "The 'Why?' technique for deeper points",
      "Organising points & transition words (Firstly, Secondly, Finally)"
    ]
  },
  {
    id: 3,
    type: "module",
    moduleNumber: "Module 3",
    title: "The Language of a Debater",
    subtitle: "Signposting, Phrasing & Respectful Disagreement",
    description:
      "Learn formal debate vocabulary, signposting expressions, rhetorical questions, persuasive linking phrases, and how to disagree respectfully without being rude.",
    fileName: "Excellence_Voices_Debate_Module_3.pdf",
    pages: "10 Pages",
    author: "Prepared by Rahim Shaikh (Co-founder, Curriculum Director)",
    keyTopics: [
      "Opening phrases & signposting points clearly",
      "Formal vs. Casual vocabulary comparisons",
      "Disagreeing respectfully & introducing different perspectives",
      "Asking rhetorical questions & strong concluding lines"
    ]
  },
  {
    id: 4,
    type: "module",
    moduleNumber: "Module 4",
    title: "Rebuttal & Counterarguments",
    subtitle: "The 4-Step Rebuttal Method & Fallacy Detection",
    description:
      "Learn how to listen actively, identify weaknesses in opposing claims (overgeneralisations, lack of evidence), and respond using the 4-step rebuttal framework.",
    fileName: "Excellence_Voices_Debate_Module_4.pdf",
    pages: "11 Pages",
    author: "Prepared by Rahim Shaikh (Co-founder, Curriculum Director)",
    keyTopics: [
      "4-Step Method: Identify → Challenge → Support → Conclude",
      "Common weaknesses: Overgeneralisation & unsupported claims",
      "The 'Yes, But' & 'Concede and Rebut' techniques",
      "Handling tough questions without panic"
    ]
  },
  {
    id: 5,
    type: "module",
    moduleNumber: "Module 5",
    title: "Debate Practice & Competition Preparation",
    subtitle: "15 Official Debate Topics & Blueprint",
    description:
      "Complete preparation guide for the debate competition: comprehensive argument banks with 5 supporting and 5 opposing points for all 15 official motions.",
    fileName: "Excellence_Voices_Debate_Module_5.pdf",
    pages: "19 Pages",
    author: "Prepared by Rahim Shaikh (Co-founder, Curriculum Director)",
    keyTopics: [
      "Full argument banks for all 15 official debate topics",
      "In-depth analysis for top 5 recommended competition motions",
      "Competition speech blueprint (Opening, CRE, Rebuttal, Conclusion)",
      "Final competition speaker checklist"
    ]
  },
  {
    id: 6,
    type: "guide",
    moduleNumber: "Official Guide",
    title: "Debate Competition 2026 Booklet",
    subtitle: "Official Rules, Structure & Motion Prompts",
    description:
      "The official competition handbook covering speaking structures, rules, 15 practice topics, featured competition motions, and guidance for trainers.",
    fileName: "Excellence_Voices_Debate_Competition_2026_Final.pdf",
    pages: "2 Pages",
    author: "Excellence Voices Competition Committee",
    isFeatured: true,
    keyTopics: [
      "Official 2026 debate rules & ethical standards",
      "Speaking structure & timing guidelines",
      "Top 5 featured competition topics",
      "Trainer guidance for practice rounds"
    ]
  },
  {
    id: 7,
    type: "book",
    moduleNumber: "English Book",
    title: "English to Start With: Simple Conversations for Real Life!",
    subtitle: "Friendly Learning Conversations with Saniya (Grades 1–5)",
    description:
      "A complete 34-page illustrated English conversation book specially created for Grades 1 to 5. Join Saniya through 30 real-life daily situations at home, school, with friends, and in the community—complete with dialogues, useful sentence banks, practice questions, and fun roleplay activities.",
    fileName: "English_to_Start_With_Friendly_Learning_Conversations.pdf",
    pages: "34 Pages",
    author: "Excellence - Empowering Young Voices",
    isBook: true,
    keyTopics: [
      "30 illustrated everyday conversation units with Saniya",
      "Practical dialogues for home, school, library & playground",
      "Useful Sentences vocabulary builder on every unit",
      "Interactive 'Let's Practise' and 'Act It Out' roleplay activities"
    ]
  }
];

export default function Debate2026Page() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all"); // 'all', 'modules', 'book', 'guide'
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Scroll to top on load
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  // Keyboard navigation for modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && selectedPdf) {
        setSelectedPdf(null);
        setIsFullscreen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedPdf]);

  const getPdfUrl = (fileName) => {
    const baseUrl = process.env.PUBLIC_URL || "";
    return `${baseUrl}/debate2026/${fileName}`;
  };

  const filteredModules = DEBATE_MODULES.filter((item) => {
    // Type filter
    if (activeFilter === "modules" && item.type !== "module") return false;
    if (activeFilter === "book" && item.type !== "book") return false;
    if (activeFilter === "guide" && item.type !== "guide") return false;

    // Search query
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.subtitle.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.moduleNumber.toLowerCase().includes(q) ||
      item.keyTopics.some((topic) => topic.toLowerCase().includes(q))
    );
  });

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
        <span className="breadcrumb-active">Debate 2026</span>
      </nav>

      {/* HERO BANNER */}
      <div className="debate-hero-card">
        <div className="debate-badge">
          <Sparkles size={14} /> Excellence Debate 2026 Directory
        </div>
        <h1 className="debate-title">Debate 2026 Learning Modules</h1>
        <p className="debate-subtitle">
          Master the art of structured speaking, persuasive argument construction, active listening, and respectful rebuttal.
          Explore the official 5-module curriculum and the 2026 competition booklet.
        </p>

        <div className="debate-meta-tags">
          <div className="debate-meta-pill">
            <BookOpen size={15} color="#eba925" /> 5 Debate Modules
          </div>
          <div className="debate-meta-pill">
            <BookOpen size={15} color="#60a5fa" /> English Conversation Book (30 Units)
          </div>
          <div className="debate-meta-pill">
            <Award size={15} color="#eba925" /> 1 Official Competition Guide
          </div>
          <div className="debate-meta-pill">
            <CheckCircle2 size={15} color="#4ade80" /> 15 Official Topic Argument Banks
          </div>
        </div>
      </div>

      {/* CONTROLS: SEARCH & TABS */}
      <div className="debate-controls-bar">
        <div className="debate-search-box">
          <Search size={18} className="debate-search-icon" />
          <input
            type="text"
            className="debate-search-input"
            placeholder="Search modules, concepts, or topics (e.g. rebuttal, CRE, arguments)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="debate-filter-pills">
          <button
            className={`debate-filter-btn ${activeFilter === "all" ? "active" : ""}`}
            onClick={() => setActiveFilter("all")}
          >
            All Materials ({DEBATE_MODULES.length})
          </button>
          <button
            className={`debate-filter-btn ${activeFilter === "modules" ? "active" : ""}`}
            onClick={() => setActiveFilter("modules")}
          >
            5 Modules
          </button>
          <button
            className={`debate-filter-btn ${activeFilter === "book" ? "active" : ""}`}
            onClick={() => setActiveFilter("book")}
          >
            English Book
          </button>
          <button
            className={`debate-filter-btn ${activeFilter === "guide" ? "active" : ""}`}
            onClick={() => setActiveFilter("guide")}
          >
            Official Guide
          </button>
        </div>
      </div>

      {/* MODULES GRID */}
      <div className="debate-grid">
        {filteredModules.map((item) => {
          const pdfUrl = getPdfUrl(item.fileName);
          const isFeatured = item.isFeatured;

          return (
            <div
              key={item.id}
              className={`debate-card ${isFeatured ? "featured-card" : ""}`}
            >
              <div className="debate-card-header">
                <span className="module-number-tag">{item.moduleNumber}</span>
                <span className="pdf-icon-badge">
                  <FileText size={13} /> {item.pages}
                </span>
              </div>

              <h3 className="debate-card-title">{item.title}</h3>
              <p className="debate-card-desc">{item.description}</p>

              {/* TOPICS COVERED */}
              <ul className="debate-card-topics">
                {item.keyTopics.map((topic, i) => (
                  <li key={i}>
                    <span className="dot">•</span>
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>

              <div className="debate-card-author">{item.author}</div>

              {/* CARD ACTIONS */}
              <div className="debate-card-actions">
                <button
                  className="btn-primary-view"
                  onClick={() => setSelectedPdf(item)}
                >
                  <Eye size={16} /> View PDF
                </button>

                <a
                  href={pdfUrl}
                  download={item.fileName}
                  className="btn-secondary-action"
                  title="Download PDF to device"
                >
                  <Download size={15} /> Download
                </a>

                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary-action"
                  title="Open in new browser tab"
                >
                  <ExternalLink size={15} />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {filteredModules.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "#64748b" }}>
          <h3>No matching debate materials found</h3>
          <p>Try adjusting your search terms or filter selection.</p>
        </div>
      )}

      {/* INTERACTIVE PDF VIEWER MODAL */}
      {selectedPdf && (
        <div
          className="pdf-modal-overlay"
          onClick={() => {
            setSelectedPdf(null);
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
                <FileText size={20} color="#eba925" />
                <h3 className="pdf-modal-title">
                  {selectedPdf.moduleNumber}: {selectedPdf.title}
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
                  href={getPdfUrl(selectedPdf.fileName)}
                  download={selectedPdf.fileName}
                  className="pdf-control-btn"
                  title="Download file"
                >
                  <Download size={16} />
                  <span>Download</span>
                </a>

                <a
                  href={getPdfUrl(selectedPdf.fileName)}
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
                    setSelectedPdf(null);
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
                title={selectedPdf.title}
                src={`${getPdfUrl(selectedPdf.fileName)}#toolbar=1&navpanes=0`}
                className="pdf-iframe"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
