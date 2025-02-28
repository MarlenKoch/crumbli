import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams, useLocation, Link } from "react-router-dom";
import alienImage from '../../assets/alien.jpg';
import './RecipeDetails.css'
import star from '../../assets/star.png'


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
  const imageSrc = recipe.image ? `http://localhost:3000${recipe.image}` : alienImage;

  return (
    <div className="recipe-detail-box">
      <div className="star-icon">
        <h2 style={{ display: "inline-block", marginRight: "10px" }}>{recipe.name}</h2>
        {recipe.favorite && (
          <Link to="/favorites">
            <img
              src={star}
              alt="Favorit"
              style={{ width: "50px", height: "50px", objectFit: "contain", verticalAlign: 'middle' }}
            />
          </Link>
        )}
      </div>
      <img
        src={imageSrc}
        alt={recipe.name}
        className="recipe-image"
      />
      <p>
        <strong>Anleitung:</strong> {recipe.instructions}
      </p>

      <h3>Zutaten:</h3>
      <ul>
        {recipe.ingredients.map((ingredient) => (
          <li key={ingredient.id}>
            {ingredient.amount} {ingredient.unit} {ingredient.name}
          </li>
        ))}
      </ul>
      <p style={{ fontStyle: "italic" }}>
        Kategorie: {recipe.category}
      </p>
      <button onClick={handleEdit}>Rezept bearbeiten</button>
      <button onClick={handleDelete}>Rezept löschen</button>
      <button onClick={handleBack}>zurück</button>
    </div >
  );
}

export default RecipeDetails;
