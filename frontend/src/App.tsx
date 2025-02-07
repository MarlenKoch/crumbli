import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Recipes from "./components/Recipes";
import AddRecipe from "./components/AddRecipe";
import Favorites from "./components/Favorites";
import RecipeDetails from "./components/RecipeDetails";
import Impressum from "./components/Impressum";
import DataSafetyInformation from "./components/DataSafetyInformation";
import FooterBar from "./components/FooterBar";
import EditRecipe from "./components/EditRecipe";
import IngredientList from "./components/IngredientList";

const App: React.FC = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/add-recipe" element={<AddRecipe />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/recipe-details/:id" element={<RecipeDetails />} />
          <Route path="/impressum" element={<Impressum />} />
          <Route path="/data-safety" element={<DataSafetyInformation />} />
          <Route path="/edit-recipe/:id" element={<EditRecipe />} />
          <Route path="/ingredients" element={<IngredientList />} />
        </Routes>
        <FooterBar /> {/* Ensure the FooterBar is outside the Routes */}
      </div>
    </Router>
  );
};

export default App;
