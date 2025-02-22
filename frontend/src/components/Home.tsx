import React from "react";
import { Link } from "react-router-dom";
//import RecipeCategoryPage from "./RecipeCategoryPage";
import RecipeSearchBar from "./RecipeSearchBar";
import RandomRecipes from "./RandomRecipes";

const Home: React.FC = () => {
  return (
    <div>
      <h1>CRÜMBLI</h1>
      <Link to="/recipes">
        <button>View All Recipes</button>
      </Link>
      <Link to="/add-recipe">
        <button>Add Recipe</button>
      </Link>
      <Link to="/favorites">
        <button>View Favorites</button>
      </Link>
      <Link to="/ingredients">
        <button>All Ingredients</button>
      </Link>
      {/* <RecipeCategoryPage /> */}
      <RecipeSearchBar />
      <RandomRecipes />
    </div>
  );
};

export default Home;
