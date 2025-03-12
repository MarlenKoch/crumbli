import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AddRecipe.css";

interface Ingredient {
  name: string;
  amount: string;
  unit: string;
  id?: number;
}

const AddRecipe: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [instructions, setInstructions] = useState<string>("");
  const [favorite, setFavorite] = useState<boolean>(false);
  const [category, setCategory] = useState<string>("Kochen");
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [newIngredient, setNewIngredient] = useState<Ingredient>({
    name: "",
    amount: "",
    //als Standardwert TL, da es die Standardeingabe beim Hinzufügen einer Zutat ist:
    unit: "TL",
  });
  const [showIngredientModal, setShowIngredientModal] =
    useState<boolean>(false);
  const navigate = useNavigate();
  const [imagePath, setImagePath] = useState<string>("");
  const characterLimit = 77;

  const handleAddIngredient = () => {
    setShowIngredientModal(true);
  };

  const handleNewIngredientChange = (
    field: keyof Ingredient,
    value: string
  ) => {
    setNewIngredient({ ...newIngredient, [field]: value });
  };

  const addNewIngredientToList = () => {
    setIngredients([...ingredients, { ...newIngredient }]);
    setNewIngredient({ name: "", amount: "", unit: "TL" });
    setShowIngredientModal(false);
  };

  const handleCheckAndSubmitRecipe = async () => {
    if (!name || !instructions) {
      return toast.error("Bitte Name und Anleitung angeben!");
    }

    for (let i = 0; i < ingredients.length; i++) {
      const ingredient = ingredients[i];
      if (!ingredient.id) {
        try {
          const response = await axios.get(
            "http://localhost:3000/api/ingredients/id",
            { params: { name: ingredient.name } }
          );

          ingredient.id = response.data.ingredient_id;
        } catch (error) {
          // wenn die Zutat in der Datenbank noch nicht existiert, kann man sie hinzufügen
          if (
            axios.isAxiosError(error) &&
            (error.response?.status === 404 || error.response?.status === 400)
          ) {
            const shouldAdd = window.confirm(
              `Ingredient "${ingredient.name}" does not exist. Add it?`
            );
            if (shouldAdd) {
              try {
                const addResponse = await axios.post(
                  "http://localhost:3000/api/ingredients",
                  { name: ingredient.name }
                );
                ingredient.id = addResponse.data.ingredient.id;
              } catch (addError) {
                console.error(addError);
                return toast.error("Fehler beim Hinzufügen der Zutat");
              }
            } else {
              return;
            }
          } else {
            console.error(error);
            return toast.error("Unerwarteter Fehler :(");
          }
        }
      }
    }

    submitRecipe();
  };

  const submitRecipe = () => {
    axios
      .post("http://localhost:3000/api/recipes", {
        name,
        image: imagePath,
        instructions,
        favorite,
        category,
        ingredients: ingredients.map((ingredient) => ({
          ingredient_id: ingredient.id,
          amount: ingredient.amount,
          unit: ingredient.unit,
        })),
      })
      .then(() => {
        toast.success("Recipe added successfully!");
        navigate(`/`);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Error adding recipe.");
      });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFile = e.target.files[0];

      const formData = new FormData();
      formData.append("image", selectedFile);

      try {
        const response = await axios.post(
          "http://localhost:3000/api/upload",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        setImagePath(response.data.filePath);
        toast.success("Image uploaded successfully!");
      } catch (error) {
        console.error("Error uploading image:", error);
        toast.error("Error uploading image.");
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= characterLimit) {
      setName(value);
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  return (
    <>
      <div className="add-recipe-container">
        <h2>Rezept hinzufügen</h2>
        <div className="form-group">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={handleChange}
            className="input-field"
          />
        </div>
        <div className="form-group">
          <label className="custom-file-upload">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="input-file"
            />
            Bild hochladen
          </label>
        </div>
        <div className="form-group">
          <textarea
            placeholder="Anleitung"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            className="textarea-field"
          />
        </div>
        <div className="form-group-inline">
          <label>
            Favorit:
            <input
              type="checkbox"
              checked={favorite}
              onChange={(e) => setFavorite(e.target.checked)}
            />
          </label>
          <label>
            Kategorie:
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="select-field"
            >
              <option value="Kochen">Kochen</option>
              <option value="Backen">Backen</option>
            </select>
          </label>
        </div>
        <h3>Zutaten</h3>
        <div>
          {ingredients.map((ingredient, index) => (
            <div className="ingredient-group" key={index}>
              {ingredient.name} - {ingredient.amount} {ingredient.unit}
            </div>
          ))}
        </div>

        {showIngredientModal && (
          <div className="ingredient-modal">
            <h4>Zutat hinzufügen</h4>
            <label>
              Name:
              <input
                type="text"
                value={newIngredient.name}
                onChange={(e) =>
                  handleNewIngredientChange("name", e.target.value)
                }
              />
            </label>
            <label>
              Menge:
              <input
                type="text"
                value={newIngredient.amount}
                onChange={(e) =>
                  handleNewIngredientChange("amount", e.target.value)
                }
              />
            </label>
            <label>
              Einheit:
              <select
                value={newIngredient.unit}
                onChange={(e) =>
                  handleNewIngredientChange("unit", e.target.value)
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
            </label>
            <button onClick={addNewIngredientToList}>Bestätigen</button>
            <button onClick={() => setShowIngredientModal(false)}>
              Abbrechen
            </button>
          </div>
        )}
        <button onClick={handleAddIngredient} className="action-button">
          Zutat hinzufügen
        </button>
        <button onClick={handleCheckAndSubmitRecipe} className="action-button">
          Rezept hinzufügen
        </button>
        <button onClick={handleCancel} className="action-button">
          Abbrechen
        </button>
      </div>

      <ToastContainer position="top-right" autoClose={5000} />
    </>
  );
};

export default AddRecipe;
