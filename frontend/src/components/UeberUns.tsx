import React from "react";
import "./FooterPages.css";

const UeberUns: React.FC = () => {
  return (
    <div className="scrollable-text-box" style={{ textAlign: "left" }}>
      <h1>Entwicklung einer Website mithilfe des Frameworks „React“</h1>

      <h2>Das Framework React</h2>

      <h3>Allgemeines</h3>
      <p>
        React ist eine im Jahr 2013 von Facebook entwickelte JavaScript Bibliothek und kann sowohl für die Entwicklung von Websites als auch Desktop- und mobilen Anwendungen verwendet werden.
      </p>
      <p>
        Eines der Hauptmerkmale von React ist die Verwendung von DOM (Document Object Model). Dies beschreibt die Darstellung von Websites als Baumstruktur. Dazu verfolgt React einen komponentenbasierten Ansatz. Das bedeutet, dass jedes Element eine Komponente darstellt. Dies erhöht die Wiederverwendbarkeit von Code und verringert Redundanz. Die einzelnen Komponenten können ineinander verschachtelt werden, wodurch eine dynamische Website-Entwicklung ermöglicht wird. Außerdem werden alle benutzerdefinierten Komponenten direkt oder indirekt der von React bereitgestellten App-Komponente untergeordnet. So entsteht eine Baumstruktur mit der App-Komponente als Startknoten.
      </p>
      <p>
        React JSX, beziehungsweise in unserem Fall TSX, ermöglicht zudem, HTML und Komponenten-Logik direkt in JavaScript-Code zu schreiben. Während der Entwicklung werden JSX-Code und das endgültige HTML-Dokument nicht miteinander gemischt. Stattdessen werden Änderungen zunächst in einem virtuellen DOM durchgeführt und anschließend effizient in das reale DOM übertragen.
      </p>

      <h3>Warum React?</h3>
      <p>
        React wird zu der Entwicklung dieses Projektes verwendet, da die Entwickler bereits Erfahrung in der Arbeit mit diesem Framework haben. Dadurch muss keine zusätzliche Zeit in die Einarbeitung investiert werden.
      </p>
      <p>
        Zudem ist React eines der am weitesten verbreiteten Frameworks für Webentwicklung. In einer Umfrage von Statista aus dem Jahr 2024 gaben 39,5% der Befragten an, React als Web-Framework zu nutzen. Diese weite Verbreitung sorgt dafür, dass es viele Quellen und Ressourcen gibt, was die Entwicklung ebenfalls vereinfacht. Für viele Probleme, die während der Arbeit mit React aufkommen können, findet man bereits Lösungen.
      </p>

      <h2>Umsetzung des Rezeptverwaltungstools Crümbli</h2>

      <h3>Die Idee</h3>
      <p>
        Crümbli ist eine Website zu der Verwaltung von Rezepten. Die Nutzer können in diesem digitalen Rezeptebuch eigene Rezepte sammeln und ordnen. Die Möglichkeit, nach bestimmten Rezepten zu suchen und sich Favoriten zu markieren, bietet einen Vorteil gegenüber handgeschriebenen und ungeordneten Rezepte-Sammlungen. Das zufällige Vorschlagen von Rezepten sorgt zudem für zusätzliche Inspiration.
      </p>

      <h3>Implementierung und Arbeit mit dem Framework</h3>

      <h4>Vorgehensweise</h4>
      <p>
        Das Frontend wurde mit Hilfe von Vite aufgesetzt und ausschließlich mit Hilfe von CSS gestylt. Um die Entwicklung zu vereinfachen und das Fehlerpotential zu reduzieren, wird TypeScript anstelle von JavaScript verwendet.
      </p>
      <p>
        Zu der Erstellung des Backends wird das serverseitige Framework Express genutzt. Dieses basiert auf Node.js und ermöglicht das einfache und schnelle definieren von Endpoints.
      </p>
      <p>
        Unsere Datenbank ist in SQLite erstellt. Sie umfasst die folgenden drei Tabellen: Eine für Rezepte, mit einer Rezept ID, einem Namen, einer URL zu einem Bild, einer Zubereitungsanleitung sowie aus einer Kategorie und einem Boolean, welcher besagt, ob das Rezept zu den Favoriten gehört. In der Tabelle für die Zutaten werden Zutaten ID sowie der Name gespeichert. In der Tabelle Rezept-Zutaten werden alle Informationen verbunden. Dort werden auch Menge und Einheit der Zutaten abgespeichert.
      </p>
      <p>
        Das Backend stellt dem Frontend unterschiedliche Endpoints, beispielsweise zu dem Abrufen von Rezepten, Hinzufügen neuer Rezepte oder Zutaten und dem Löschen von Rezepten zur Verfügung.
      </p>
      <p>
        Entsprechen des komponentenbasierten Ansatzes von React ist der Code für das Frontend in einzelne Komponenten unterteilt, welche in App.tsx gebündelt werden.
      </p>

      <h4>Probleme</h4>
      <p>
        Bei dem Setup des Projekts sollte zunächst mit „npx create-react-app crumbli --template typescript“ erstellen werden. Dies führte jedoch zu verschiedensten Fehlern, unter anderem “Module not found: Can't resolve 'web-vitals'”. Create React App (CRA), das Tool, mit welchem das Setup erstellt werden sollte, wird bereits seit längerer Zeit nicht mehr aktiv weiterentwickelt und geupdated. Dies führt auch zu dem „web-vitals“-Fehler. Stattdessen wurde dann Vite für das Projekt-Setup genutzt. Dies funktionierte ohne Probleme.
      </p>
      <p>
        Während der Entwicklung des Rezeptverwaltungstools mit React sind keine gravierenden Probleme aufgetreten, die den Fortschritt wesentlich behindert hätten. Stattdessen war der Entwicklungsprozess von mehreren kleinen, klassischen Programmierfehlern geprägt.
      </p>
      <p>
        Diese konnten jedoch dank den umfassenden Informationen über React, welche im Internet zu finden sind, schnell behoben werden. Der komponentenbasierte Ansatz von React und die daraus resultierende Struktur des Projektes ermöglichte das schnelle Finden der entstandenen Fehler.
      </p>

      <h3>Abschließende Bewertung des Frameworks</h3>
      <p>
        Abschließend lässt sich sagen, dass die Vorerfahrung der Entwickler in der Arbeit mit React auch die Umsetzung dieses Projektes vereinfacht hat. Die Unterteilung in unterschiedliche Komponenten hat für Übersichtlichkeit gesorgt. Einige Elemente können so mehrfach verwendet werden. So beispielsweise das Popup, welches sowohl bei dem Löschen eines Rezeptes, als auch bei dem Hinzufügen einer neuen Zutat zu der Datenbank, den Nutzer um eine zusätzliche Bestätigung bittet. Auf diese Weise ermöglicht React die effizientere Gestaltung des Entwicklungsprozesses.
      </p>
      <p>
        Mangels Erfahrung mit anderen Frontend-Frameworks ist ein direkter Vergleich der Arbeit mit React nicht möglich. Die Bewertung basiert daher auf den spezifischen Vorteilen des Frameworks React und den Herausforderungen, welche bei der Entwicklung des Rezeptverwaltungstools Crümbli auftraten, ohne alternative Technologien in Betracht zu ziehen. Aufgrund der weiten Verbreitung ließen sich viele Probleme, welche bei der Entwicklung auftraten, beispielsweise das Problem bei dem Erstellen des Setups, relativ schnell lösen. Die Dokumentation und zahlreiche Community-Ressourcen erleichtern das Aneignen des notwendigen Wissens, um erfolgreich mit dem Framework React zu arbeiten.
      </p>
      <p>
        Die Arbeit mit React verlief insgesamt stabil und benutzerfreundlich, sodass die aufgetretenen Probleme sich relativ schnell lösen ließen. Überdies unterstützt die reaktive Architektur von React eine dynamische und interaktive Benutzeroberfläche, wodurch Nutzererlebnisse optimiert werden. Dabei erweist sich die Virtual DOM-Technologie als vorteilhaft für die Performanz des Tools, indem effiziente Updates und Rendering-Prozesse gewährleistet werden. Diese Eigenschaften unterstreichen die Effektivität von React in modernen Webanwendungen.
      </p>
    </div>
  );
};

export default UeberUns;
