# Lager unter Druck: Personal und Schichtplanung

Drei feste, wiederholbare Szenarien: normaler Betrieb (5 Vorgänge), Express-Spitze
(7), Wareneingangsprobleme (6). Zwei gleich qualifizierte Mitarbeitende können
unterschiedliche Vorgänge parallel bearbeiten. Zuweisung kostet keine Simulationszeit;
„1 Minute weiter“ führt beide Aufgaben fort. Zeiten sind didaktische Modellwerte.

Ankünfte und absolute Fristen sind angekündigt. Eine Bearbeitung wird erst bei
Ablauf ihrer Dauer wirksam. Ein Vorgang kann nur einer Person zugeordnet sein;
gebundene Personen erhalten keine zusätzliche Aufgabe. Vollendung genau zur
Frist ist rechtzeitig. Jede Überschreitung wird einmal protokolliert, mit aktueller
Bearbeitung oder fehlender Zuweisung. Offene Ankünfte verhindern vorzeitiges
reguläres Schichtende. Nach 40 Minuten bleiben unfertige Aufgaben offen.

Wertung: Termine 45 %, Qualität 30 %, Sicherheit 25 %, multipliziert mit dem
Anteil abgeschlossener Vorgänge am gesamten Szenario. Terminwert berücksichtigt
überfällige Vorgänge und negative Entscheidungsfolgen. Positive Folgeaktionen
löschen frühere Qualitäts-/Sicherheitsfehler nicht. Noch angekündigte Aufgaben
zählen bei vorzeitigem Abbruch als offen. Das vollständige Protokoll enthält
Start, Dauer, Abschluss, Befund, Fehler und Ankünfte.

Regression: Alle drei Szenarien sind mit zwei Personen durch fristorientierte,
sichere Bearbeitung bei 100 % abschließbar. Tests prüfen außerdem Doppelzuweisung,
Unveränderlichkeit des Ausgangszustands, gleichzeitige Fertigstellung, Ankunft,
Fristgrenzen, vorzeitiges Ende und den 40-Minuten-Abbruch. Ein React-Test durchläuft
Szenariowahl, Personalzuweisung, gemeinsame Zeitschritte, Auswertung und Neustart.
