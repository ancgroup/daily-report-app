// src/components/Footer.tsx
import React from "react";

const Footer: React.FC = () => (
  <footer
    style={{
      textAlign: "center",
      padding: "0.5rem",
      fontSize: "0.8rem",
      color: "#555",
      position: "fixed",
      bottom: 0,
      width: "100%",
      background: "#f8f8f8",
      borderTop: "1px solid #ddd",
      zIndex: 100,
    }}
  >
    Copyright © ANC co.,ltd. All Rights Reserved.
  </footer>
);

export default Footer;
