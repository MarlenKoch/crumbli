import React, { useState } from "react";
import axios from "axios";

const AddRecipe: React.FC = () => {
  const [name, setName] = useState("");
  const [picture, setPicture] = useState("");
  const [instruction, setInstruction] = useState(""); // State for instruction
  const [ingredients, setIngredients] = useState([{ name: "" }]);

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: "" }]);
  };

  const handleIngredientChange = (index: number, value: string) => {
    const newIngredients = ingredients.map((ingredient, i) =>
      i === index ? { ...ingredient, name: value } : ingredient
    );
    setIngredients(newIngredients);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3001/recipes", {
        name,
        picture,
        instruction, // Include instruction in the submission
        ingredients,
      });
      console.log(response.data);
      // Clear the form or give feedback to the user
      clearForm();
    } catch (error) {
      console.error("There was an error adding the recipe!", error);
    }
  };

  const clearForm = () => {
    setName("");
    setPicture("");
    setInstruction(""); // Reset instruction field
    setIngredients([{ name: "" }]); // Reset ingredients to initial state
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Recipe Name:
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </label>
      <label>
        Picture URL:
        <input
          type="text"
          value={picture}
          onChange={(e) => setPicture(e.target.value)}
        />
      </label>
      <label>
        Instructions:
        <textarea
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
          required
        />
      </label>
      <h3>Ingredients</h3>
      {ingredients.map((ingredient, index) => (
        <div key={index}>
          <input
            type="text"
            value={ingredient.name}
            onChange={(e) => handleIngredientChange(index, e.target.value)}
            required
          />
        </div>
      ))}
      <button type="button" onClick={handleAddIngredient}>
        Add Ingredient
      </button>
      <button type="submit">Add Recipe</button>
    </form>
  );
};

export default AddRecipe;
