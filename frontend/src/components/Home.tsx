import React from "react";
import { Link } from "react-router-dom";
//import RecipeCategoryPage from "./RecipeCategoryPage";
import RecipeSearchBar from "./RecipeSearchBar";
import RandomRecipes from "./RandomRecipes";
import "../App.css";

const Home: React.FC = () => {
  return (
    <div className="container-vertical">
      <div className="container-fullscreen">
        <p className="big-header">CRÜMBLI</p>
        <RecipeSearchBar />
      </div>
      <div className="container">
        <RandomRecipes />
        <div className="container-vertical">
          <div className="container-vertical">
            <p>diese App ist toll</p>
            <img src="cake.png"></img>
          </div>
          <div className="container">
            <Link to="/recipes">
              <button className="squareButton">View All Recipes</button>
            </Link>
            <Link to="/add-recipe">
              <button className="squareButton">Add Recipe</button>
            </Link>
            <Link to="/favorites">
              <button className="squareButton">View Favorites</button>
            </Link>
            <Link to="/ingredients">
              <button className="squareButton">All Ingredients</button>
            </Link>
          </div>
        </div>
      </div>

      {/* <RecipeCategoryPage /> */}
    </div>
  );
};

export default Home;
