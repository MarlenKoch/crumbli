import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import alienImage from '../../assets/alien.jpg';


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

  const handleRecipeClick = (id: number) => {
    navigate(`/recipe-details/${id}?from=favorites`);
  };

  return (
    <div>
      <h2>Favorite Recipes</h2>
      <div className="container-scrollable">
        <ul>
          {recipes.map((recipe) => {
            const imageUrl = recipe.image ? `http://localhost:3000${recipe.image}` : alienImage; // Construct full image URL
            return (
              <li key={recipe.id} onClick={() => handleRecipeClick(recipe.id)}>
                <h3>{recipe.name}</h3>
                <img
                  src={imageUrl}
                  alt={recipe.name}
                  style={{
                    width: "600px",
                    height: "200px",
                    objectFit: "cover",
                  }}
                />
                <p>{recipe.instructions}</p>
                <p>Category: {recipe.category}</p>
                <p>Favorite: {recipe.favorite ? "Yes" : "No"}</p>
              </li>
            );
          })}
        </ul>
      </div>
      <button onClick={() => navigate(`/`)}>Back</button>
    </div>
  );
};

export default Favorites;
