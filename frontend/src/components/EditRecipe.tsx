import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './EditRecipe.css'

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
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(
    null
  );
  const [isEditingIngredient, setIsEditingIngredient] = useState(false);
  const [isAddingIngredient, setIsAddingIngredient] = useState(false);
  const [newIngredient, setNewIngredient] = useState({
    name: "",
    amount: "",
    unit: "TL",
  });

  const characterLimit = 77;

  const [imageFile, setImageFile] = useState<File | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/recipes/${id}`)
      .then((res) => {
        setRecipe(res.data);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Error loading recipe details.");
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
          toast.success("Ingredient deleted successfully.");
        })
        .catch((err) => {
          console.error(err);
          toast.error("Error deleting ingredient.");
        });
    }
  };

  const handleIngredientClick = (ingredient: Ingredient) => {
    setEditingIngredient(ingredient);
    setIsEditingIngredient(true);
  };

  const handleIngredientUpdate = async () => {
    if (!editingIngredient || !recipe) return;

    try {
      await axios.put(
        `http://localhost:3000/api/recipes/${id}/ingredients/${editingIngredient.id}`,
        {
          amount: editingIngredient.amount,
          unit: editingIngredient.unit,
        }
      );

      setRecipe((prevRecipe) => {
        if (!prevRecipe) return prevRecipe;
        return {
          ...prevRecipe,
          ingredients: prevRecipe.ingredients.map((ing) =>
            ing.id === editingIngredient.id ? editingIngredient : ing
          ),
        };
      });

      setEditingIngredient(null);
      setIsEditingIngredient(false);
      toast.success("Ingredient updated successfully.");
    } catch (error) {
      console.error("Error updating ingredient: ", error);
      toast.error("Error updating ingredient.");
    }
  };

  const handleAddIngredient = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/ingredients/id",
        {
          params: { name: newIngredient.name },
        }
      );

      const ingredientId = response.data.ingredient_id;

      if (ingredientId) {
        await addIngredientToRecipe(ingredientId);
      } else {
        throw new Error("Ingredient ID not found");
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response && err.response.status === 404) {
          if (
            window.confirm(`${newIngredient.name} does not exist. Create it?`)
          ) {
            try {
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
              toast.error(
                "An error occurred while creating the new ingredient."
              );
            }
          }
        } else {
          console.error("API error: ", err.response ?? err.message);
          toast.error(`API error: ${err.response?.data?.error || err.message}`);
        }
      } else {
        console.error("Unexpected error: ", err);
        toast.error("Unexpected error occurred while adding the ingredient.");
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
      toast.error("Error adding ingredient to recipe.");
    }
  };

  const handleDetailSubmit = async () => {
    if (!recipe) return;

    try {
      if (imageFile) {
        await uploadImage();
      }

      await axios.put(`http://localhost:3000/api/recipes/${id}/details`, {
        name: recipe.name,
        image: imageFile ? `${recipe.image}` : recipe.image,
        instructions: recipe.instructions,
        favorite: recipe.favorite,
        category: recipe.category,
      });

      toast.success("Recipe details updated successfully.");
      setIsEditing({
        name: false,
        image: false,
        instructions: false,
        category: false,
        favorite: false,
      });
    } catch (err) {
      console.error(err);
      toast.error("Error updating recipe details.");
    }
  };

  const uploadImage = async () => {
    try {
      if (!imageFile) return;

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
      setImageFile(null);
      setRecipe((prev) =>
        prev ? { ...prev, image: response.data.filePath } : prev
      );
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Error uploading new image.");
    }
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

  const handleBackToRecipe = async () => {
    await handleDetailSubmit();
    navigate(`/recipe-details/${id}`);
  };

  const resetIngredientModal = () => {
    setNewIngredient({ name: "", amount: "", unit: "" });
    setIsAddingIngredient(false);
  };

  if (!recipe) {
    return <div>Loading...</div>;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= characterLimit) {
      handleDetailEdit("name", value);
    }
  };

  const imageSrc = `http://localhost:3000${recipe.image}`;

  return (
    <div className="edit-recipe-box">
      <h2>In Bearbeitung: {recipe.name}</h2>
      <div>
        <label className="flex-label">
          Name:
          {isEditing.name ? (
            <input
              type="text"
              value={recipe.name}
              onChange={handleChange}
              onBlur={() => toggleEdit("name")}
            />
          ) : (
            <span onClick={() => toggleEdit("name")}>{recipe.name}</span>
          )}
        </label>
      </div>

      <div>
        <label>
          {isEditing.image ? (
            <div>
              <input type="file" accept="image/*" onChange={handleFileChange} />
              <button onClick={() => {
                setImageFile(null);
                toggleEdit("image");
              }
              }>Abbrechen</button>
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

      <div >
        <label className="flex-label">
          Anleitung:
          {isEditing.instructions ? (
            <textarea
              className="textarea-field"
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

      <div >
        <label className="flex-label">
          Kategorie:
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
        <label className="flex-label">
          Favorit:
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

      <button className="edit-recipe-buttons" onClick={handleDetailSubmit}>Änderungen anwenden</button>

      <div>
        <h3>Zutaten: </h3>
        <ul>
          {recipe.ingredients.map((ingredient) => (
            <li
              key={ingredient.id}
              onClick={() => handleIngredientClick(ingredient)}
              className="ingredient-item"
            >
              {isEditingIngredient &&
                editingIngredient?.id === ingredient.id ? (
                <div>
                  <input
                    type="text"
                    value={editingIngredient.amount}
                    onChange={(e) =>
                      setEditingIngredient({
                        ...editingIngredient,
                        amount: e.target.value,
                      })
                    }
                  />
                  <select
                    value={editingIngredient.unit}
                    onChange={(e) =>
                      setEditingIngredient({
                        ...editingIngredient,
                        unit: e.target.value,
                      })
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
                  <button className="edit-recipe-buttons" onClick={handleIngredientUpdate}>Update</button>

                </div>
              ) : (

                <span>
                  {ingredient.amount} {ingredient.unit} {ingredient.name}
                </span>
              )}
              <button className="delete-button-eimer" onClick={() => handleIngredientDelete(ingredient.id)}>
                <img src="../../assets/deleteIcon.png" width={50}></img>
              </button>
            </li>
          ))}
        </ul>
        <button className="edit-recipe-buttons" onClick={() => setIsAddingIngredient(true)}>
          Zutat hinzufügen
        </button>
      </div>

      {isAddingIngredient && (
        <div>
          <h3>Neue Zutat hinzufügen: </h3>
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
            Menge:
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
          <button className="edit-recipe-buttons" onClick={handleAddIngredient}>Hinzufügen</button>
          <button className="edit-recipe-buttons" onClick={resetIngredientModal}>Abbrechen</button>
        </div>
      )}
      <button onClick={handleBackToRecipe}>Zurück zum Rezept</button>
    </div>
  );
};

export default EditRecipe;
