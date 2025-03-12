import React from "react";

const Impressum: React.FC = () => {
  return (
    <div className="non-scrollable-text-box">
      <h1>Impressum</h1>
      <div style={{ fontWeight: "bold" }}>
        <p>
          Willkommen auf Crümbli, Ihrem neuen digitalen Kochbuch! Wir haben eine
          ganz tolle Website entwickelt, die es Ihnen ermöglicht, Ihre
          kulinarischen Kreationen optimal zu organisieren. Egal, ob Sie ein
          leidenschaftlicher Hobbykoch oder einfach nur auf der Suche nach Ihrem
          nächsten Lieblingsgericht sind - bei uns sind Sie genau richtig.{" "}
        </p>
        <p>
          Unsere Mission ist es, das Kochen für alle zugänglich und
          unkompliziert zu gestalten. Wir glauben daran, dass das Teilen von
          Rezepten eine verbindende Kraft hat und freuen uns darauf, eine
          Gemeinschaft von Kochbegeisterten zu schaffen. Machen Sie bei uns mit
          und entdecken Sie neue Geschmäcker und kulinarische Erfahrungen.{" "}
        </p>
        <p>Viel Spaß beim Kochen und Entdecken!</p>
        <p>Marlen Koch & Amélie Hoffmann</p>
      </div>
      <br />
      <br />
      <div style={{ fontStyle: "italic" }}>
        <p>
          Für die Gestaltung und Illustration unserer Plattform haben wir Bilder
          verwendet, die mithilfe von Künstlicher Intelligenz generiert wurden.
        </p>
        <p>
          Crümbli ist ein nicht-kommerzielles Projekt, das im Rahmen unseres
          Studiums im Modul Webentwicklung entwickelt wurde. Alle Inhalte und
          Funktionen der Plattform dienen ausschließlich Bildungszwecken und der
          Demonstration von erlernten Fähigkeiten im Bereich der Webentwicklung.
          Eine kommerzielle Nutzung ist nicht vorgesehen und wird nicht
          unterstützt.
        </p>
      </div>
    </div>
  );
};

export default Impressum;
