import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Recipe {
  id: number;
  name: string;
  image: string;
  instructions: string;
  ingredients: { id: number; name: string; amount: string; unit: string }[];
}

const RecipeCategoryPage: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [categories] = useState<string[]>([
    "Kochen",
    "Backen", // Add more categories as needed
  ]);
  const [selectedCategory, setSelectedCategory] = useState<string>("Kochen");
  const [reloadTrigger, setReloadTrigger] = useState(0);

  const loadRecipes = (category: string) => {
    setSelectedCategory(category);
    setReloadTrigger((prev) => prev + 1);
  };
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedCategory) {
      axios
        .get(`http://localhost:3000/api/recipes/category/${selectedCategory}`)
        .then((res) => {
          const allRecipes = res.data.recipes;
          const randomRecipes = allRecipes
            .sort(() => 0.5 - Math.random())
            .slice(0, 5);
          setRecipes(randomRecipes);
        })
        .catch((error) => {
          console.error("Error fetching recipes:", error);
        });
    }
  }, [selectedCategory, reloadTrigger]);

  const handleRecipeClick = (id: number) => {
    navigate(`/recipe-details/${id}?from=category`);
  };

  return (
    <div>
      <h2>Recipe Categories</h2>
      <div style={{ marginBottom: "20px" }}>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => loadRecipes(category)}
            style={{
              margin: "5px",
              padding: "10px",
              cursor: "pointer",
              backgroundColor:
                selectedCategory === category ? "lightblue" : "white",
            }}
          >
            {category}
          </button>
        ))}
      </div>
      <div>
        <h3>Random Recipes in {selectedCategory}</h3>
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
                  style={{
                    width: "150px",
                    height: "100px",
                    objectFit: "cover",
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecipeCategoryPage;
