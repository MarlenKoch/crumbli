import React from "react";

const DataSafetyInformation: React.FC = () => {
  return (
    <div className="non-scrollable-text-box">
      <h1>Datenschutzhinweis</h1>
      <p>
        Unser Projekt Crümbli wird nur für Studienzwecke verwendet und ist nicht
        öffentlich zugänglich. Daher gibt es kein Risiko für die Daten unserer
        Nutzer:innen, da keine Drittparteien auf diese zugreifen können.
      </p>
      <p>
        Bitte beachten Sie, dass trotz all unserer Bemühungen zum Schutz Ihrer
        Daten keinerlei Schutzmaßnahmen gegen unvorhergesehene intergalaktische
        Ereignisse existieren. Sollten Aliens unerwartet mitten in der Nacht
        unser Projekt hacken, übernehmen wir dafür keine Haftung.
      </p>
      <p>
        Wir versichern, dass alle uns anvertrauten Daten vertraulich behandelt
        und nicht außerhalb des studentischen Projektkontexts genutzt werden.
      </p>
    </div>
  );
};

export default DataSafetyInformation;
