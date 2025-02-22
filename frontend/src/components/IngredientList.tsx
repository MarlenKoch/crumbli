import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Define the TypeScript interface for an ingredient
interface Ingredient {
  id: number;
  name: string;
}

const IngredientList: React.FC = () => {
  // State to hold list of ingredients
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  // State to manage loading status
  const [loading, setLoading] = useState<boolean>(true);
  // State to manage error messages
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate(); // Use navigate instead of history

  useEffect(() => {
    // Fetch all ingredients from the API
    axios
      .get<{ ingredients: Ingredient[] }>(
        "http://localhost:3000/api/ingredients"
      )
      .then((response) => {
        setIngredients(response.data.ingredients); // Correctly access the ingredients array
        setLoading(false); // Reset loading state
      })
      .catch((err) => {
        console.error("Error fetching ingredients: ", err);
        setError("Failed to load ingredients. Please try again later."); // Set error message
        setLoading(false); // Reset loading state
      });
  }, []);

  // Display a loading message while fetching data
  if (loading) {
    return <div>Loading ingredients...</div>;
  }

  // Show error messages when fetch fails
  if (error) {
    return <div>{error}</div>;
  }

  // Render the list of ingredients
  return (
    <div>
      <h2>Ingredient List</h2>
      <ul className="container-scrollable">
        {ingredients.map((ingredient) => (
          <li key={ingredient.id}>{ingredient.name}</li>
        ))}
      </ul>
      <button onClick={() => navigate(`/`)}>Back</button>
    </div>
  );
};

export default IngredientList;
