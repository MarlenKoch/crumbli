import React from "react";
import { Link } from "react-router-dom";

const FooterBar: React.FC = () => {
  return (
    <footer className="footer-bar">
      <ul className="footer-links">
        <Link to="/impressum" className="white-link">
          Impressum
        </Link>
        <Link to="/data-safety">Data Safety Information</Link>
        <Link to="/pizza-ist-toll">Warum Pizza toll ist</Link>
        <li>
          <a href="/link3">Link 3</a>
        </li>
      </ul>
    </footer>
  );
};

export default FooterBar;
