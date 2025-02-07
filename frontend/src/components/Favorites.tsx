import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Recipe {
  id: number;
  name: string;
  image: string;
  instructions: string;
  favorite: boolean;
  category: string;
  ingredients: Array<{
    id: number;
    name: string;
    amount: string;
    unit: string;
  }>;
}

const Favorites: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const navigate = useNavigate(); // Use navigate instead of history

  useEffect(() => {
    axios.get("http://localhost:3000/api/recipes/favorites").then((res) => {
      setRecipes(res.data.recipes);
    });
  }, []);

  return (
    <div>
      <h2>Favorite Recipes</h2>
      <ul>
        {recipes.map((recipe) => (
          <li key={recipe.id}>
            <h3>{recipe.name}</h3>
            <img src={recipe.image} alt={recipe.name} />
            <p>{recipe.instructions}</p>
            <p>Category: {recipe.category}</p>
            <p>Favorite: {recipe.favorite ? "Yes" : "No"}</p>
          </li>
        ))}
      </ul>
      <button onClick={() => navigate(`/`)}>Back</button>
    </div>
  );
};

export default Favorites;
