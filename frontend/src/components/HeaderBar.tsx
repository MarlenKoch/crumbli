import React from "react";
import { Link } from "react-router-dom";

const HeaderBar: React.FC = () => {
  return (
    <header className="header-bar">
      <Link to="/">
        <button>|^|</button>
      </Link>
      <Link to="/add-recipe">
        <button>Add another Recipe</button>
      </Link>
    </header>
  );
};

export default HeaderBar;
