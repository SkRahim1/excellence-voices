import React, { useState, useEffect, useRef } from "react";

import { useParams } from "react-router-dom";

import jsPDF from "jspdf";

import { getContentItem } from "../../services/dataService";

import "./ContentPage.css";

export default function ContentPage() {
  const { classId, category, id } = useParams();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentLine, setCurrentLine] = useState(-1);
  const [searchQuery, setSearchQuery] = useState("");
  const lineRefs = useRef([]);
  const readingSessionIdRef = useRef(0);

  // Parse clean lines: trim outer spaces, and collapse multiple empty lines
  const cleanLines = React.useMemo(() => {
    if (!item || !item.content) return [];
    const rawLines = item.content.replace(/\r/g, "").trim().split("\n");
    const result = [];
    let lastWasEmpty = false;
    
    rawLines.forEach((line) => {
      const trimmed = line.trim();
      if (trimmed === "") {
        if (!lastWasEmpty) {
          result.push("");
          lastWasEmpty = true;
        }
      } else {
        result.push(line);
        lastWasEmpty = false;
      }
    });
    return result;
  }, [item]);

  // Parse action words content if current category is actionWords
  const actionWordsData = React.useMemo(() => {
    if (category !== "actionWords" || !item || !item.content) return [];
    
    return cleanLines.map((line, index) => {
      const trimmed = line.trim();
      if (trimmed === "") return null;
      
      const parts = trimmed.split(":");
      if (parts.length < 2) return null;
      
      const numWord = parts[0].trim();
      const wordMatch = numWord.match(/^(\d+)\.\s*(.*)$/);
      const number = wordMatch ? wordMatch[1] : (index + 1).toString();
      const baseWord = wordMatch ? wordMatch[2] : numWord;
      
      const forms = parts[1].split(",").map(f => f.trim());
      return {
        originalLineIndex: index,
        number,
        baseWord: baseWord.charAt(0).toUpperCase() + baseWord.slice(1),
        v1: forms[0] || "",
        v2: forms[1] || "",
        v3: forms[2] || "",
        v4: forms[3] || "",
        v5: forms[4] || ""
      };
    }).filter(x => x !== null);
  }, [category, item, cleanLines]);

  // Filtered action words based on search query
  const filteredActionWords = React.useMemo(() => {
    if (!searchQuery.trim()) return actionWordsData;
    const query = searchQuery.toLowerCase().trim();
    return actionWordsData.filter(
      w => w.baseWord.toLowerCase().includes(query) ||
           w.v1.toLowerCase().includes(query) ||
           w.v2.toLowerCase().includes(query) ||
           w.v3.toLowerCase().includes(query) ||
           w.v4.toLowerCase().includes(query) ||
           w.v5.toLowerCase().includes(query)
    );
  }, [actionWordsData, searchQuery]);

  // Reset scroll to top of the page and stop reading when navigating to a new item or unmounting
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    setCurrentLine(-1);
    return () => {
      readingSessionIdRef.current = 0;
      window.speechSynthesis.cancel();
    };
  }, [classId, category, id]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    getContentItem(classId, category, id).then((data) => {
      if (active) {
        setItem(data);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [classId, category, id]);

  useEffect(() => {
    if (currentLine >= 0 && lineRefs.current[currentLine]) {
      lineRefs.current[currentLine].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [currentLine]);



  if (loading) {
    return (
      <div className="container" style={{ textAlign: "center", padding: "80px 0" }}>
        <h1 className="heading">Loading Content...</h1>
      </div>
    );
  }

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

    const addWatermark = () => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(60);
      doc.setTextColor(240, 240, 240);
      doc.text("Excellence Voices", pageWidth / 2, pageHeight / 2, {
        align: "center",
        angle: 315,
      });
    };

    addWatermark();
    addHeader();

    doc.setFont("helvetica", "bold");

    doc.setFontSize(22);

    doc.setTextColor(13, 45, 89);

    const titleLines = doc.splitTextToSize(item.title, maxWidth);

    doc.text(titleLines, margin, y);

    y += 18;

    const lines = cleanLines;

    lines.forEach((line) => {
      if (y > pageHeight - 25) {
        addFooter();

        doc.addPage();

        addWatermark();

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
    const sessionId = ++readingSessionIdRef.current;
    window.speechSynthesis.cancel();

    const lines = cleanLines;

    for (let i = 0; i < lines.length; i++) {
      if (readingSessionIdRef.current !== sessionId) break;

      const text = lines[i].trim();

      if (!text) continue;

      setCurrentLine(i);

      await new Promise((resolve) => {
        if (readingSessionIdRef.current !== sessionId) {
          resolve();
          return;
        }

        const speech = new SpeechSynthesisUtterance(text);

        speech.lang = "en-IN";

        speech.rate = 0.8;

        speech.pitch = 1;

        speech.onend = () => resolve();
        speech.onerror = () => resolve();

        window.speechSynthesis.speak(speech);
      });
    }

    if (readingSessionIdRef.current === sessionId) {
      setCurrentLine(-1);
    }
  };

  // STOP
  const stopSpeaking = () => {
    readingSessionIdRef.current = 0;
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

      {category === "actionWords" ? (
        <div className="action-words-container">
          <div className="search-bar-wrapper">
            <input
              type="text"
              className="action-words-search"
              placeholder="🔍 Search verbs or forms (e.g. eat, running, walked)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="clear-search-btn" onClick={() => setSearchQuery("")}>
                ✕
              </button>
            )}
          </div>

          <div className="verbs-table-wrapper">
            <table className="verbs-table">
              <thead>
                <tr>
                  <th className="col-v1">V1 (Base)</th>
                  <th className="col-v2">V2 (Past)</th>
                  <th className="col-v3">V3 (Participle)</th>
                  <th className="col-v4">V4 (-ing)</th>
                  <th className="col-v5">V5 (Future)</th>
                </tr>
              </thead>
              <tbody>
                {filteredActionWords.map((row) => {
                  const isActive = currentLine === row.originalLineIndex;
                  const activeClass = isActive ? "active-reading-row" : "";
                  return (
                    <tr
                      key={row.originalLineIndex}
                      ref={(el) => (lineRefs.current[row.originalLineIndex] = el)}
                      className={`verb-row ${activeClass}`}
                    >
                      <td className="cell-v1">
                        <span className="verb-number-badge">{row.number}.</span> {row.baseWord}
                      </td>
                      <td className="cell-v2">{row.v2}</td>
                      <td className="cell-v3">{row.v3}</td>
                      <td className="cell-v4">{row.v4}</td>
                      <td className="cell-v5">{row.v5}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filteredActionWords.length === 0 && (
              <div className="no-verbs-found">
                <p>No action words matched your search.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="content-box">
          {cleanLines.map((line, index) => {
            if (line.trim() === "") {
              return <div key={index} className="spacing-line" />;
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
      )}

      <button onClick={downloadPDF} className="download-btn">
        Download PDF
      </button>
    </div>
  );
}
