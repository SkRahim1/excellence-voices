import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Folder, ArrowRight, ArrowLeft, Sparkles, FileText, BookOpen } from "lucide-react";
import "./Debate2026Page.css";

export default function OtherMaterialsHome() {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  const directories = [
    {
      id: "debate-2026",
      title: "Debate 2026",
      tag: "5 Modules + Guide",
      description:
        "Official debate curriculum modules covering fundamentals, argument construction, persuasive phrasing, advanced rebuttal methods, and 15 topic argument banks.",
      path: "/students/other-materials/debate-2026",
      fileCount: "5 Module PDFs + 1 Guide",
      badgeColor: "#eba925",
      iconType: "folder"
    },
    {
      id: "english-book",
      title: "English to Start With",
      tag: "Grades 1–5 • 30 Units",
      description:
        "Friendly Learning Conversations with Saniya: 30 illustrated real-life conversation units, useful sentences, speaking practice, and fun roleplay activities for everyday English fluency.",
      path: "/students/other-materials/english-book",
      fileCount: "34 Pages Full-Color Illustrated Book",
      badgeColor: "#2563eb",
      iconType: "book"
    }
  ];

  return (
    <div className="debate-container">
      {/* BREADCRUMBS */}
      <nav className="debate-breadcrumb" aria-label="Breadcrumb">
        <Link to="/students">
          <ArrowLeft size={16} /> Students Portal
        </Link>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-active">Other Materials</span>
      </nav>

      {/* HEADER */}
      <div className="other-materials-header" style={{ marginBottom: "35px" }}>
        <div>
          <h1 className="other-materials-title" style={{ fontSize: "34px" }}>
            <Folder size={32} color="#0D2D59" /> Other Materials
          </h1>
          <p className="other-materials-subtitle">
            Supplementary learning resources, competition series, and specialized study directories.
          </p>
        </div>
      </div>

      {/* DIRECTORIES LIST */}
      <div className="other-materials-grid">
        {directories.map((dir) => (
          <Link key={dir.id} to={dir.path} className="directory-card">
            <div className="directory-badge-bar">
              <div
                className="directory-icon-box"
                style={dir.iconType === "book" ? { color: "#2563eb", background: "rgba(37, 99, 235, 0.08)" } : {}}
              >
                {dir.iconType === "book" ? <BookOpen size={28} /> : <Folder size={28} />}
              </div>
              <span
                className="directory-tag"
                style={dir.iconType === "book" ? { background: "rgba(37, 99, 235, 0.12)", color: "#1d4ed8" } : {}}
              >
                {dir.tag}
              </span>
            </div>

            <h2 className="directory-title">{dir.title}</h2>
            <p className="directory-desc">{dir.description}</p>

            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#64748b", marginBottom: "16px" }}>
              <FileText size={15} color="#0d2d59" />
              <span>{dir.fileCount}</span>
            </div>

            <div className="directory-action-link">
              <span>Open Directory</span>
              <ArrowRight size={18} />
            </div>
          </Link>
        ))}

        {/* FUTURE MATERIALS PLACEHOLDER CARD */}
        <div
          className="directory-card"
          style={{
            background: "rgba(241, 245, 249, 0.6)",
            border: "1.5px dashed #cbd5e1",
            boxShadow: "none",
            cursor: "default"
          }}
        >
          <div className="directory-badge-bar">
            <div className="directory-icon-box" style={{ background: "#e2e8f0", color: "#94a3b8" }}>
              <Sparkles size={24} />
            </div>
            <span
              className="directory-tag"
              style={{ background: "#e2e8f0", color: "#64748b" }}
            >
              Upcoming
            </span>
          </div>
          <h2 className="directory-title" style={{ color: "#64748b" }}>
            More Study Directories
          </h2>
          <p className="directory-desc">
            Additional competition materials, public speaking guides, and workshop recordings will be added here.
          </p>
          <div style={{ fontSize: "13px", color: "#94a3b8", marginTop: "auto" }}>
            Stay tuned!
          </div>
        </div>
      </div>
    </div>
  );
}
