import React from "react";
import { Link } from "react-router-dom";

const FooterBar: React.FC = () => {
  return (
    <footer
      style={{ textAlign: "center", padding: "10px", background: "#f1f1f1" }}
    >
      <Link to="/impressum" style={{ margin: "0 10px" }}>
        Impressum
      </Link>
      <Link to="/data-safety" style={{ margin: "0 10px" }}>
        Data Safety Information
      </Link>
      <Link to="/pizza-ist-toll" style={{ margin: "0 10px" }}>
        Warum Pizza toll ist
      </Link>
    </footer>
  );
};

export default FooterBar;
