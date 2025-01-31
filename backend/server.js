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

// Datenbankschema erstellen
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS recipes (
id INTEGER PRIMARY KEY AUTOINCREMENT,
name TEXT NOT NULL,
image TEXT,
instructions TEXT NOT NULL,
favorite BOOLEAN NOT NULL DEFAULT 0
)`);
});

// API-Route zum Abrufen aller Rezepte
app.get("/api/recipes", (req, res) => {
  db.all("SELECT * FROM recipes", [], (err, rows) => {
    if (err) {
      res.status(500).send({ error: err.message });
      return;
    }
    res.json({ recipes: rows });
  });
});

// API-Route zum Hinzufügen eines neuen Rezepts
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

// Startet den Server
app.listen(port, () => {
  console.log(`Server läuft auf http://localhost:${port}`);
});
