import React from "react";
import { Link } from "react-router-dom";

const FooterBar: React.FC = () => {
  return (
    <footer className="footer-bar">
      <ul className="footer-links">
        <Link to="/impressum" className="white-link">
          Impressum
        </Link>
        <Link to="/data-safety" className="white-link">
          Datenschutzhinweis
        </Link>
        <Link to="/pizza-ist-toll" className="white-link">
          Warum Pizza toll ist
        </Link>
        <Link to="/ueber-crumbli" className="white-link">
          Über Crümbli
        </Link>
      </ul>
    </footer>
  );
};

export default FooterBar;
