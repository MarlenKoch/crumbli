import React from "react";
import { Link } from "react-router-dom";
//import RecipeCategoryPage from "./RecipeCategoryPage";
import RecipeSearchBar from "./RecipeSearchBar";
import RandomRecipes from "./RandomRecipes";

const Home: React.FC = () => {
  return (
    <div>
      <div>
        <p>CRÜMBLI</p>
        <RecipeSearchBar />
      </div>
      <div className="container">
        <RandomRecipes />
        <div>
          <div>
            <p>diese App ist toll</p>
            <p>hier kommt noch ein bild hin</p>
            <svg
              aria-hidden="true"
              role="img"
              width="256"
              height="256"
              preserveAspectRatio="xMidYMid meet"
              viewBox="0 0 256 256"
            >
              <defs>
                <radialGradient id="cookieGradient" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#e0ac69"></stop>
                  <stop offset="100%" stopColor="#d68b45"></stop>
                </radialGradient>
              </defs>
              <ellipse
                cx="128"
                cy="150"
                rx="110"
                ry="50"
                fill="rgba(0, 0, 0, 0.2)"
              />
              <path
                fill="url(#cookieGradient)"
                d="M 100,50
C 150,30 210,30 240,80
C 250,120 210,180 160,200
C 110,220 50,210 30,140
C 10,90 40,70 100,50 z"
              />
              <circle cx="80" cy="120" r="10" fill="#8b5e3c" />
              <circle cx="160" cy="130" r="8" fill="#8b5e3c" />
              <circle cx="140" cy="70" r="10" fill="#8b5e3c" />
              <circle cx="200" cy="110" r="7" fill="#8b5e3c" />
              <circle cx="100" cy="170" r="8" fill="#8b5e3c" />
              <circle cx="230" cy="160" r="6" fill="#8b5e3c" />
            </svg>
          </div>
          <div>
            <Link to="/recipes">
              <button>View All Recipes</button>
            </Link>
            <Link to="/add-recipe">
              <button>Add Recipe</button>
            </Link>
            <Link to="/favorites">
              <button>View Favorites</button>
            </Link>
            <Link to="/ingredients">
              <button>All Ingredients</button>
            </Link>
          </div>
        </div>
      </div>

      {/* <RecipeCategoryPage /> */}
    </div>
  );
};

export default Home;
