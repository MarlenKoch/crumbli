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
  category TEXT NOT NULL
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
  unit TEXT NOT NULL,
  FOREIGN KEY(recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
  FOREIGN KEY(ingredient_id) REFERENCES ingredients(id)ON DELETE CASCADE,
  PRIMARY KEY (recipe_id, ingredient_id)
  );`);
});

// Abrufen aller Rezepte mit ihren Zutaten und Einheiten
app.get("/api/recipes", (req, res) => {
  db.all(
    `
  SELECT
  recipes.id AS recipeId, recipes.name, recipes.image, recipes.instructions, recipes.favorite, recipes.category,
  ingredients.id AS ingredientId, ingredients.name AS ingredientName,
  recipe_ingredients.amount, recipe_ingredients.unit
  FROM recipes
  JOIN recipe_ingredients ON recipes.id = recipe_ingredients.recipe_id
  JOIN ingredients ON recipe_ingredients.ingredient_id = ingredients.id
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
          unit,
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
            unit,
          });
        }

        return acc;
      }, {});

      res.json({ recipes: Object.values(recipes) });
    }
  );
});

//Abrufen aller Rezepte ohne alles
app.get("/api/recipes/no-ingredients", (req, res) => {
  db.all(
    `
  SELECT
  recipes.id AS recipeId, recipes.name, recipes.image, recipes.instructions, recipes.favorite, recipes.category
  FROM recipes
  `,
    [],
    (err, rows) => {
      if (err) {
        res.status(500).send({ error: err.message });
        return;
      }
      // Da keine Zutaten zu erwarten sind, brauchen wir keine Gruppierung
      const recipes = rows.map((row) => ({
        id: row.recipeId,
        name: row.name,
        image: row.image,
        instructions: row.instructions,
        favorite: !!row.favorite,
        category: row.category,
      }));

      res.json({ recipes });
    }
  );
});

