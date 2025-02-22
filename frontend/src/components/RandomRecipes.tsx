import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Recipe {
  id: number;
  name: string;
  image: string;
  instructions: string;
  ingredients: { id: number; name: string; amount: string; unit: string }[];
  category: string;
}

const RandomRecipes: React.FC = () => {
  const [recipes, setRecipes] = useState<Record<string, Recipe | null>>({});
  const categories = ["Kochen", "Backen"]; // Add more categories as needed
  const navigate = useNavigate();

  const fetchRandomRecipeForCategory = async (category: string) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/recipes/category/${category}`
      );
      const allRecipes = response.data.recipes;
      if (allRecipes.length > 0) {
        const randomRecipe =
          allRecipes[Math.floor(Math.random() * allRecipes.length)];
        return randomRecipe;
      }
      return null;
    } catch (error) {
      console.error(`Error fetching recipes for category ${category}:`, error);
      return null;
    }
  };

  const loadRandomRecipes = async () => {
    const loadedRecipes: Record<string, Recipe | null> = {};
    for (const category of categories) {
      loadedRecipes[category] = await fetchRandomRecipeForCategory(category);
    }
    setRecipes(loadedRecipes);
  };

  useEffect(() => {
    loadRandomRecipes();
  }, []);

  const handleRefresh = () => {
    loadRandomRecipes();
  };

  const handleRecipeClick = (id: number) => {
    navigate(`/recipe-details/${id}?from=random`);
  };

  return (
    <div>
      <div>
        {categories.map((category) => (
          <div key={category} style={{ marginBottom: "20px" }}>
            <h3>{category}</h3>
            {recipes[category] ? (
              <div
                onClick={() => handleRecipeClick(recipes[category]!.id)}
                style={{ cursor: "pointer", marginBottom: "10px" }}
              >
                <h4>{recipes[category]!.name}</h4>
                {recipes[category]!.image && (
                  <img
                    src={`http://localhost:3000${recipes[category]!.image}`} // Construct full image URL
                    alt={recipes[category]!.name}
                    style={{
                      width: "150px",
                      height: "100px",
                      objectFit: "cover",
                    }}
                  />
                )}
              </div>
            ) : (
              <p>No recipes available in this category.</p>
            )}
          </div>
        ))}
      </div>
      <button
        onClick={handleRefresh}
        style={{ marginBottom: "20px", cursor: "pointer" }}
      >
        Refresh
      </button>
    </div>
  );
};

export default RandomRecipes;
