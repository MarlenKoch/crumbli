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
  const [isEditing, setIsEditing] = useState({
    name: false,
    image: false,
    instructions: false,
    category: false,
    favorite: false,
  });
  const [isAddingIngredient, setIsAddingIngredient] = useState(false);
  const [newIngredient, setNewIngredient] = useState({
    name: "",
    amount: "",
    unit: "",
  });
  // const [originalRecipe, setOriginalRecipe] = useState<RecipeDetail | null>(
  //   null
  // );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/recipes/${id}`)
      .then((res) => {
        setRecipe(res.data);
        //setOriginalRecipe(res.data);
      })
      .catch((err) => {
        console.error(err);
        alert("Error loading recipe details.");
      });
  }, [id]);

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

  const handleAddIngredient = async () => {
    try {
      // Attempt to find the existing ingredient
      const response = await axios.get(
        "http://localhost:3000/api/ingredients/id",
        {
          params: { name: newIngredient.name },
        }
      );

      // Retrieve the ingredient ID from the response
      const ingredientId = response.data.ingredient_id;

      if (ingredientId) {
        // Proceed to link this existing ingredient to the recipe
        await addIngredientToRecipe(ingredientId);
      } else {
        throw new Error("Ingredient ID not found");
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        // Handle a 404 response, indicating the ingredient wasn't found
        if (err.response && err.response.status === 404) {
          if (
            window.confirm(`${newIngredient.name} does not exist. Create it?`)
          ) {
            try {
              // Create new ingredient if confirmed
              const createResponse = await axios.post(
                "http://localhost:3000/api/ingredients",
                {
                  name: newIngredient.name,
                }
              );

              const newIngredientId = createResponse.data.ingredient.id;
              await addIngredientToRecipe(newIngredientId);
            } catch (creationError) {
              console.error("Error creating ingredient: ", creationError);
              alert("An error occurred while creating the new ingredient.");
            }
          }
        } else {
          console.error("API error: ", err.response ?? err.message);
          alert(`API error: ${err.response?.data?.error || err.message}`);
        }
      } else {
        console.error("Unexpected error: ", err);
        alert("Unexpected error occurred while adding the ingredient.");
      }
    }
  };

  const addIngredientToRecipe = async (ingredientId: number) => {
    try {
      await axios.post(`http://localhost:3000/api/recipes/${id}/ingredient`, {
        ingredient_id: ingredientId,
        amount: newIngredient.amount,
        unit: newIngredient.unit,
      });

      setRecipe((prevRecipe) => {
        if (!prevRecipe) return prevRecipe;
        return {
          ...prevRecipe,
          ingredients: [
            ...prevRecipe.ingredients,
            {
              id: ingredientId,
              name: newIngredient.name,
              amount: newIngredient.amount,
              unit: newIngredient.unit,
            },
          ],
        };
      });

      resetIngredientModal();
    } catch (error) {
      console.error("Error adding ingredient to recipe: ", error);
      alert("Error adding ingredient to recipe.");
    }
  };

  const handleDetailSubmit = async () => {
    if (!recipe) return;

    let imagePath = recipe.image; // Default to existing image

    // Upload new image if available
    if (imageFile) {
      try {
        const formData = new FormData();
        formData.append("image", imageFile);
        const response = await axios.post(
          "http://localhost:3000/api/upload",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        imagePath = response.data.filePath;
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("Error uploading new image.");
        return;
      }
    }

    axios
      .put(`http://localhost:3000/api/recipes/${id}/details`, {
        name: recipe.name,
        image: imagePath, // Use new image path if changed
        instructions: recipe.instructions,
        favorite: recipe.favorite,
        category: recipe.category,
      })
      .then(() => {
        alert("Recipe details updated successfully.");
        //setOriginalRecipe({ ...recipe, image: imagePath });
        setImageFile(null); // Reset image file after saving
        setIsEditing({
          name: false,
          image: false,
          instructions: false,
          category: false,
          favorite: false,
        });
      })
      .catch((err) => {
        console.error(err);
        alert("Error updating recipe details.");
      });
  };

  const handleDetailEdit = (field: keyof RecipeDetail, value: unknown) => {
    if (recipe) {
      setRecipe({ ...recipe, [field]: value });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageFile(e.target.files[0]);
    }
  };

  const toggleEdit = (field: keyof typeof isEditing) => {
    setIsEditing((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  const handleBackToRecipe = () => {
    handleDetailSubmit();
    navigate(`/recipe-details/${id}`);
  };

  const resetIngredientModal = () => {
    setNewIngredient({ name: "", amount: "", unit: "" });
    setIsAddingIngredient(false);
  };

  if (!recipe) {
    return <div>Loading...</div>;
  }

  const imageSrc = `http://localhost:3000${recipe.image}`;

  return (
    <div className="container-scrollable">
      <h2>Editing: {recipe.name}</h2>

      <div>
        <label>
          Name:
          {isEditing.name ? (
            <input
              type="text"
              value={recipe.name}
              onChange={(e) => handleDetailEdit("name", e.target.value)}
              onBlur={() => toggleEdit("name")}
            />
          ) : (
            <span onClick={() => toggleEdit("name")}>{recipe.name}</span>
          )}
        </label>
      </div>

      <div>
        <label>
          Image:
          {isEditing.image ? (
            <div>
              <input type="file" accept="image/*" onChange={handleFileChange} />
              <button onClick={() => setImageFile(null)}>Cancel</button>
            </div>
          ) : (
            <img
              src={imageSrc}
              alt="current"
              onClick={() => toggleEdit("image")}
              style={{
                cursor: "pointer",
                width: "150px",
                height: "100px",
                objectFit: "cover",
              }}
            />
          )}
        </label>
      </div>

      <div>
        <label>
          Instructions:
          {isEditing.instructions ? (
            <textarea
              value={recipe.instructions}
              onChange={(e) => handleDetailEdit("instructions", e.target.value)}
              onBlur={() => toggleEdit("instructions")}
            />
          ) : (
            <span onClick={() => toggleEdit("instructions")}>
              {recipe.instructions}
            </span>
          )}
        </label>
      </div>

      <div>
        <label>
          Category:
          {isEditing.category ? (
            <select
              value={recipe.category}
              onChange={(e) => handleDetailEdit("category", e.target.value)}
              onBlur={() => toggleEdit("category")}
            >
              <option value="Backen">Backen</option>
              <option value="Kochen">Kochen</option>
            </select>
          ) : (
            <span onClick={() => toggleEdit("category")}>
              {recipe.category}
            </span>
          )}
        </label>
      </div>

      <div>
        <label>
          Favorite:
          {isEditing.favorite ? (
            <input
              type="checkbox"
              checked={recipe.favorite}
              onChange={(e) => handleDetailEdit("favorite", e.target.checked)}
              onBlur={() => toggleEdit("favorite")}
            />
          ) : (
            <span onClick={() => toggleEdit("favorite")}>
              {recipe.favorite ? "Yes" : "No"}
            </span>
          )}
        </label>
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
        <button onClick={() => setIsAddingIngredient(true)}>
          Add Ingredient
        </button>
      </div>

      <button onClick={handleBackToRecipe}>Back to Recipe</button>

      {isAddingIngredient && (
        <div className="ingredient-modal">
          <h3>Add New Ingredient</h3>
          <label>
            Name:
            <input
              type="text"
              value={newIngredient.name}
              onChange={(e) =>
                setNewIngredient({ ...newIngredient, name: e.target.value })
              }
            />
          </label>
          <label>
            Amount:
            <input
              type="text"
              value={newIngredient.amount}
              onChange={(e) =>
                setNewIngredient({ ...newIngredient, amount: e.target.value })
              }
            />
          </label>
          <select
            onChange={(e) =>
              setNewIngredient({ ...newIngredient, unit: e.target.value })
            }
          >
            <option value="TL">TL</option>
            <option value="EL">EL</option>
            <option value="Pck">Pck</option>
            <option value="Tasse">Tasse</option>
            <option value="g">g</option>
            <option value="Kg">Kg</option>
            <option value="l">l</option>
            <option value="Blt">Blt</option>
            <option value="ml">ml</option>
            <option value="Prise">Prise</option>
            <option value="Tropfen">Tropfen</option>
            <option value=" ">-</option>
          </select>
          <button onClick={handleAddIngredient}>Add Ingredient</button>
          <button onClick={resetIngredientModal}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default EditRecipe;
