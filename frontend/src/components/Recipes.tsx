import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Recipe {
  id: number;
  name: string;
  image: string;
}

const Recipes: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const navigate = useNavigate(); // Use navigate instead of history

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/recipes/no-ingredients")
      .then((res) => {
        setRecipes(res.data.recipes);
      });
  }, []);

  const handleRecipeClick = (id: number) => {
    navigate(`/recipe-details/${id}?from=recipes`);
  };

  return (
    <div>
      <h2>Recipes</h2>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {recipes.map((recipe) => (
          <div
            key={recipe.id}
            style={{ margin: "10px", cursor: "pointer" }}
            onClick={() => handleRecipeClick(recipe.id)}
          >
            <h3>{recipe.name}</h3>
            {recipe.image && (
              <img
                src={recipe.image}
                alt={recipe.name}
                style={{ width: "150px", height: "100px", objectFit: "cover" }}
              />
            )}
          </div>
        ))}
      </div>
      <button onClick={() => navigate(`/`)}>Back</button>
    </div>
  );
};

export default Recipes;
