import React from "react";
import { Link } from "react-router-dom";
import "./HeaderBar.css";

const HeaderBar: React.FC = () => {
  return (
    <header className="header-bar">
      <Link to="/">
        <img src="../assets/cookie.svg" className="cookie-button"></img>
      </Link>
      <Link to="/add-recipe">
        <button className="add-recipe-button">Neues Rezept hinzufügen</button>
      </Link>
    </header>
  );
};

export default HeaderBar;
