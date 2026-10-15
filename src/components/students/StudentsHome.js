import React from "react";
import { Link } from "react-router-dom";
import { Folder, ArrowRight, Sparkles, FileText, Award } from "lucide-react";
import "./Debate2026Page.css";

export default function StudentsHome() {
  const classes = [
    "class-1",
    "class-2",
    "class-3",
    "class-4",
    "class-5",
    "class-6",
    "class-7",
    "class-8",
    "class-9",
  ];

  return (
    <div className="container">
      <h1 className="heading">Students Portal</h1>

      <p className="para">
        Select your class to explore roleplays, activities, skits, and stories.
      </p>

      {/* CLASS CURRICULUM CARDS */}
      <div className="cards">
        {classes.map((cls) => (
          <Link key={cls} to={`/students/${cls}`} className="card">
            <h2>{cls.replace("-", " ").toUpperCase()}</h2>
          </Link>
        ))}
      </div>

      {/* OTHER MATERIALS SECTION */}
      <section className="other-materials-section">
        <div className="other-materials-header">
          <div>
            <h2 className="other-materials-title">
              <Folder size={26} color="#0D2D59" /> Other Materials
            </h2>
            <p className="other-materials-subtitle">
              Specialized learning directories, competition preparation, and supplementary resources.
            </p>
          </div>
          <Link
            to="/students/other-materials"
            style={{
              fontSize: "14px",
              fontWeight: "600",
              color: "var(--primary)",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px"
            }}
          >
            <span>View All</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="other-materials-grid">
          {/* DEBATE 2026 DIRECTORY CARD */}
          <Link
            to="/students/other-materials/debate-2026"
            className="directory-card"
          >
            <div className="directory-badge-bar">
              <div className="directory-icon-box">
                <Award size={26} />
              </div>
              <span className="directory-tag">
                <Sparkles size={12} style={{ display: "inline", marginRight: "3px" }} />
                5 Modules Available
              </span>
            </div>

            <h3 className="directory-title">Debate 2026</h3>
            <p className="directory-desc">
              Comprehensive 5-module training series and official competition booklet: discovering debate, argument building, language of a debater, rebuttal techniques, and practice topics.
            </p>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "13px",
                color: "#64748b",
                marginBottom: "16px"
              }}
            >
              <FileText size={15} color="#0d2d59" />
              <span>5 Module PDFs + Competition Guide</span>
            </div>

            <div className="directory-action-link">
              <span>Open Debate 2026 Directory</span>
              <ArrowRight size={18} />
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
