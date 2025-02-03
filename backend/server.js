const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const app = express();
const port = 3000;

// Middleware, um JSON-Anfragen zu verarbeiten
app.use(express.json());
app.use(cors());

// SQLite-Datenbankverbindung
const db = new sqlite3.Database("./recipes.db");

// Datenbankschemata

db.serialize(() => {
  //Tabelle für Rezepte (Rezept ID, Name, Bild, Anleitung, Favorit?, Kochen oder Backen)
  db.run(`CREATE TABLE IF NOT EXISTS recipes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  image TEXT,
  instructions TEXT NOT NULL,
  favorite BOOLEAN NOT NULL DEFAULT 0,
  category TEXT CHECK (category IN ('Kochen', 'Backen')) NOT NULL
  );`);

  //Tabelle für Zutaten (Zutaten ID, Name)
  db.run(`CREATE TABLE IF NOT EXISTS ingredients (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL
  );`);

  //Tabelle Rezept-Zutaten (Rezept ID, Zutaten ID, Menge, Einheit)
  db.run(`CREATE TABLE IF NOT EXISTS recipe_ingredients (
  recipe_id INTEGER NOT NULL,
  ingredient_id INTEGER NOT NULL,
  amount TEXT NOT NULL,
  unit_id INTEGER,
  FOREIGN KEY(recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
  FOREIGN KEY(ingredient_id) REFERENCES ingredients(id)ON DELETE CASCADE,
  FOREIGN KEY(unit_id) REFERENCES units(id) ON DELETE SET NULL,
  PRIMARY KEY (recipe_id, ingredient_id)
  );`);

  //Tabelle für Einheiten (Einheiten ID, Name)
  db.run(`CREATE TABLE IF NOT EXISTS units (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL
  );`);

  //Tabelle für Zutaten-Einheiten (Zutaten ID, Einheiten ID)
  db.run(`CREATE TABLE IF NOT EXISTS ingredient_units (
  ingredient_id INTEGER NOT NULL,
  unit_id INTEGER NOT NULL,
  FOREIGN KEY(ingredient_id) REFERENCES ingredients(id),
  FOREIGN KEY(unit_id) REFERENCES units(id),
  PRIMARY KEY (ingredient_id, unit_id)
  );`);
});

// Abrufen aller Rezepte mit ihren Zutaten und Einheiten
app.get("/api/recipes", (req, res) => {
  db.all(
    `
  SELECT
  recipes.id AS recipeId, recipes.name, recipes.image, recipes.instructions, recipes.favorite, recipes.category,
  ingredients.id AS ingredientId, ingredients.name AS ingredientName,
  recipe_ingredients.amount,
  units.id AS unitId, units.name AS unitName
  FROM recipes
  JOIN recipe_ingredients ON recipes.id = recipe_ingredients.recipe_id
  JOIN ingredients ON recipe_ingredients.ingredient_id = ingredients.id
  LEFT JOIN units ON recipe_ingredients.unit_id = units.id
  ORDER BY recipes.id
  `,
    [],
    (err, rows) => {
      if (err) {
        res.status(500).send({ error: err.message });
        return;
      }
      // Gruppieren der Daten nach Rezepten
      const recipes = rows.reduce((acc, row) => {
        const {
          recipeId,
          name,
          image,
          instructions,
          favorite,
          category,
          ingredientId,
          ingredientName,
          amount,
          unitId,
          unitName,
        } = row;

        if (!acc[recipeId]) {
          acc[recipeId] = {
            id: recipeId,
            name,
            image,
            instructions,
            favorite: !!favorite,
            category,
            ingredients: [],
          };
        }

        if (ingredientId && ingredientName) {
          acc[recipeId].ingredients.push({
            id: ingredientId,
            name: ingredientName,
            amount,
            unit: unitId ? { id: unitId, name: unitName } : null,
          });
        }

        return acc;
      }, {});

      res.json({ recipes: Object.values(recipes) });
    }
  );
});

// Hinzufügen eines neuen Rezepts
app.post("/api/recipes", (req, res) => {
  const { name, image, instructions, favorite } = req.body;
  if (!name || !instructions) {
    res.status(400).send({ error: "Name und Anleitung sind erforderlich" });
    return;
  }

  db.run(
    "INSERT INTO recipes (name, image, instructions, favorite) VALUES (?, ?, ?, ?)",
    [name, image, instructions, favorite],
    function (err) {
      if (err) {
        res.status(500).send({ error: err.message });
        return;
      }
      res
        .status(201)
        .send({ id: this.lastID, name, image, instructions, favorite });
    }
  );
});

// Hinzufügen eines neuen Rezepts mit Zutaten und Einheiten
app.post("/api/recipes", (req, res) => {
  const { name, image, instructions, favorite, category, ingredients } =
    req.body;
  if (!name || !instructions || !ingredients || ingredients.length === 0) {
    res
      .status(400)
      .send({ error: "Name, Anleitung und Zutaten sind erforderlich" });
    return;
  }

  // Rezept in die Tabelle 'recipes' einfügen
  db.run(
    "INSERT INTO recipes (name, image, instructions, favorite, category) VALUES (?, ?, ?, ?, ?)",
    [name, image, instructions, favorite, category],
    function (err) {
      if (err) {
        res.status(500).send({ error: err.message });
        return;
      }
      const recipeId = this.lastID;

      // Zutaten in die Tabelle 'recipe_ingredients' einfügen
      const ingredientInserts = [];
      for (const ingredient of ingredients) {
        const { ingredient_id, amount, unit_id } = ingredient;
        ingredientInserts.push(
          new Promise((resolve, reject) => {
            db.run(
              "INSERT INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit_id) VALUES (?, ?, ?, ?)",
              [recipeId, ingredient_id, amount, unit_id],
              (err) => {
                if (err) {
                  reject(err);
                } else {
                  resolve();
                }
              }
            );
          })
        );
      }

      Promise.all(ingredientInserts)
        .then(() => {
          res
            .status(201)
            .send({ message: "Rezept mit Zutaten erfolgreich hinzugefügt" });
        })
        .catch((error) => {
          res.status(500).send({ error: error.message });
        });
    }
  );
});

