import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams, useLocation, Link } from "react-router-dom";
import alienImage from "../../assets/alienNarrow.png";
import "./RecipeDetails.css";
import star from "../../assets/star.png";
import ConfirmationDialog from "./ConfirmationDialog";

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
  const [isDialogOpen, setDialogOpen] = useState(false);

  const handleDelete = () => {
    setDialogOpen(true);
  };

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

  const handleConfirm = () => {
    setDialogOpen(false);
    axios
      .delete(`http://localhost:3000/api/recipes/${id}`)
      .then(() => {
        alert("Rezept erfolgreich gelöscht.");
        navigate("/");
      })
      .catch((err) => {
        console.error(err);
        alert("Error deleting recipe.");
      });
  };

  const handleCancel = () => {
    setDialogOpen(false);
  };

  const handleEdit = () => {
    navigate(`/edit-recipe/${id}`);
  };

  const handleBack = () => {
    const queryParams = new URLSearchParams(location.search);
    const from = queryParams.get("from");
    if (from == "recipes") {
      navigate("/recipes");
    } else if (from) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  if (!recipe) {
    return <div>Loading...</div>;
  }

  const imageSrc = recipe.image
    ? `http://localhost:3000${recipe.image}`
    : alienImage;

  return (
    <div className="recipe-detail-box">
      <div className="star-icon">
        <h2 style={{ display: "inline-block", marginRight: "10px" }}>
          {recipe.name}
        </h2>
        {recipe.favorite && (
          <Link to="/favorites">
            <img
              src={star}
              alt="Favorit"
              style={{
                width: "50px",
                height: "50px",
                objectFit: "contain",
                verticalAlign: "middle",
              }}
            />
          </Link>
        )}
      </div>
      <img src={imageSrc} alt={recipe.name} className="recipe-image" />
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
      <p style={{ fontStyle: "italic" }}>Kategorie: {recipe.category}</p>
      <button onClick={handleEdit}>Rezept bearbeiten</button>
      <button onClick={handleDelete}>Rezept löschen</button>
      {isDialogOpen && (
        <ConfirmationDialog
          message="Möchtest du dieses wunderbare Rezept wirklich löschen?"
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
      <button onClick={handleBack}>zurück</button>
    </div>
  );
};

export default RecipeDetails;
