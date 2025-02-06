import React from "react";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  return (
    <div>
      <h1>Recipe App</h1>
      <Link to="/recipes">
        <button>View All Recipes</button>
      </Link>
      <Link to="/add-recipe">
        <button>Add Recipe</button>
      </Link>
      <Link to="/favorites">
        <button>View Favorites</button>
      </Link>
    </div>
  );
};

export default Home;