// Abrufen aller favorisierten Rezepte mit ihren Zutaten und Einheiten
app.get("/api/recipes/favorites", (req, res) => {
  db.all(
    `
  SELECT
  recipes.id AS recipeId, recipes.name, recipes.image, recipes.instructions, recipes.favorite, recipes.category,
  ingredients.id AS ingredientId, ingredients.name AS ingredientName,
  recipe_ingredients.amount,
  units.id AS unitId, units.name AS unitName
  FROM recipes
  JOIN recipe_ingredients ON recipes.id = recipe_ingredients.recipe_id
  JOIN ingredients ON recipe_ingredients.ingredient_id = ingredients.id
  LEFT JOIN units ON recipe_ingredients.unit_id = units.id
  WHERE recipes.favorite = 1
  `,
    [],
    (err, rows) => {
      if (err) {
        res.status(500).send({ error: err.message });
        return;
      }
      // Gruppieren der Daten nach Rezepten
      const recipes = rows.reduce((acc, row) => {
        const {
          recipeId,
          name,
          image,
          instructions,
          favorite,
          category,
          ingredientId,
          ingredientName,
          amount,
          unitId,
          unitName,
        } = row;

        if (!acc[recipeId]) {
          acc[recipeId] = {
            id: recipeId,
            name,
            image,
            instructions,
            favorite: !!favorite,
            category,
            ingredients: [],
          };
        }

        if (ingredientId && ingredientName) {
          acc[recipeId].ingredients.push({
            id: ingredientId,
            name: ingredientName,
            amount,
            unit: unitId ? { id: unitId, name: unitName } : null,
          });
        }

        return acc;
      }, {});

      res.json({ recipes: Object.values(recipes) });
    }
  );
});

// Abrufen eines einzelnen Rezepts durch ID
app.get("/api/recipes/:id", (req, res) => {
  const id = req.params.id;
  db.get("SELECT * FROM recipes WHERE id = ?", [id], (err, row) => {
    if (err) {
      res.status(500).send({ error: err.message });
      return;
    }
    if (row) {
      res.json(row);
    } else {
      res.status(404).send({ error: "Rezept nicht gefunden" });
    }
  });
});

//Abrufen eines einzelnen Rezepts durch ID mit Zutaten und Einheiten
app.get("/api/recipes/:id", (req, res) => {
  const id = req.params.id;
  db.all(
    `
SELECT
recipes.id AS recipeId, recipes.name, recipes.image, recipes.instructions, recipes.favorite, recipes.category,
ingredients.id AS ingredientId, ingredients.name AS ingredientName,
recipe_ingredients.amount,
units.id AS unitId, units.name AS unitName
FROM recipes
JOIN recipe_ingredients ON recipes.id = recipe_ingredients.recipe_id
JOIN ingredients ON recipe_ingredients.ingredient_id = ingredients.id
LEFT JOIN units ON recipe_ingredients.unit_id = units.id
WHERE recipes.id = ?
`,
    [id],
    (err, rows) => {
      if (err) {
        res.status(500).send({ error: err.message });
        return;
      }
      if (rows.length === 0) {
        res.status(404).send({ error: "Rezept nicht gefunden" });
        return;
      }

      const structuredRecipe = {
        id: rows[0].recipeId,
        name: rows[0].name,
        image: rows[0].image,
        instructions: rows[0].instructions,
        favorite: !!rows[0].favorite,
        category: rows[0].category,
        ingredients: rows.map((row) => ({
          id: row.ingredientId,
          name: row.ingredientName,
          amount: row.amount,
          unit: row.unitId ? { id: row.unitId, name: row.unitName } : null,
        })),
      };

      res.json(structuredRecipe);
    }
  );
});

// Löschen eines Rezepts durch ID
app.delete("/api/recipes/:id", (req, res) => {
  const id = req.params.id;
  db.run("DELETE FROM recipes WHERE id = ?", [id], function (err) {
    if (err) {
      res.status(500).send({ error: err.message });
      return;
    }
    if (this.changes > 0) {
      res.status(200).send({ message: "Rezept gelöscht" });
    } else {
      res.status(404).send({ error: "Rezept nicht gefunden" });
    }
  });
});

// Abrufen aller Einheiten für eine spezifische Zutat
app.get("/api/ingredients/:ingredientId/units", (req, res) => {
  const ingredientId = req.params.ingredientId;
  db.all(
    `
  SELECT units.id, units.name FROM units
  JOIN ingredient_units ON units.id = ingredient_units.unit_id
  WHERE ingredient_units.ingredient_id = ?
  `,
    [ingredientId],
    (err, rows) => {
      if (err) {
        res.status(500).send({ error: err.message });
        return;
      }
      if (rows.length > 0) {
        res.json({ units: rows });
      } else {
        res
          .status(404)
          .send({ message: "Keine Einheiten für diese Zutat gefunden" });
      }
    }
  );
});

// Startet den Server
app.listen(port, () => {
  console.log(`Server läuft auf http://localhost:${port}`);
});
