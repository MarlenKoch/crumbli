import React from "react";
import { Link } from "react-router-dom";
//import RecipeCategoryPage from "./RecipeCategoryPage";
import RecipeSearchBar from "./RecipeSearchBar";
import RandomRecipes from "./RandomRecipes";
import "../App.css";
import "./Home.css";

const Home: React.FC = () => {
  return (
    <div className="container-home">
      <div className="topnav">
        <p className="big-header">CRÜMBLI</p>
        <RecipeSearchBar />
      </div>
      <div className="home-page">
        <div className="column-left">
          <RandomRecipes />
        </div>
        <div className="column-right">
          <div>
            <Link to="/recipes">
              <button className="link-button-1">View All Recipes</button>
            </Link>
            <Link to="/add-recipe">
              <button className="link-button-2">Add Recipe</button>
            </Link>
            <Link to="/favorites">
              <button className="link-button-3">View Favorites</button>
            </Link>
            <Link to="/ingredients">
              <button className="link-button-4">All Ingredients</button>
            </Link>
          </div>
        </div>
      </div>

      {/* <RecipeCategoryPage /> */}
    </div>
  );
};

export default Home;
