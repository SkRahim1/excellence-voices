import React from "react";
import { Phone, Mail, MapPin, Instagram } from "lucide-react";

export default function Topbar() {
  return (
    <div className="topbar">
      <div className="topbar-left">
        <span>
          <Phone size={14} /> +91 9284306159
        </span>

        <span>
          <Mail size={14} /> info@excellencevoices.in
        </span>

        <a
          href="https://instagram.com/excellence_voices"
          target="_blank"
          rel="noreferrer"
          className="top-link"
        >
          <Instagram size={16} />
        </a>
      </div>

      <div className="topbar-right">
        <MapPin size={14} /> India
      </div>
    </div>
  );
}
