import React from "react";
import { Link } from "react-router-dom";

const HeaderBar: React.FC = () => {
  return (
    <header>
      <Link to="/add-recipe">
        <button>+</button>
      </Link>
      <Link to="/" style={{ margin: "0 10px" }}>
        <button>|^|</button>
      </Link>
    </header>
  );
};

export default HeaderBar;
