import React, { useEffect, useState } from "react";
import axios from "axios";
import "./IngredientList.css";

interface Ingredient {
  id: number;
  name: string;
}

const IngredientList: React.FC = () => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get<{ ingredients: Ingredient[] }>(
        "http://localhost:3000/api/ingredients"
      )
      .then((response) => {
        setIngredients(response.data.ingredients);
      })
      .catch((err) => {
        console.error("Error fetching ingredients: ", err);
        setError("Failed to load ingredients. Please try again later.");
      });
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1 className="liste-titel">Alle deine Zutaten:</h1>
      <ul className="ingredient-box">
        {ingredients.map((ingredient) => (
          <li key={ingredient.id}>{ingredient.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default IngredientList;
