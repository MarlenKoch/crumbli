import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Recipes from "./components/Recipes";
import AddRecipe from "./components/AddRecipe";
import Favorites from "./components/Favorites";
import RecipeDetails from "./components/RecipeDetails"; // Import your RecipeDetails component

const App: React.FC = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/add-recipe" element={<AddRecipe />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/recipe-details/:id" element={<RecipeDetails />} />{" "}
          {/* Correctly map the path to RecipeDetails */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