// Hinzufügen eines neuen Rezepts mit Zutaten und Einheiten
app.post("/api/recipes", (req, res) => {
  const { name, image, instructions, favorite, category, ingredients } =
    req.body;
  if (!name || !instructions || !ingredients) {
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
        const { ingredient_id, amount, unit } = ingredient;
        ingredientInserts.push(
          new Promise((resolve, reject) => {
            db.run(
              "INSERT INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES (?, ?, ?, ?)",
              [recipeId, ingredient_id, amount, unit],
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

// Hinzufügen von Ingredients
app.post("/api/ingredients", (req, res) => {
  const { name } = req.body;

  // Validierung, ob der Name vorhanden ist
  if (!name) {
    res.status(400).send({ error: "Der Name der Zutat ist erforderlich" });
    return;
  }

  // Überprüfen, ob die Zutat bereits existiert
  db.get("SELECT id FROM ingredients WHERE name = ?", [name], (err, row) => {
    if (err) {
      res.status(500).send({ error: err.message });
      return;
    }

    if (row) {
      // Wenn die Zutat existiert, wird ein Fehler zurückgegeben
      res.status(400).send({ error: "Die Zutat existiert bereits" });
    } else {
      // Zutat in die Tabelle 'ingredients' einfügen
      db.run(
        "INSERT INTO ingredients (name) VALUES (?)",
        [name],
        function (err) {
          if (err) {
            res.status(500).send({ error: err.message });
            return;
          }

          // Erfolgsmeldung mit der ID der neu hinzugefügten Zutat
          res.status(201).send({
            message: "Zutat erfolgreich hinzugefügt",
            ingredient: { id: this.lastID, name },
          });
        }
      );
    }
  });
});

// Abrufen der ID einer Zutat basierend auf dem Zutatennamen
app.get("/api/ingredients/id", (req, res) => {
  const name = req.query.name;

  // Überprüfung, ob der Name als Abfrageparameter bereitgestellt wird
  if (!name) {
    res.status(400).send({ error: "Der Name der Zutat ist erforderlich" });
    return;
  }

  // Suche in der Tabelle 'ingredients' nach dem Namen
  db.get("SELECT id FROM ingredients WHERE name = ?", [name], (err, row) => {
    if (err) {
      res.status(500).send({ error: err.message });
      return;
    }

    // Prüfung, ob die Zutat gefunden wurde
    if (row) {
      res.status(200).send({ ingredient_id: row.id });
    } else {
      res.status(404).send({ error: "Zutat nicht gefunden" });
    }
  });
});

// Abrufen aller favorisierten Rezepte mit ihren Zutaten und Einheiten
app.get("/api/recipes/favorites", (req, res) => {
  db.all(
    `
  SELECT
  recipes.id AS recipeId, recipes.name, recipes.image, recipes.instructions, recipes.favorite, recipes.category,
  ingredients.id AS ingredientId, ingredients.name AS ingredientName,
  recipe_ingredients.amount, recipe_ingredients.unit
  FROM recipes
  JOIN recipe_ingredients ON recipes.id = recipe_ingredients.recipe_id
  JOIN ingredients ON recipe_ingredients.ingredient_id = ingredients.id
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
          unit,
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
            unit,
          });
        }

        return acc;
      }, {});

      res.json({ recipes: Object.values(recipes) });
    }
  );
});

// // Abrufen eines einzelnen Rezepts durch ID
// app.get("/api/recipes/:id", (req, res) => {
//   const id = req.params.id;
//   db.get("SELECT * FROM recipes WHERE id = ?", [id], (err, row) => {
//     if (err) {
//       res.status(500).send({ error: err.message });
//       return;
//     }
//     if (row) {
//       res.json(row);
//     } else {
//       res.status(404).send({ error: "Rezept nicht gefunden" });
//     }
//   });
// });

//Abrufen eines einzelnen Rezepts durch ID mit Zutaten und Einheiten
app.get("/api/recipes/:id", (req, res) => {
  const id = req.params.id;
  db.all(
    `
  SELECT
  recipes.id AS recipeId, recipes.name, recipes.image, recipes.instructions, recipes.favorite, recipes.category,
  ingredients.id AS ingredientId, ingredients.name AS ingredientName,
  recipe_ingredients.amount, recipe_ingredients.unit
  FROM recipes
  LEFT JOIN recipe_ingredients ON recipes.id = recipe_ingredients.recipe_id
  LEFT JOIN ingredients ON recipe_ingredients.ingredient_id = ingredients.id
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
        ingredients: rows
          .map((row) =>
            row.ingredientId
              ? {
                  id: row.ingredientId,
                  name: row.ingredientName,
                  amount: row.amount,
                  unit: row.unit,
                }
              : null
          )
          .filter(Boolean), // Filter out null entries if no ingredients are associated
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

//Update Recipe Details
app.put("/api/recipes/:id/details", async (req, res) => {
  const id = req.params.id;
  const { name, image, instructions, favorite, category } = req.body;

  try {
    await runAsync(
      `UPDATE recipes SET name = ?, image = ?, instructions = ?, favorite = ?, category = ? WHERE id = ?`,
      [name, image, instructions, favorite, category, id]
    );
    res.status(200).send({ message: "Recipe details updated successfully" });
  } catch (error) {
    console.error("Error updating recipe details: ", error);
    res.status(500).send({ error: error.message });
  }
});

//add ingrid
app.post("/api/recipes/:id/ingredient", async (req, res) => {
  const recipeId = req.params.id;
  const { ingredient_id, amount, unit } = req.body; // Single ingredient details

  if (!ingredient_id || !amount || !unit) {
    // Validate required fields
    res
      .status(400)
      .send({ error: "Ingredient ID, amount, and unit are required" });
    return;
  }

  try {
    // Execute a single query to insert the ingredient into the recipe
    await runAsync(
      "INSERT INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES (?, ?, ?, ?)",
      [recipeId, ingredient_id, amount, unit]
    );

    res.status(200).send({ message: "Ingredient added successfully" });
  } catch (error) {
    console.error("Error adding ingredient: ", error);
    res.status(500).send({ error: error.message });
  }
});

//delete ingrid :(
app.delete("/api/recipes/:id/ingredients", async (req, res) => {
  const id = req.params.id;
  const { ingredient_ids } = req.body; // List of ingredient IDs to remove

  const deletePromises = ingredient_ids.map((ingredient_id) =>
    runAsync(
      "DELETE FROM recipe_ingredients WHERE recipe_id = ? AND ingredient_id = ?",
      [id, ingredient_id]
    )
  );
  try {
    await Promise.all(deletePromises);
    res.status(200).send({ message: "Ingredients removed successfully" });
  } catch (error) {
    console.error("Error removing ingredients: ", error);
    res.status(500).send({ error: error.message });
  }
});

// Update the amount and unit of an ingredient in a recipe
app.put(
  "/api/recipes/:recipeId/ingredients/:ingredientId",
  async (req, res) => {
    const { recipeId, ingredientId } = req.params;
    const { amount, unit } = req.body;

    // Validation
    if (!amount || !unit) {
      return res.status(400).send({ error: "Amount and unit are required" });
    }

    try {
      await runAsync(
        `UPDATE recipe_ingredients SET amount = ?, unit = ? WHERE recipe_id = ? AND ingredient_id = ?`,
        [amount, unit, recipeId, ingredientId]
      );
      res.status(200).send({ message: "Ingredient updated successfully" });
    } catch (error) {
      console.error("Error updating ingredient: ", error);
      res.status(500).send({ error: error.message });
    }
  }
);

//all ingrids

app.get("/api/ingredients", (req, res) => {
  db.all(
    `
  SELECT id, name FROM ingredients
  `,
    [],
    (err, rows) => {
      if (err) {
        res.status(500).send({ error: err.message });
        return;
      }

      // Map the rows to a more structured response if needed
      const ingredients = rows.map((row) => ({
        id: row.id,
        name: row.name,
      }));

      res.json({ ingredients });
    }
  );
});

// Löschen einer Zutat durch ID
app.delete("/api/ingredients/:id", (req, res) => {
  const id = req.params.id;

  db.run("DELETE FROM ingredients WHERE id = ?", [id], function (err) {
    if (err) {
      res.status(500).send({ error: err.message });
      return;
    }
    if (this.changes > 0) {
      res.status(200).send({ message: "Zutat erfolgreich gelöscht" });
    } else {
      res.status(404).send({ error: "Zutat nicht gefunden" });
    }
  });
});

// Helper function to run db command with a promise
function runAsync(query, params = []) {
  return new Promise((resolve, reject) => {
    db.run(query, params, function (err) {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
}

// Update an ingredient's name
app.put("/api/ingredients/:id", (req, res) => {
  const id = req.params.id;
  const { name } = req.body;

  // Validation
  if (!name) {
    res.status(400).send({ error: "Der Name der Zutat ist erforderlich" });
    return;
  }

  // Update the ingredient's name
  db.run(
    "UPDATE ingredients SET name = ? WHERE id = ?",
    [name, id],
    function (err) {
      if (err) {
        res.status(500).send({ error: err.message });
        return;
      }

      if (this.changes > 0) {
        res.status(200).send({ message: "Zutat erfolgreich aktualisiert" });
      } else {
        res.status(404).send({ error: "Zutat nicht gefunden" });
      }
    }
  );
});

// Abrufen aller Rezepte einer Kategorie
app.get("/api/recipes/category/:category", (req, res) => {
  const category = req.params.category;

  db.all(
    `
  SELECT
  recipes.id AS recipeId, recipes.name, recipes.image, recipes.instructions, recipes.favorite, recipes.category,
  ingredients.id AS ingredientId, ingredients.name AS ingredientName,
  recipe_ingredients.amount, recipe_ingredients.unit
  FROM recipes
  JOIN recipe_ingredients ON recipes.id = recipe_ingredients.recipe_id
  JOIN ingredients ON recipe_ingredients.ingredient_id = ingredients.id
  WHERE recipes.category = ?
  ORDER BY recipes.id
  `,
    [category],
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
          unit,
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
            unit,
          });
        }

        return acc;
      }, {});

      res.json({ recipes: Object.values(recipes) });
    }
  );
});

///////////////////
//////////////////
///Everything for picture upload
////////////////
///////////////

const multer = require("multer");
const path = require("path");

// Set up storage configuration
const storage = multer.diskStorage({
  destination: "uploads/", // Folder to save the images
  filename: (req, file, cb) => {
    // Generate a unique filename using the current timestamp
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Set up middleware
const upload = multer({ storage });

// Endpoint to upload image
app.post("/api/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  // Send back the file path
  res.json({ filePath: `/uploads/${req.file.filename}` });
});

// Serve static files from the "uploads" directory
app.use("/uploads", express.static("uploads"));

// Startet den Server
app.listen(port, () => {
  console.log(`Server läuft auf http://localhost:${port}`);
});
