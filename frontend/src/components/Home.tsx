import React from "react";
import { Link } from "react-router-dom";
//import RecipeCategoryPage from "./RecipeCategoryPage";
import RecipeSearchBar from "./RecipeSearchBar";
import RandomRecipes from "./RandomRecipes";
import "../App.css";
import "./Home.css";

const Home: React.FC = () => {
  return (
    <div className="">
      <div className="topnav">
        <p className="big-header">CRÜMBLI</p>
        <RecipeSearchBar />
      </div>
      <div className="topnav">
        <div className="column-left">
          <RandomRecipes />
        </div>
        <div className="column-right">
          <Link to="/recipes">
            <button className="link-button-1">Alle Rezepte</button>
          </Link>
          <Link to="/add-recipe">
            <button className="link-button-2">Rezept hinzufügen</button>
          </Link>
          <Link to="/favorites">
            <button className="link-button-3">Meine Favoriten</button>
          </Link>
          <Link to="/ingredients">
            <button className="link-button-4">Alle Zutaten</button>
          </Link>
        </div>
      </div>

      {/* <RecipeCategoryPage /> */}
    </div>
  );
};

export default Home;
