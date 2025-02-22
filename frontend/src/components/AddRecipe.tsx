import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Ingredient {
  name: string;
  amount: string;
  unit: string;
  id?: number;
}

const AddRecipe: React.FC = () => {
  const [name, setName] = useState<string>("");
  //const [image, setImage] = useState<string>("");
  const [instructions, setInstructions] = useState<string>("");
  const [favorite, setFavorite] = useState<boolean>(false);
  const [category, setCategory] = useState<string>("Kochen");
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const navigate = useNavigate(); // Use navigate instead of history
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePath, setImagePath] = useState<string>("");

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: "", amount: "", unit: "" }]);
  };

  const handleIngredientChange = (
    index: number,
    field: keyof Ingredient,
    value: string
  ) => {
    const newIngredients = [...ingredients];
    if (field in newIngredients[index]) {
      // Ensure TypeScript understands these assignments are valid
      (newIngredients[index][field] as string) = value;
    }
    setIngredients(newIngredients);
  };

  const checkAndAddIngredient = async (name: string, index: number) => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/ingredients/id",
        {
          params: { name },
        }
      );

      if (response.data.ingredient_id) {
        const newIngredients = [...ingredients];
        newIngredients[index].id = response.data.ingredient_id;
        setIngredients(newIngredients);
        alert("Ingredient already exists.");
      }
    } catch (error) {
      if (
        axios.isAxiosError(error) &&
        (error.response?.status === 404 || error.response?.status === 400)
      ) {
        const shouldAdd = window.confirm(
          `Ingredient "${name}" does not exist. Add it?`
        );
        if (shouldAdd) {
          try {
            const addResponse = await axios.post(
              "http://localhost:3000/api/ingredients",
              { name }
            );
            const newIngredients = [...ingredients];
            newIngredients[index].id = addResponse.data.ingredient.id;
            setIngredients(newIngredients);
            alert("Ingredient added successfully.");
          } catch (addError) {
            console.error(addError);
            alert("Error adding ingredient.");
          }
        }
      } else {
        console.error(error);
        alert("Error checking ingredient.");
      }
    }
  };

  // const handleAddRecipe = () => {
  //   if (!name || !instructions) {
  //     return alert("Name and instructions are required!");
  //   }

  //   axios
  //     .post("http://localhost:3000/api/recipes", {
  //       name,
  //       image,
  //       instructions,
  //       favorite,
  //       category,
  //       ingredients: ingredients.map((ingredient) => ({
  //         ingredient_id: ingredient.id,
  //         amount: ingredient.amount,
  //         unit: ingredient.unit,
  //       })),
  //     })
  //     .then(() => {
  //       alert("Recipe added successfully!");
  //       navigate(`/`);
  //     })
  //     .catch((err) => {
  //       console.error(err);
  //       alert("Error adding recipe.");
  //     });
  // };
  const handleAddRecipe = () => {
    if (!name || !instructions) {
      return alert("Name and instructions are required!");
    }

    axios
      .post("http://localhost:3000/api/recipes", {
        name,
        image: imagePath, //<-- Updated here to use uploaded image path.
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
        alert("Recipe added successfully!");
        navigate(`/`);
      })
      .catch((err) => {
        console.error(err);
        alert("Error adding recipe.");
      });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleImageUpload = async () => {
    if (!imageFile) return;

    const formData = new FormData();
    formData.append("image", imageFile);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setImagePath(response.data.filePath);
      alert("Image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Error uploading image.");
    }
  };

  return (
    <div className="add-recipe-container">
      <h2>Add Recipe</h2>
      <div className="form-group">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input-field"
        />
      </div>
      <div className="form-group">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="input-file"
        />
        <button onClick={handleImageUpload} className="upload-button">
          Upload Image
        </button>
      </div>

      <div className="form-group">
        <textarea
          placeholder="Instructions"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          className="textarea-field"
        />
      </div>
      <div className="form-group-inline">
        <label>
          Favorite:
          <input
            type="checkbox"
            checked={favorite}
            onChange={(e) => setFavorite(e.target.checked)}
          />
        </label>
        <label>
          Category:
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
      <h3>Ingredients</h3>
      {ingredients.map((ingredient, index) => (
        <div className="ingredient-group" key={index}>
          <input
            type="text"
            placeholder="Ingredient Name"
            value={ingredient.name}
            onChange={(e) =>
              handleIngredientChange(index, "name", e.target.value)
            }
            onBlur={() => checkAndAddIngredient(ingredient.name, index)}
            className="input-field"
          />
          <input
            type="text"
            placeholder="Amount"
            value={ingredient.amount}
            onChange={(e) =>
              handleIngredientChange(index, "amount", e.target.value)
            }
            className="input-field"
          />
          <select
            onChange={(e) =>
              handleIngredientChange(index, "unit", e.target.value)
            }
            className="select-field"
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
        </div>
      ))}
      <button onClick={handleAddIngredient} className="action-button">
        Add Ingredient
      </button>
      <button onClick={handleAddRecipe} className="action-button">
        Add Recipe
      </button>
    </div>
  );
};

export default AddRecipe;
