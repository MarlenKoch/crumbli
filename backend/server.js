const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Initialize database
const db = new sqlite3.Database(":memory:", (err) => {
  if (err) {
    console.error("Error opening database " + err.message);
  } else {
    console.log("Connected to the in-memory SQlite database.");

    db.serialize(() => {
      db.run(`CREATE TABLE recipes (
id INTEGER PRIMARY KEY AUTOINCREMENT,
name TEXT NOT NULL,
picture TEXT,
instruction TEXT
)`);

      db.run(`CREATE TABLE ingredients (
id INTEGER PRIMARY KEY AUTOINCREMENT,
name TEXT NOT NULL,
recipe_id INTEGER,
FOREIGN KEY (recipe_id) REFERENCES recipes(id)
)`);
    });
  }
});

// Add a recipe
app.post("/recipes", (req, res) => {
  const { name, picture, ingredients, instruction } = req.body;
  db.run(
    `INSERT INTO recipes (name, picture, instruction) VALUES (?, ?, ?)`,
    [name, picture, instruction],
    function (err) {
      if (err) {
        return res.status(400).json({ error: err.message });
      }

      const recipeId = this.lastID;

      // Insert ingredients if provided
      if (Array.isArray(ingredients) && ingredients.length > 0) {
        const insertIngredientQuery = `INSERT INTO ingredients (name, recipe_id) VALUES (?, ?)`;
        const stmt = db.prepare(insertIngredientQuery);

        for (const ingredient of ingredients) {
          stmt.run([ingredient.name, recipeId], (err) => {
            if (err) {
              return res.status(500).json({ error: err.message });
            }
          });
        }
        stmt.finalize();
      }

      res.json({ id: recipeId });
    }
  );
});

// Get all recipes
app.get("/recipes", (req, res) => {
  const query = `
SELECT recipes.id, recipes.name, recipes.picture, recipes.instruction, ingredients.id AS ingredientId,
ingredients.name AS ingredientName
FROM recipes
LEFT JOIN ingredients ON recipes.id = ingredients.recipe_id
ORDER BY recipes.id;
`;

  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: "Failed to fetch recipes" });
    }

    const recipesMap = {};

    rows.forEach((row) => {
      const { id, name, picture, instruction, ingredientId, ingredientName } =
        row;
      if (!recipesMap[id]) {
        recipesMap[id] = {
          id,
          name,
          picture,
          instruction,
          ingredients: [],
        };
      }
      if (ingredientId && ingredientName) {
        recipesMap[id].ingredients.push({
          id: ingredientId,
          name: ingredientName,
        });
      }
    });

    const recipes = Object.values(recipesMap);
    res.json({ data: recipes });
  });
});

// Add an ingredient
app.post("/ingredients", (req, res) => {
  const { name, recipe_id } = req.body;
  db.run(
    `INSERT INTO ingredients (name, recipe_id) VALUES (?, ?)`,
    [name, recipe_id],
    function (err) {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      res.json({ id: this.lastID });
    }
  );
});

// Get ingredients for a specific recipe
app.get("/ingredients/:recipeId", (req, res) => {
  const recipeId = req.params.recipeId;
  db.all(
    `SELECT * FROM ingredients WHERE recipe_id = ?`,
    [recipeId],
    (err, rows) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      res.json({ data: rows });
    }
  );
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
