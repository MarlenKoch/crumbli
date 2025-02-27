import React from "react";
import './FooterPages.css'


const UeberUns: React.FC = () => {
  return (
    <div className="scrollable-text-box" style={{ textAlign: "left" }} >
      <h1>Entwicklung einer Website mithilfe des Frameworks „React“</h1>
      <h2>Das Framework React</h2>
      <h3>Allgemeines</h3>
      <p>React ist eine im Jahr 2013 von Facebook entwickelte JavaScript Bibliothek und kann sowohl für die Entwicklung von Websites als auch Desktop- und mobilen Anwendungen verwendet werden. </p>
      <p>Eines der Hauptmerkmale von React ist die Verwendung von DOM (Document Object Model). Dies beschreibt die Darstellung von Websites als Baumstruktur. Dazu verfolgt React einen komponentenbasierten Ansatz. Das bedeutet, dass jedes Element eine Komponente darstellt. Dies erhöht die Wiederverwendbarkeit von Code und verringert Redundanz. Die einzelnen Komponenten können ineinander verschachtelt werden. Außerdem werden alle benutzerdefinierten Komponenten direkt oder indirekt der von React bereitgestellten App-Komponente untergeordnet. So entsteht eine Baumstruktur mit der App-Komponente als Startknoten.</p>
      <p>React JSX, beziehungsweise in unserem Fall TSX, ermöglicht zudem, HTML und Komponenten-Logik direkt in JavaScript-Code zu schreiben. Während der Entwicklung werden JSX-Code und das endgültige HTML-Dokument nicht miteinander gemischt. Stattdessen werden Änderungen zunächst in einem virtuellen DOM durchgeführt und anschließend effizient in das reale DOM übertragen.</p>
      <h3>Warum React?</h3>
      <p>Für React haben wir uns hauptsächlich entschieden, da wir bereits zuvor damit gearbeitet haben. Dadurch mussten wir keine zusätzliche Zeit in die Einarbeitung investieren und konnten uns bei der Umsetzung außerdem noch an einem anderen Projekt orientieren. </p>
      <p>Außerdem ist React eines der am weitesten verbreiteten Frameworks für Webentwicklung. In einer Umfrage von Statista aus dem Jahr 2024 gaben 39,5% der Befragten an, React als Web-Framework zu nutzen.  Diese weite Verbreitung sorgt dafür, dass es viele Quellen und Ressourcen gibt, was die Entwicklung ebenfalls vereinfacht. Für viele Probleme, die während der Arbeit mit React aufkommen können, findet man bereits Lösungen. </p>
      <br />
      <h2>Umsetzung des Rezeptverwaltungstools Crümbli</h2>
      <h3>Die Idee</h3>
      <p>Mit Crümbli wollen wir eine Website zur Verwaltung von Rezepten erstellen. Nutzer sollen in diesem digitalen Rezeptebuch eigene Rezepte sammeln und ordnen können. Die Möglichkeit, nach bestimmten Rezepten zu suchen und sich Favoriten zu markieren, bietet einen Vorteil gegenüber handgeschriebenen und ungeordneten Rezepte-Sammlungen. Das zufällige Vorschlagen von Rezepten soll zudem für zusätzliche Inspiration sorgen.</p>
      <h3>Implementierung und Arbeit mit dem Framework</h3>
      <h4>Vorgehensweise</h4>
      <p>Im Gegensatz zu unserem vorherigen Projekt, werden wir diesmal ohne Material-UI arbeiten. Das Frontend wurde Ausschließlich mit Hilfe von CSS gestylt.</p>
      <p>Um uns die Entwicklung etwas zu vereinfachen und das Fehlerpotential zu reduzieren haben wir TypeScript anstelle von JavaScript verwendet.
        Zur Erstellung des Backends haben wir das serverseitige Framework Express genutzt. Dieses basiert auf Node.js und ermöglicht das einfache und schnelle definieren von Endpoints
      </p>
      <p>Unsere Datenbank haben wir in SQLite erstellt. Wir haben die folgenden drei Tabellen: Eine für Rezepte, mit einer Rezept ID, einem Namen, einer URL zu einem Bild, einer Zubereitungsanleitung sowie aus einer Kategorie und einem Boolean, welcher besagt, ob das Rezept zu den Favoriten gehört. In der Tabelle für die Zutaten werden Zutaten ID sowie der Name gespeichert. In der Tabelle Rezept-Zutaten verbinden wir alle Informationen. Dort werden auch Menge und Einheit der Zutaten abgespeichert. </p>
      <p>Unser Backend stellt dem Frontend unterschiedliche Endpoints, beispielsweise zum Abrufen von Rezepten, Hinzufügen neuer Rezepte oder Zutaten und dem Löschen von Rezepten zur Verfügung. </p>
      <p>Entsprechen des komponentenbasierten Ansatzes von React haben wir den Code für unser Frontend in einzelne Komponenten unterteilt, welche dann in App.tsx gebündelt werden. </p>
      <h4>Probleme</h4>
      <p>Beim Setup des Projekts sind wir gleich auf das erste Problem gestoßen. Zunächst wollten wir das Setup mit „npx create-react-app crumbli --template typescript“ erstellen. Dies führte jedoch zu verschiedensten Fehlern, unter anderem “Module not found: Can't resolve 'web-vitals'”. Create React App (CRA), das Tool, mit welchem wir unser Setup erstellen wollten, wird bereits seit längerer Zeit nicht mehr aktiv weiterentwickelt und geupdated. Das führte auch zu dem „web-vitals“-Fehler. Stattdessen haben wir dann Vite für unser Setup benutzt, was ohne Probleme funktionierte. </p>


    </div>
  );
};

export default UeberUns;
