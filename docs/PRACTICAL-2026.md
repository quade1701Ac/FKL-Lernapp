# Praxisergänzung vom 3. Oktober 2026

## Verhalten

Die Startseite verwendet vor Lernfeld- und Themenfiltern denselben geprüften und normalisierten Pool wie die Auswahl. Dadurch stimmen die angezeigten Aufgabenanzahlen mit den auswählbaren Aufgaben überein. Aufgaben mit alten Themenaliasen bleiben in den passenden Themen erreichbar; IDs und gespeicherte Antworten bleiben erhalten.

48 zusätzliche Aufgaben: Warenannahme und Entladekontrolle, Wiegen und Messgeräte, Gefahrstoffe und Sicherheitsdatenblatt, Bestandsbuchungen und Lagerfachkarte, Regalbelastung und Schäden, alle fünf Sicherheitszeichenarten, Brandklassen und Feuerlöscher, tägliche Arbeitsmittelkontrollen, Tragfähigkeitsdiagramm, Anschlagmittel, Umreifung und Klammergerät. Kleine Ergänzungen behandeln 5S, A3, Audits, digitale Beschaffung und E-Commerce. Alle 48 bleiben nach den Laufzeitfiltern aktiv.

Prüfbarer Pool: 856 Aufgaben, einschließlich 48 WiSo-Aufgaben. Kein Anspruch auf vollständige Abdeckung jedes Unterthemas oder auf Kenntnis konkreter Prüfungsaufgaben.

Sicherheitszeichen: 90 Bilder (20 Gebote, 26 Verbote, 19 Warnungen, 10 Rettungszeichen, 6 Brandschutzzeichen, 9 GHS-Piktogramme). Bestehende Zeichen bleiben erhalten. Auswahl für das Lagertraining, kein vollständiger ISO-Katalog. Jede Gruppe kann separat gelernt werden; die Bildabfrage zieht bis zu zehn Zeichen aus der gewählten Gruppe. GHS-Symbole allein liefern keine vollständige Stoffklassifizierung. Bilder werden wie bisher über Wikimedia Commons geladen, mit einem sichtbaren Fehlerzustand bei fehlender Verbindung.

Praxiswelt: Drei ausfüllbare Lagerfachkarten mit neun Mengenfeldern je Fall. Die Angaben zu Datum und Beleg bleiben vorgegeben. Nutzer buchen Zu- und Abgänge in der geforderten Einheit und führen Bestände fort; Fälle enthalten Verpackungseinheiten und getrennten Sperrbestand. Bewertung: je ein Punkt für Zugang, Abgang und Bestand pro Zeile. Bei korrekt gebuchten Bewegungen wird ein bereits falscher vorheriger Bestand ohne erneuten Punktabzug weitergeführt. Korrekte Sollbestände werden immer angezeigt. Diese lokale Übung geht wie die Zeichenabfrage nicht in die Lernfeldstatistik ein.

## Quellen für die inhaltliche Prüfung

- BGHM, Sicherheitszeichen, Warn-/Gebots-/Verbots-/Rettungs-/Brandschutzzeichen und Gefahrstoffkennzeichnung: https://www.bghm.de/arbeitsschuetzer/praxishilfen/sicherheitszeichen
- DGUV Information 208-004, Gabelstapler, insbesondere tägliche Kontrollen, Tragfähigkeit und Ladebrücken: https://publikationen.dguv.de/widgets/pdf/download/article/310
- DGUV, Feuerlöscher und Brandklassen: https://aug.dguv.de/arbeitssicherheit/feuerloescher/
- DGUV Information 205-025, Feuerlöscher richtig einsetzen: https://publikationen.dguv.de/widgets/pdf/download/article/3110
- BAuA, Einstufung und Kennzeichnung von Gefahrstoffen: https://www.baua.de/DE/Themen/Chemikalien-Biostoffe/Gefahrstoffe/Einstufung-und-Kennzeichnung/Einstufung-und-Kennzeichnung
- BAuA, Sicherheitsdatenblatt und kommentierte Mustervorlage: https://www.baua.de/DE/Themen/Chemikalien-Biostoffe/Gefahrstoffe/Sicherheitsdatenblatt/Muster
- DGUV Information 209-019, Sicherheit bei der Blechbearbeitung, Gefahren von Umreifungsbändern: https://publikationen.dguv.de/regelwerk/dguv-informationen/357/sicherheit-bei-der-blechbearbeitung
- Lean Enterprise Institute, 5S: https://www.lean.org/lexicon-terms/five-s/
- Lean Enterprise Institute, A3: https://www.lean.org/lexicon-terms/a3-report/

Neue Szenarien und Zahlen sind eigene fiktive Übungsfälle. Herstellerangaben, betriebliche Anweisungen und Freigaben gelten bei der tatsächlichen Anwendung.

## Regression

