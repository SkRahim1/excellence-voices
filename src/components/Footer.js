// import React from "react";

// export default function Footer() {
//   return (
//     <footer className="footer">
//       © {new Date().getFullYear()} Excellence - Empowering Young Voices. All
//       Rights Reserved.
//     </footer>
//   );
// }

import React from "react";

export default function Footer({ activeSection }) {
  return (
    <section
      id="contact"
      className={`section dark ${
        activeSection === "contact" ? "highlight-dark" : ""
      }`}
    >
      <div className="container">
        <h2 className="heading white">Contact Us</h2>

        <p className="para white">
          We provide training only in schools. Contact us for school training
          programs.
        </p>

        <div className="contact-info">
          <p>📞 +91 9284306159</p>

          <p>📞 +91 6304300983</p>

          <p>📞 +91 8125318601</p>

          <p>📧 info@excellencevoices.in</p>
        </div>
      </div>

      <footer className="footer" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
        <div>© 2026 Excellence - Empowering Young Voices. All Rights Reserved.</div>
        <div style={{ fontSize: "0.85em", opacity: 0.8, marginTop: "2px" }}>
          A product of <a href="https://renvixteach.in" target="_blank" rel="noopener noreferrer" style={{ color: "#38bdf8", textDecoration: "underline", fontWeight: "500" }}>Renvix Technologies</a>
        </div>
      </footer>
    </section>
  );
}
