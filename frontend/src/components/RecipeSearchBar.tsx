import React, { useState, useEffect, ChangeEvent, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Recipe {
  id: number;
  name: string;
  image: string;
  instructions: string;
  favorite: boolean;
  category: string;
}

const RecipeSearchBar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<Recipe[]>([]);
  const navigate = useNavigate();
  const searchContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (searchQuery.length > 0) {
      axios
        .get<{ recipes: Recipe[] }>(
          `http://localhost:3000/api/recipes/no-ingredients`
        )
        .then((res) => {
          const filteredResults = res.data.recipes
            .filter((recipe) =>
              recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .slice(0, 5);
          setSearchResults(filteredResults);
        })
        .catch((err) => {
          console.error(err);
          alert("Error fetching recipes.");
        });
    } else {
      setSearchResults([]); // Clear results if searchQuery is empty
    }
  }, [searchQuery]);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleResultClick = (id: number) => {
    navigate(`/recipe-details/${id}`);
    setSearchQuery(""); // Reset search bar
    setSearchResults([]); // Clear results
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      searchContainerRef.current &&
      !searchContainerRef.current.contains(event.target as Node)
    ) {
      setSearchQuery(""); // Reset search bar
      setSearchResults([]); // Clear results
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="search-bar" ref={searchContainerRef}>
      <div className="search-container">
        <input
          type="text"
          className={`search-input ${
            searchResults.length > 0 ? "has-results" : ""
          }`}
          placeholder="Search for recipes..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
        {searchResults.length > 0 && (
          <ul className="search-results">
            {searchResults.map((recipe) => (
              <li key={recipe.id} onClick={() => handleResultClick(recipe.id)}>
                {recipe.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default RecipeSearchBar;
