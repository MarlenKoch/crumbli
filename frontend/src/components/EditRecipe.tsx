import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

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

const EditRecipe: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<RecipeDetail | null>(null);
  //   const [newIngredient, setNewIngredient] = useState<Ingredient>({
  //     id: 0,
  //     name: "",
  //     amount: "",
  //     unit: "",
  //   });
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/recipes/${id}`)
      .then((res) => setRecipe(res.data))
      .catch((err) => {
        console.error(err);
        alert("Error loading recipe details.");
      });
  }, [id]);

  const handleDetailEdit = (field: keyof RecipeDetail, value: unknown) => {
    if (recipe) {
      setRecipe({ ...recipe, [field]: value });
    }
  };

  const handleIngredientDelete = (ingredientId: number) => {
    if (recipe) {
      axios
        .delete(`http://localhost:3000/api/recipes/${id}/ingredients`, {
          data: { ingredient_ids: [ingredientId] },
        })
        .then(() => {
          setRecipe({
            ...recipe,
            ingredients: recipe.ingredients.filter(
              (ing) => ing.id !== ingredientId
            ),
          });
          alert("Ingredient deleted successfully.");
        })
        .catch((err) => {
          console.error(err);
          alert("Error deleting ingredient.");
        });
    }
  };

  const handleDetailSubmit = () => {
    if (!recipe) return;
    axios
      .put(`http://localhost:3000/api/recipes/${id}/details`, {
        name: recipe.name,
        image: recipe.image,
        instructions: recipe.instructions,
        favorite: recipe.favorite,
        category: recipe.category,
      })
      .then(() => {
        alert("Recipe details updated successfully.");
        navigate(`/recipes/${id}`);
      })
      .catch((err) => {
        console.error(err);
        alert("Error updating recipe details.");
      });
  };

  if (!recipe) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Editing: {recipe.name}</h2>
      <div>
        <label>
          Name:
          <input
            type="text"
            value={recipe.name}
            onChange={(e) => handleDetailEdit("name", e.target.value)}
          />
        </label>
        <button onClick={handleDetailSubmit}>Edit</button>
      </div>
      <div>
        <label>
          Image:
          <input
            type="text"
            value={recipe.image}
            onChange={(e) => handleDetailEdit("image", e.target.value)}
          />
        </label>
        <button onClick={handleDetailSubmit}>Edit</button>
      </div>
      <div>
        <label>
          Instructions:
          <textarea
            value={recipe.instructions}
            onChange={(e) => handleDetailEdit("instructions", e.target.value)}
          />
        </label>
        <button onClick={handleDetailSubmit}>Edit</button>
      </div>
      <div>
        <label>
          Category:
          <input
            type="text"
            value={recipe.category}
            onChange={(e) => handleDetailEdit("category", e.target.value)}
          />
        </label>
        <button onClick={handleDetailSubmit}>Edit</button>
      </div>
      <div>
        <label>
          Favorite:
          <input
            type="checkbox"
            checked={recipe.favorite}
            onChange={(e) => handleDetailEdit("favorite", e.target.checked)}
          />
        </label>
        <button onClick={handleDetailSubmit}>Edit</button>
      </div>
      <button onClick={handleDetailSubmit}>Submit Details</button>

      <div>
        <h3>Ingredients:</h3>
        <ul>
          {recipe.ingredients.map((ingredient) => (
            <li key={ingredient.id}>
              {ingredient.amount} {ingredient.unit} of {ingredient.name}{" "}
              <button onClick={() => handleIngredientDelete(ingredient.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>

      <button onClick={() => navigate(`/recipes/${id}`)}>Back to Recipe</button>
    </div>
  );
};

export default EditRecipe;
