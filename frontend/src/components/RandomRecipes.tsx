import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./RandomRecipe.css";
import alienImage from '../../assets/alien.jpg';


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
  const categories = ["Kochen", "Backen"];
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

  useEffect(() => {
    const adjustFontSize = () => {
      const textElements = document.querySelectorAll(".text-a");
      textElements.forEach((textElement) => {
        const element = textElement as HTMLElement;
        const textLength = element.textContent?.length || 0;

        const containerWidth = window.innerWidth;
        const newFontSize = Math.min(
          24,
          ((containerWidth * 0.265) / textLength) * 2
        );
        element.style.fontSize = newFontSize + "px";
      });
    };

    adjustFontSize();
  }, [categories, recipes]);



  return (
    <div>
      <div>
        {categories.map((category) => (
          <div key={category} style={{ marginBottom: "20px" }}>
            {recipes[category] ? (
              <div
                onClick={() => handleRecipeClick(recipes[category]!.id)}
                className="polaroid"
              >
                <img
                  src={recipes[category]!.image ? `http://localhost:3000${recipes[category]!.image}` : alienImage}
                  alt={recipes[category]!.name}
                  className="img-a"
                />


                <p className="text-a">
                  heute {category}: {recipes[category]!.name}
                </p>
              </div>
            ) : (
              <p>In dieser Kategorie gibt es noch keine Rezepte.</p>
            )}
          </div>
        ))}
      </div>
      <button onClick={handleRefresh} className="refresh-button">
        Neue zufällige Rezepte{" "}
      </button>
    </div>
  );
};

export default RandomRecipes;
