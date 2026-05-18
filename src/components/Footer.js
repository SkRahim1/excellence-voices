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

      <footer className="footer">
        © 2026 Excellence - Empowering Young Voices. All Rights Reserved.
      </footer>
    </section>
  );
}
