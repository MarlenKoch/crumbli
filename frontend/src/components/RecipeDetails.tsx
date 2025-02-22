import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams, useLocation } from "react-router-dom";

interface Ingredient {
  id: number;
  name: string;
  amount: string;
  unit: string;
}

interface RecipeDetail {
  id: number;
  name: string;
  image: string; // Should store the relative path, like "/uploads/{filename}"
  instructions: string;
  favorite: boolean;
  category: string;
  ingredients: Ingredient[];
}

const RecipeDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<RecipeDetail | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

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

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this recipe?")) {
      axios
        .delete(`http://localhost:3000/api/recipes/${id}`)
        .then(() => {
          alert("Recipe deleted successfully.");
          navigate("/");
        })
        .catch((err) => {
          console.error(err);
          alert("Error deleting recipe.");
        });
    }
  };

  const handleEdit = () => {
    navigate(`/edit-recipe/${id}`);
  };

  const handleBack = () => {
    const queryParams = new URLSearchParams(location.search);
    const from = queryParams.get("from");
    if (from == "recipes") {
      navigate("/recipes"); // Go back to the previous page if 'from' parameter is present
    } else if (from) {
      navigate(-1);
    } else {
      navigate("/"); // Default action to navigate to the home page
    }
  };

  if (!recipe) {
    return <div>Loading...</div>;
  }

  // Ensure that the image path is prefixed with the correct base URL
  const imageSrc = `http://localhost:3000${recipe.image}`;

  return (
    <div>
      <h2>{recipe.name}</h2>
      <img
        src={imageSrc}
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
      <button onClick={handleEdit}>Edit Recipe</button>
      <button onClick={handleDelete}>Delete Recipe</button>
      <button onClick={handleBack}>Back</button>
    </div>
  );
};

export default RecipeDetails;
