import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

interface Ingredient {
  id: number;
  name: string;
  amount: string;
  unit: string;
}

interface RecipeDetail {
  id: number;
  name: string;
  image: string;
  instructions: string;
  favorite: boolean;
  category: string;
  ingredients: Ingredient[];
}

const RecipeDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<RecipeDetail | null>(null);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/recipes/${id}`)
      .then((res) => {
        setRecipe(res.data);
      })
      .catch((err) => {
        console.error(err);
        alert("Error loading recipe details.");
      });
  }, [id]);

  if (!recipe) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>{recipe.name}</h2>
      <img
        src={recipe.image}
        alt={recipe.name}
        style={{ width: "300px", height: "200px", objectFit: "cover" }}
      />
      <p>
        <strong>Instructions:</strong> {recipe.instructions}
      </p>
      <p>
        <strong>Category:</strong> {recipe.category}
      </p>
      <p>
        <strong>Favorite:</strong> {recipe.favorite ? "Yes" : "No"}
      </p>
      <h3>Ingredients:</h3>
      <ul>
        {recipe.ingredients.map((ingredient) => (
          <li key={ingredient.id}>
            {ingredient.amount} {ingredient.unit} of {ingredient.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecipeDetails;
