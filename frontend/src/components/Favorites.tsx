import React, { useEffect, useState } from "react";
import axios from "axios";

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
    </div>
  );
};

export default Favorites;
