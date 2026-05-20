import React from "react";

import { useParams } from "react-router-dom";

import jsPDF from "jspdf";

import studentsData from "../data/StudentsData";

export default function ContentPage() {
  const { classId, category, id } = useParams();

  const item = studentsData[classId]?.[category]?.find(
    (i) => i.id === Number(id),
  );

  if (!item) {
    return (
      <div className="container">
        <h1>Content Not Found</h1>
      </div>
    );
  }

  // PDF DOWNLOAD
 const downloadPDF = () => {
  const doc = new jsPDF();

  const pageWidth = doc.internal.pageSize.getWidth();

  const pageHeight = doc.internal.pageSize.getHeight();

  const margin = 15;

  const maxWidth = pageWidth - margin * 2;

  let y = 30;

  // HEADER TEXT
  const headerText = `${classId.replace(
    "class-",
    "Class-",
  )} / ${category.slice(0, -1)}-${id}`;

  // HEADER
  const addHeader = () => {
    doc.setFont("helvetica", "bold");

    doc.setFontSize(11);

    doc.setTextColor(100);

    doc.text(headerText, margin, 12);

    // LINE
    doc.line(
      margin,
      16,
      pageWidth - margin,
      16,
    );
  };

  // FOOTER
  const addFooter = () => {
    doc.setFont("helvetica", "italic");

    doc.setFontSize(10);

    doc.setTextColor(120);

    doc.text(
      "Excellence - Empowering Young Voices",
      pageWidth / 2,
      pageHeight - 10,
      {
        align: "center",
      },
    );
  };

  // INITIAL HEADER
  addHeader();

  // TITLE
  doc.setFont("helvetica", "bold");

  doc.setFontSize(22);

  doc.setTextColor(13, 45, 89);

  const titleLines = doc.splitTextToSize(
    item.title,
    maxWidth,
  );

  doc.text(titleLines, margin, y);

  y += 18;

  const lines = item.content.split("\n");

  lines.forEach((line) => {
    // NEW PAGE
    if (y > pageHeight - 25) {
      addFooter();

      doc.addPage();

      addHeader();

      y = 30;
    }

    // EMPTY LINE
    if (line.trim() === "") {
      y += 3;

      return;
    }

    // HEADINGS
    if (
      line.startsWith("Scene") ||
      line.startsWith("Characters") ||
      line.startsWith("Moral") ||
      line.startsWith("Props Needed")
    ) {
      doc.setFont("helvetica", "bold");

      doc.setFontSize(16);

      doc.setTextColor(13, 45, 89);

      const headingLines = doc.splitTextToSize(
        line,
        maxWidth,
      );

      doc.text(headingLines, margin, y);

      y += 8;

      return;
    }

    // BULLETS
    if (line.startsWith("•")) {
      doc.setFont("helvetica", "normal");

      doc.setFontSize(12);

      doc.setTextColor(0, 0, 0);

      const bulletLines = doc.splitTextToSize(
        line,
        maxWidth - 5,
      );

      doc.text(bulletLines, margin + 5, y);

      y += bulletLines.length * 5;

      return;
    }

    const parts = line.split(":");

    // DIALOGUES
    if (parts.length > 1) {
      const speaker = parts[0] + ":";

      const dialogue = parts
        .slice(1)
        .join(":")
        .trim();

      // SPEAKER
      doc.setFont("helvetica", "bold");

      doc.setFontSize(13);

      doc.setTextColor(13, 45, 89);

      doc.text(speaker, margin, y);

      // SPEAKER WIDTH
      const speakerWidth =
        doc.getTextWidth(speaker) + 5;

      // DIALOGUE
      doc.setFont("helvetica", "normal");

      doc.setFontSize(12);

      doc.setTextColor(0, 0, 0);

      const splitDialogue = doc.splitTextToSize(
        dialogue,
        maxWidth - speakerWidth,
      );

      doc.text(
        splitDialogue,
        margin + speakerWidth,
        y,
      );

      y += splitDialogue.length * 5;

      return;
    }

    // NORMAL TEXT
    doc.setFont("helvetica", "normal");

    doc.setFontSize(12);

    doc.setTextColor(0, 0, 0);

    const normalLines = doc.splitTextToSize(
      line,
      maxWidth,
    );

    doc.text(normalLines, margin, y);

    y += normalLines.length * 5;
  });

  // FINAL FOOTER
  addFooter();

  // SAVE PDF
  doc.save(`${item.title}.pdf`);
};

  return (
    <div className="container">
      <h1 className="heading">{item.title}</h1>

      <div
        className="content-box"
        style={{
          whiteSpace: "pre-line",
          textAlign: "left",
          marginTop: "30px",
          lineHeight: "1.4",
          fontSize: "20px",
          background: "#fff",
          padding: "35px",
          borderRadius: "18px",
          boxShadow: "0px 5px 15px rgba(0,0,0,0.08)",
        }}
      >
        {item.content.split("\n").map((line, index) => {
          // EMPTY LINE
          if (line.trim() === "") {
            return <br key={index} />;
          }

          // HEADINGS
          if (
            line.startsWith("Scene") ||
            line.startsWith("Characters") ||
            line.startsWith("Moral") ||
            line.startsWith("Props Needed")
          ) {
            return (
              <h3
                key={index}
                style={{
                  color: "#0D2D59",
                  marginTop: "20px",
                  marginBottom: "10px",
                  fontSize: "24px",
                  fontWeight: "700",
                }}
              >
                {line}
              </h3>
            );
          }

          // BULLETS
          if (line.startsWith("•")) {
            return (
              <li
                key={index}
                style={{
                  marginLeft: "25px",
                  marginBottom: "8px",
                  fontSize: "19px",
                }}
              >
                {line.replace("•", "")}
              </li>
            );
          }

          const parts = line.split(":");

          // DIALOGUES
          if (parts.length > 1) {
            return (
              <p
                key={index}
                style={{
                  marginBottom: "0px",
                  lineHeight: "1.6",
                }}
              >
                <span
                  style={{
                    fontWeight: "bold",
                    color: "#0D2D59",
                    fontSize: "21px",
                  }}
                >
                  {parts[0]}:
                </span>{" "}
                <span>{parts.slice(1).join(":")}</span>
              </p>
            );
          }

          // NORMAL TEXT
          return (
            <p
              key={index}
              style={{
                marginBottom: "10px",
                lineHeight: "1.6",
              }}
            >
              {line}
            </p>
          );
        })}
      </div>

      {/* DOWNLOAD BUTTON AT BOTTOM */}
      <button
        onClick={downloadPDF}
        style={{
          marginTop: "25px",
          marginBottom: "40px",
          padding: "12px 22px",
          background: "#0D2D59",
          color: "#fff",
          border: "none",
          borderRadius: "10px",
          cursor: "pointer",
          fontSize: "16px",
          fontWeight: "600",
        }}
      >
        Download PDF
      </button>
    </div>
  );
}
