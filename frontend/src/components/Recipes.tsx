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
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/recipes/no-ingredients")
      .then((res) => {
        setRecipes(res.data.recipes);
      })
      .catch((err) => {
        console.error(err);
        alert("Error loading recipes.");
      });
  }, []);

  const handleRecipeClick = (id: number) => {
    navigate(`/recipe-details/${id}?from=recipes`);
  };

  return (
    <div>
      <h2>Recipes</h2>
      <div className="container-scrollable-wrap">
        {recipes.map((recipe) => {
          const imageUrl = `http://localhost:3000${recipe.image}`; // Construct full image URL
          return (
            <div
              key={recipe.id}
              onClick={() => handleRecipeClick(recipe.id)}
              style={{
                backgroundImage: `url(${imageUrl})`,
                backgroundSize: "cover", // Optional: Add to make the image cover the div
                backgroundPosition: "center",
                height: 270,
                width: 270,
                borderRadius: 10,
              }}
              className="image-button"
            >
              <h3 className="text-with-bg">{recipe.name}</h3>

              {/* {recipe.image && (
                <img
                  src={imageUrl}
                  alt={recipe.name}
                  style={{
                    width: "150px",
                    height: "100px",
                    objectFit: "cover",
                  }}
                />
              )} */}
            </div>
          );
        })}
      </div>
      <button onClick={() => navigate(`/`)}>Back</button>
    </div>
  );
};

export default Recipes;
