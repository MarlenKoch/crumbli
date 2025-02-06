import React, { useEffect, useState } from "react";
import axios from "axios";
import { Recipe } from "../types";

type RecipeListProps = {
  updateFlag: boolean;
};

const RecipeList: React.FC<RecipeListProps> = ({ updateFlag }) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/recipes")
      .then((response) => setRecipes(response.data.recipes))
      .catch((error) => console.error("Error fetching recipes:", error));
  }, [updateFlag]); // Fetch recipes whenever updateFlag changes

  return (
    <div>
      <h2>Recipes</h2>
      {recipes.map((recipe) => (
        <div key={recipe.id} className="recipe">
          <h3>{recipe.name}</h3>
          <p>{recipe.instruction}</p>
          <p>Category: {recipe.category}</p>
        </div>
      ))}
    </div>
  );
};

export default RecipeList;