Tests prüfen Erreichbarkeit aller neuen Aufgaben, Themenzuordnung und Poolstabilität, echte Lernfeldzähler und Themenwechsel über alle zwölf Lernfelder, Bildgruppen und vollständige Quizrunde, Fachkarten mit Sollwerten, leeren und ungültigen Eingaben sowie Übertragsfehlern. UI-Test öffnet die Fachkarte aus der Praxiswelt, trägt Werte ein, prüft das Ergebnis und wechselt ohne alte Einträge in einen neuen Fall. Bestehende Bewertungs-, Sitzungs- und Prüfungstests bleiben Teil der Prüfung.

# Ausbau der praktischen Übungen

- Neuer direkter Einstieg auf der Startseite: „Praktisches Training öffnen“. In der Praxiswelt ebenfalls als „Praktische Abläufe“ erreichbar.
- Vier Themenbereiche mit zusammen 42 bereits vorhandenen und geprüften Aufgaben: Warenannahme (8), Einlagern/Bestände (9), Arbeitsmittel (12), Sicherheit/Gefahrstoffe (13). Gemischte Runde mit 20 Aufgaben, einzelne Bereiche mit bis zu zehn, Freitext und Rechnen. Aufgaben unter 80 Prozent können nach der Runde separat wiederholt werden. Die Rundenergebnisse sind unabhängig von den bisherigen Lernfeldstatistiken.
- Zeichen: zusätzliche freie Bedeutungseingabe, vorhandene sinngemäße Antwortprüfung. Bild und Lösung werden niemals an neue externe Dienste gesendet; die vorhandene Bewertungs-API erhält die Lernfrage, Musterlösung und Eingabe wie beim bisherigen Freitexttraining.
- Form/Hintergrundfarbe: fünf Sicherheitszeichenarten, getrennte Punkte für beide Eigenschaften. Verbot hat weiße Grundfläche, roten Rand und Schrägbalken; die Sicherheitsfarbe Rot wird davon ausdrücklich unterschieden. Die Übersicht ist während der Abfrage verborgen.
- Unsichere Bildzeichen werden im Browser je Konto gespeichert und in Folgerunden zuerst ausgewählt. Eigene Runde enthält nur Zeichen mit letzter Bewertung unter 80 Prozent. Nach erfolgreicher Wiederholung werden sie daraus entfernt. Karten können manuell als „Noch unsicher“ oder „Gewusst“ markiert werden. Form-/Farbenfehler werden ebenfalls gespeichert und bei der nächsten Formrunde vorgezogen. Keine Cloud-Synchronisierung dieser neuen Zeichenmerkliste; Gerätehinweis sichtbar.
- Fehlendes Bild: überspringen ohne Bewertung. Ausfall der Freitextprüfung: Musterlösung und explizite Selbsteinschätzung, keine ungeprüfte automatische Keyword-Wertung. Späte Antworten nach Wechsel oder Verlassen werden ignoriert.
- Zusammenhängende Praxisaufgabe: drei fiktive Varianten (Schaden, Fehlmenge, Falschartikel), jeweils fünf Stationen mit sofortigem Feedback. Belegprüfung, freie Maßnahmenbeschreibung, Arbeitsmittel einschließlich Kontrollen, Fach-/Feldlast und Lagerplatz, Bestandsbuchung. Nach der Klärung wird für spätere Stationen ausdrücklich der korrekte Sachstand vorgegeben. Gesperrte oder fehlende Ware wird nicht als verfügbarer Bestand gebucht. Jeder Schritt zählt 20 Prozent der Runde; gefährliche Geräte- oder Platzentscheidungen bleiben als Sicherheitsfehler sichtbar, auch bei gutem Gesamtschnitt. Ergebnis ist Trainingsstand, kein Bestehensurteil einer offiziellen praktischen Prüfung.
- Fachkartenberechnung wird mit der bestehenden Methode einschließlich Übertragsfehlern geprüft. Vollständig richtige Endbestände der drei Fälle: 193, 86 und 156 Stück.

Zusätzliche Primärquelle für die Zeichenarten und Gestaltungsgrundsätze: DGUV Information 211-041, https://www.bghm.de/fileadmin/user_upload/Arbeitsschuetzer/Gesetze_Vorschriften/Informationen/211-041.pdf .

Ausbau-Tests: freie Bedeutung mit abweichender Formulierung, Persistenz und Kontentrennung, falsche/übersprungene Zeichen, Ausfall und verspätete Bewertung, alle fünf Form-/Farbenaufgaben, direkter Einstieg, gezielte Fragerunde und komplette Bearbeitung aller drei Praxisfälle. Zwei zusätzliche reale API-Releasechecks prüfen sinngemäßen Augenschutz und die falsche Umkehrung eines Rauchverbots.

Für die freie Zeichenbedeutung gilt ein festes Ein-Kriterium-Schema mit 100 Kernpunkten. Die KI prüft weiterhin sinngemäße Formulierungen; sie darf keine Form-/Farbkenntnisse oder Zusatzhandlungen verlangen. Dieser eng begrenzte Auftrag vermeidet die zusätzliche offene Abzugsprüfung. Die Livechecks verlangen ausdrücklich dieses Kriterium, damit die neue Serverversion nachgewiesen wird.
