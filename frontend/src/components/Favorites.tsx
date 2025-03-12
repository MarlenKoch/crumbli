import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import alienImage from '../../assets/alienNarrow.png';
import './Favorites.css'


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
  const navigate = useNavigate();

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
      <h2>Meine Favoriten</h2>
      <div className="favourites-box">
        {recipes.map((recipe) => {
          const imageUrl = recipe.image ? `http://localhost:3000${recipe.image}` : alienImage;
          return (
            <li key={recipe.id} onClick={() => handleRecipeClick(recipe.id)} className="recipe">
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
              <p style={{ fontSize: "medium", fontStyle: "italic" }}>Kategorie: {recipe.category}</p>
            </li>
          );
        })}
      </div>
    </div>
  );
};

export default Favorites;
