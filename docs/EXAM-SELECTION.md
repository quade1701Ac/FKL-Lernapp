# Ausgewogene schriftliche Simulation

Die bestehenden drei Bereiche und ihre Zuordnung bleiben erhalten. Innerhalb
jedes Bereichs werden die verfügbaren Plätze möglichst gleichmäßig auf dessen
Lernfelder verteilt. Restplätze wechseln zufällig zwischen den Lernfeldern.

| Bereich | Aufgaben | Freitext | MC | Rechnen | Reihenfolge |
|---|---:|---:|---:|---:|---:|
| Prozesse (LF 1, 2, 5, 6, 9, 11, 12) | 15 | 5 | 5 | 3 | 2 |
| Güterumschlag (LF 3, 4, 7, 8, 10) | 9 | 3 | 3 | 2 | 1 |
| WiSo (Feld 13) | 6 | 3 | 3 | 0 | 0 |

Diese Typquoten sind eine didaktische Entscheidung der Lernapp, keine amtliche
IHK-Vorgabe. Beim aktuellen Pool erhält jedes Prozesse-Lernfeld zwei oder drei
Aufgaben, jedes Güterumschlag-Lernfeld eine oder zwei. Die konkreten Fragen und
MC-Optionen werden weiterhin gemischt; bei gleich geeigneten Aufgaben werden
bislang weniger vertretene Themen bevorzugt.

Die Auswahl verwendet ein kleines Flussnetz, um Typ- und Lernfeldquoten
gleichzeitig zu erfüllen. Fehlt ein Typ, werden freie Plätze mit anderen
geprüften Aufgaben desselben Lernfelds gefüllt. Fehlen in einem Lernfeld Fragen,
werden Plätze auf andere Lernfelder desselben Bereichs verteilt. Reicht ein
Bereich insgesamt nicht aus, startet keine verkürzte Prüfung: Die Oberfläche
zeigt stattdessen eine verständliche Fehlermeldung. IDs werden nicht doppelt
verwendet; der Eingabepool wird nicht verändert.

Regressionstests prüfen 200 reproduzierbar zufällige Prüfungen mit dem echten
Rohpool auf 30 eindeutige Fragen, Bereichsgrößen, alle Typquoten, Lernfeldverteilung,
wechselnde Restplätze und korrekte MC-Antwortzuordnung. Weitere Tests decken
fehlende Typen, knappe Lernfelder und unvollständige Pools ab. Der bestehende
React-Sitzungstest durchläuft weiterhin eine komplette Prüfung ohne sofortiges
Feedback. Bewertung, Lernhistorie und Bestehenslogik bleiben unverändert.
