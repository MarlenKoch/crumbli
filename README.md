# Crümbli - Rezeptmanager

Willkommen im GitHub-Repository von **Crümbli**, einem Rezeptmanagerprojekt, das im Rahmen der Vorlesung Webentwicklung an der Hochschule für Wirtschaft und Recht Berlin entwickelt wurde. Crübli kombiniert ein leistungsstarkes Express-basiertes JavaScript-Backend mit einer React-Frontend-Anwendung, die mithilfe von Vite und TypeScript entwickelt wurde. Die Daten werden in einer SQLite-Datenbank gespeichert.

## Ordnerstruktur

Das Projekt ist in zwei Hauptordner unterteilt:

- **backend**: Enthält die Dateien für das Backend.
- `server.js`: Hauptcode für das Backend.
- `uploads/`: Hier werden die Bilddateien gespeichert.
- `recipes.db`: SQLite-Datenbank mit den Rezeptinformationen.

- **frontend**: Enthält die Dateien für das Frontend und ist react-typisch strukturiert.
- `src/components/`: Enthält die Code-Dateien für die einzelnen Komponenten, aus denen die Seite besteht.
- `src/app.tsx`: Hauptanwendungscode.
- `src/app.css`: Hauptanwendungsstil.
- `assets/`: Enthält die Bilder, die im Frontend verwendet werden.

## Installation

Um Crübli auf Ihrem lokalen System zum Laufen zu bringen, folgen Sie bitte diesen Schritten:

1. **Repository klonen und Abhängigkeiten installieren**

```
npm install
```

Führen Sie diesen Befehl sowohl im `backend` als auch im `frontend` Ordner aus, um alle notwendigen Abhängigkeiten zu installieren.

2. **Backend starten**

Navigieren Sie in den `backend` Ordner und führen Sie den folgenden Befehl aus:

```
npm start
```

Damit wird der Server gestartet, der mit Express.js aufgebaut ist.

3. **Frontend starten**

Navigieren Sie in den `frontend` Ordner und führen Sie die folgenden Befehle aus:

```
npm run build
npm run dev
```

Damit wird die Entwicklungsversion des Frontends gestartet, die mit Vite und React aufgebaut ist.

## Nutzung

Nach erfolgreicher Installation und Start können Sie über Ihren Webbrowser auf die Anwendung zugreifen. Stellen Sie sicher, dass sowohl das Backend als auch das Frontend ordnungsgemäß laufen.


Viel Spaß beim Ausprobieren von Crümbli!
