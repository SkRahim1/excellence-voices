import React, { useState, useEffect, useRef } from "react";

import { useParams } from "react-router-dom";

import jsPDF from "jspdf";

import studentsData from "../data/StudentsData";

import "./ContentPage.css";

export default function ContentPage() {
  const { classId, category, id } = useParams();

  const [currentLine, setCurrentLine] = useState(-1);
  const lineRefs = useRef([]);

  useEffect(() => {
    if (currentLine >= 0 && lineRefs.current[currentLine]) {
      lineRefs.current[currentLine].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [currentLine]);
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

    const headerText = `${classId.replace(
      "class-",
      "Class-",
    )} / ${category.slice(0, -1)}-${id}`;

    const addHeader = () => {
      doc.setFont("helvetica", "bold");

      doc.setFontSize(11);

      doc.setTextColor(100);

      doc.text(headerText, margin, 12);

      doc.line(margin, 16, pageWidth - margin, 16);
    };

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

    addHeader();

    doc.setFont("helvetica", "bold");

    doc.setFontSize(22);

    doc.setTextColor(13, 45, 89);

    const titleLines = doc.splitTextToSize(item.title, maxWidth);

    doc.text(titleLines, margin, y);

    y += 18;

    const lines = item.content.split("\n");

    lines.forEach((line) => {
      if (y > pageHeight - 25) {
        addFooter();

        doc.addPage();

        addHeader();

        y = 30;
      }

      if (line.trim() === "") {
        y += 3;

        return;
      }

      if (
        line.startsWith("Scene") ||
        line.startsWith("Characters") ||
        line.startsWith("Moral") ||
        line.startsWith("Props Needed")
      ) {
        doc.setFont("helvetica", "bold");

        doc.setFontSize(16);

        doc.setTextColor(13, 45, 89);

        const headingLines = doc.splitTextToSize(line, maxWidth);

        doc.text(headingLines, margin, y);

        y += 8;

        return;
      }

      if (line.startsWith("•")) {
        doc.setFont("helvetica", "normal");

        doc.setFontSize(12);

        doc.setTextColor(0, 0, 0);

        const bulletLines = doc.splitTextToSize(line, maxWidth - 5);

        doc.text(bulletLines, margin + 5, y);

        y += bulletLines.length * 5;

        return;
      }

      const parts = line.split(":");

      if (parts.length > 1) {
        const speaker = parts[0] + ":";

        const dialogue = parts.slice(1).join(":").trim();

        doc.setFont("helvetica", "bold");

        doc.setFontSize(13);

        doc.setTextColor(13, 45, 89);

        doc.text(speaker, margin, y);

        const speakerWidth = doc.getTextWidth(speaker) + 5;

        doc.setFont("helvetica", "normal");

        doc.setFontSize(12);

        doc.setTextColor(0, 0, 0);

        const splitDialogue = doc.splitTextToSize(
          dialogue,
          maxWidth - speakerWidth,
        );

        doc.text(splitDialogue, margin + speakerWidth, y);

        y += splitDialogue.length * 5;

        return;
      }

      doc.setFont("helvetica", "normal");

      doc.setFontSize(12);

      doc.setTextColor(0, 0, 0);

      const normalLines = doc.splitTextToSize(line, maxWidth);

      doc.text(normalLines, margin, y);

      y += normalLines.length * 5;
    });

    addFooter();

    doc.save(`${item.title}.pdf`);
  };

  // READ CONTENT
  const speakContent = async () => {
    window.speechSynthesis.cancel();

    const lines = item.content.split("\n");

    for (let i = 0; i < lines.length; i++) {
      const text = lines[i].trim();

      if (!text) continue;

      setCurrentLine(i);

      await new Promise((resolve) => {
        const speech = new SpeechSynthesisUtterance(text);

        speech.lang = "en-US";

        speech.rate = 0.9;

        speech.pitch = 1;

        speech.onend = resolve;

        window.speechSynthesis.speak(speech);
      });
    }

    setCurrentLine(-1);
  };

  // STOP
  const stopSpeaking = () => {
    window.speechSynthesis.cancel();

    setCurrentLine(-1);
  };

  return (
    <div className="container">
      <h1 className="heading">{item.title}</h1>

      <div className="audio-buttons">
        <button className="read-btn" onClick={speakContent}>
          🔊 Read Aloud
        </button>

        <button className="stop-btn" onClick={stopSpeaking}>
          ⏹ Stop Reading
        </button>
      </div>

      <div className="content-box">
        {item.content.split("\n").map((line, index) => {
          if (line.trim() === "") {
            return <br key={index} />;
          }

          const activeClass = currentLine === index ? "active-reading" : "";

          // HEADINGS
          if (
            line.startsWith("Scene") ||
            line.startsWith("Characters") ||
            line.startsWith("Moral") ||
            line.startsWith("Props Needed")
          ) {
            return (
              <h3
                ref={(el) => (lineRefs.current[index] = el)}
                key={index}
                className={activeClass}
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
                ref={(el) => (lineRefs.current[index] = el)}
                key={index}
                className={activeClass}
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
                ref={(el) => (lineRefs.current[index] = el)}
                key={index}
                className={activeClass}
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
              ref={(el) => (lineRefs.current[index] = el)}
              key={index}
              className={activeClass}
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

      <button onClick={downloadPDF} className="download-btn">
        Download PDF
      </button>
    </div>
  );
}
