import React, { useState, useEffect } from "react";
import axios from "axios";
import { Recipe } from "../types"; // Import the Recipe type

const RecipeList: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get<{ data: Recipe[] }>(
          "http://localhost:3001/recipes"
        );
        setRecipes(response.data.data);
        setLoading(false);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        setError("Failed to fetch recipes");
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Recipe List</h1>
      <ul>
        {recipes.map((recipe) => (
          <li key={recipe.id}>
            <h2>{recipe.name}</h2>
            {recipe.picture && <img src={recipe.picture} alt={recipe.name} />}
            {recipe.instruction && <p>{recipe.instruction}</p>}
            <div>
              <h4>Ingredients:</h4>
              <ul>
                {recipe.ingredients.map((ingredient) => (
                  <li key={ingredient.id}>{ingredient.name}</li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecipeList;
