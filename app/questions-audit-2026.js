// Curriculum additions from the September 2026 review; see docs/AUDIT-2026.md.
export const auditQuestions = [
  {
    "id": "audit26-1-01",
    "field": 1,
    "topic": "Mängel",
    "difficulty": 3,
    "type": "free",
    "question": "Ein verdeckter Transportschaden unterliegt deutschem Frachtrecht (§ 438 HGB). Innerhalb welcher Frist ist er dem Frachtführer anzuzeigen, um die gesetzliche Vermutung ordnungsgemäßer Ablieferung zu vermeiden?",
    "solution": "Bei äußerlich nicht erkennbaren Schäden beträgt die Anzeigefrist sieben Tage nach Ablieferung. Die Anzeige nach Ablieferung erfolgt in Textform. Die kaufrechtliche Rüge gegenüber dem Verkäufer ist davon zu unterscheiden.",
    "keywords": [
      "sieben",
      "7",
      "Tage",
      "Textform",
      "Frachtführer"
    ],
    "minHits": 1
  },
  {
    "id": "audit26-1-02",
    "field": 1,
    "topic": "Mängel",
    "difficulty": 3,
    "type": "free",
    "question": "Welche regelmäßige Verjährungsfrist gilt nach § 438 BGB für Mängelansprüche bei neu gelieferten beweglichen Sachen, wenn kein Sonderfall oder abweichende wirksame Vereinbarung vorliegt? Womit beginnt sie?",
    "solution": "Grundsätzlich zwei Jahre ab Ablieferung. Das ist keine Frist, innerhalb der ein Kaufmann einen erkannten Mangel beliebig spät rügen darf; § 377 HGB ist zusätzlich zu beachten.",
    "keywords": [
      "zwei",
      "Jahre",
      "Ablieferung",
      "Rüge"
    ],
    "minHits": 1
  },
  {
    "id": "audit26-1-03",
    "field": 1,
    "topic": "Warenannahme",
    "difficulty": 3,
    "type": "free",
    "question": "Eine Lieferung ist verbindlich für den 10. Oktober vereinbart und bleibt aus. Der Lieferant hat die Verzögerung zu vertreten. Ist für den Verzug grundsätzlich noch eine Mahnung nötig?",
    "solution": "Bei einem kalendermäßig bestimmten Leistungstermin ist eine Mahnung nach § 286 Absatz 2 BGB grundsätzlich entbehrlich. Fälligkeit und die weiteren Verzugsvoraussetzungen sind zu prüfen.",
    "keywords": [
      "Kalender",
      "Termin",
      "Mahnung",
      "entbehrlich",
      "Verzug"
    ],
    "minHits": 1
  },
  {
    "id": "audit26-1-04",
    "field": 1,
    "topic": "Warenannahme",
    "difficulty": 3,
    "type": "number",
    "question": "Für 15 nicht stapelbare Paletten sind jeweils 1,20 m × 0,80 m reine Stellfläche nötig. Wie viel Stellfläche wird ohne Verkehrs- und Sicherheitsflächen benötigt?",
    "solution": "15 × 1,20 × 0,80 = 14,4 m². Verkehrs- und Sicherheitsflächen kommen bei der realen Planung hinzu.",
    "answer": 14.4,
    "tolerance": 0.01
  },
  {
    "id": "audit26-2-01",
    "field": 2,
    "topic": "Lagerarten",
    "difficulty": 3,
    "type": "free",
    "question": "Welche Hauptpflichten haben Lagerhalter und Einlagerer aus einem Lagervertrag nach § 467 HGB?",
    "solution": "Der Lagerhalter übernimmt Lagerung und Aufbewahrung des Gutes. Der Einlagerer schuldet die vereinbarte Vergütung.",
    "keywords": [
      "Lagerung",
      "Aufbewahrung",
      "Vergütung"
    ],
    "minHits": 1
  },
  {
    "id": "audit26-2-02",
    "field": 2,
    "topic": "Lagerarten",
    "difficulty": 3,
    "type": "number",
    "question": "Eine gleichmäßig belastete Stapelfläche von 2 m² trägt insgesamt 1.200 kg. Berechne die mittlere Flächenbelastung in kg/m²; Punktlasten bleiben in diesem Rechenmodell unberücksichtigt.",
    "solution": "1.200 kg ÷ 2 m² = 600 kg/m². Für die tatsächliche Freigabe sind zusätzlich Boden- und Punktlastgrenzen maßgeblich.",
    "answer": 600,
    "tolerance": 0
  },
  {
    "id": "audit26-2-03",
    "field": 2,
    "topic": "Lagerarten",
    "difficulty": 3,
    "type": "number",
    "question": "Ein quaderförmiger Lagerbereich misst 8 m × 5 m × 3 m nutzbare Höhe. Wie groß ist sein rechnerisches Volumen?",
    "solution": "8 × 5 × 3 = 120 m³.",
    "answer": 120,
    "tolerance": 0
  },
  {
    "id": "audit26-2-04",
    "field": 2,
    "topic": "Lagerarten",
    "difficulty": 3,
    "type": "free",
    "question": "Ein Lager verursacht Lärm an seiner Grundstücksgrenze. Unterscheide Emission und Immission anhand dieses Beispiels.",
    "solution": "Emission bezeichnet den vom Lager ausgehenden Lärm; Immission die Einwirkung des Lärms am betroffenen Ort, etwa bei den Nachbarn.",
    "keywords": [
      "ausgehend",
      "Einwirkung",
      "Lärm",
      "Nachbarn"
    ],
    "minHits": 1
  },
  {
    "id": "audit26-3-01",
    "field": 3,
    "topic": "Mehrwertleistungen",
    "difficulty": 3,
    "type": "free",
    "question": "Metallteile lagern in einem feuchten Raum. Welche Pflegemaßnahme verhindert Korrosion, und was muss vorher geprüft werden?",
    "solution": "Geeignete trockene Lagerbedingungen oder freigegebener Korrosionsschutz können helfen. Vorher sind Werkstoff, Herstellervorgaben und Verträglichkeit der Schutzmaßnahme zu prüfen.",
    "keywords": [
      "trocken",
      "Korrosion",
      "Schutz",
      "Hersteller"
    ],
    "minHits": 1
  },
  {
    "id": "audit26-3-02",
    "field": 3,
    "topic": "Mehrwertleistungen",
    "difficulty": 3,
    "type": "number",
    "question": "Bei einer Kontrollwägung wiegen Ware und Behälter zusammen 86,4 kg. Das leere Behältnis wiegt 6,8 kg. Wie groß ist die Nettomasse?",
    "solution": "Netto = Brutto − Tara = 86,4 − 6,8 = 79,6 kg.",
    "answer": 79.6,
    "tolerance": 0.01
  },
  {
    "id": "audit26-3-03",
    "field": 3,
    "topic": "Mehrwertleistungen",
    "difficulty": 3,
    "type": "free",
    "question": "Ein Lager führt eine permanente Inventur durch. Warum genügt die laufende Bestandsbuchung allein nicht?",
    "solution": "Die fortgeschriebenen Bestände müssen durch ordnungsgemäße körperliche Bestandsaufnahmen kontrolliert werden; jeder Bestand ist grundsätzlich mindestens einmal im Geschäftsjahr zu erfassen. Differenzen sind zu klären und zu dokumentieren.",
    "keywords": [
      "körperlich",
      "jährlich",
      "Bestandsaufnahme",
      "Differenzen"
    ],
    "minHits": 1
  },
  {
    "id": "audit26-3-04",
    "field": 3,
    "topic": "Mehrwertleistungen",
    "difficulty": 3,
    "type": "number",
    "question": "Der verfügbare Bestand beträgt 630 Stück, der gleichmäßige Verbrauch 45 Stück pro Arbeitstag. Wie viele Arbeitstage reicht der Bestand ohne Zugang?",
    "solution": "Lagerreichweite = 630 ÷ 45 = 14 Arbeitstage.",
    "answer": 14,
    "tolerance": 0
  },
  {
    "id": "audit26-4-01",
    "field": 4,
    "topic": "Sicherheit",
    "difficulty": 3,
    "type": "free",
    "question": "Ein beladener Stapler soll eine Steigung hinauffahren, die Last versperrt aber die Sicht. Darf die Last zur Verbesserung der Sicht talseitig geführt werden?",
    "solution": "Nein. Die Last muss bergseitig bleiben. Die versperrte Sicht ist durch einen geeigneten Einweiser auszugleichen; Fahrweg und Einsatz müssen sicher sein.",
    "keywords": [
      "bergseitig",
      "Einweiser",
      "Sicht"
    ],
    "minHits": 1
  },
  {
    "id": "audit26-4-02",
    "field": 4,
    "topic": "Sicherheit",
    "difficulty": 3,
    "type": "free",
    "question": "Nach einem Unfall liegt eine Person im Staplerfahrweg. Welche ersten Maßnahmen sind unter Beachtung des Eigenschutzes erforderlich?",
    "solution": "Verkehr stoppen und Unfallstelle sichern, Hilfe und Notruf veranlassen sowie Erste Hilfe im Rahmen der eigenen Kenntnisse leisten. Weitere Personen können Rettungskräfte einweisen.",
    "keywords": [
      "sichern",
      "Eigenschutz",
      "Notruf",
      "Erste Hilfe"
    ],
    "minHits": 1
  },
  {
    "id": "audit26-4-03",
    "field": 4,
    "topic": "Fördermittel",
    "difficulty": 3,
    "type": "mc",
    "question": "Welches Beispiel beschreibt ein flurfreies Fördersystem?",
    "solution": "Eine Hängebahn transportiert oberhalb des Bodens.",
    "options": [
      "Eine an der Decke geführte Hängebahn",
      "Ein bodengeführter fahrerloser Transportwagen",
      "Ein Handhubwagen",
      "Ein bodenfahrender Gegengewichtsstapler"
    ],
    "correct": [
      0
    ]
  },
  {
    "id": "audit26-5-01",
    "field": 5,
    "topic": "Kommissionierverfahren",
    "difficulty": 3,
    "type": "number",
    "question": "Ein Auftrag benötigt 2 Minuten Basiszeit, 6 Minuten Wegzeit, 3 Minuten Greifzeit und 1 Minute Totzeit. Wie lang ist die gesamte Kommissionierzeit?",
    "solution": "2 + 6 + 3 + 1 = 12 Minuten.",
    "answer": 12,
    "tolerance": 0
  },
  {
    "id": "audit26-5-02",
    "field": 5,
    "topic": "Kommissionierverfahren",
    "difficulty": 3,
    "type": "free",
    "question": "Was unterscheidet eindimensionale von zweidimensionaler Fortbewegung beim Kommissionieren?",
    "solution": "Eindimensional erfolgt die Fortbewegung auf einer Ebene; zweidimensional bewegt sich die kommissionierende Person zusätzlich vertikal, um unterschiedliche Entnahmehöhen zu erreichen.",
    "keywords": [
      "Ebene",
      "horizontal",
      "vertikal",
      "Höhe"
    ],
    "minHits": 1
  },
  {
    "id": "audit26-5-03",
    "field": 5,
    "topic": "Kommissionierverfahren",
    "difficulty": 3,
    "type": "free",
    "question": "Unterscheide manuelle, mechanisch unterstützte und automatische Entnahme am Lagerplatz.",
    "solution": "Manuell entnimmt die Person das Gut selbst. Mechanische Hilfen unterstützen die Entnahme, etwa ein Hebegerät. Bei automatischer Entnahme übernimmt eine Anlage, beispielsweise ein Roboter, den Zugriff.",
    "keywords": [
      "Person",
      "Hebegerät",
      "Roboter",
      "automatisch"
    ],
    "minHits": 1
  },
  {
    "id": "audit26-6-01",
    "field": 6,
    "topic": "Packmittel",
    "difficulty": 3,
    "type": "number",
    "question": "Für ein Paket werden 1,20 € Karton, 0,35 € Polster und 0,15 € Verschlussmaterial benötigt. Verpackungsarbeit dauert 3 Minuten bei 24 € pro Stunde. Wie hoch sind die Verpackungskosten ohne weitere Zuschläge?",
    "solution": "Material: 1,70 €. Arbeit: 3/60 × 24 = 1,20 €. Gesamt: 2,90 €.",
    "answer": 2.9,
    "tolerance": 0.01
  },
  {
    "id": "audit26-6-02",
    "field": 6,
    "topic": "Verpackungsfunktionen",
    "difficulty": 3,
    "type": "free",
    "question": "Warum dürfen ölverschmutzte Verpackungsreste nicht ungeprüft gemeinsam mit sauberer Pappe entsorgt werden?",
    "solution": "Die Verschmutzung kann die Verwertung verhindern oder eine besondere Abfalleinstufung erforderlich machen. Abfälle sind nach ihren Eigenschaften und dem betrieblichen Entsorgungsweg getrennt zu erfassen.",
    "keywords": [
      "Verschmutzung",
      "getrennt",
      "Einstufung",
      "Verwertung"
    ],
    "minHits": 1
  },
  {
    "id": "audit26-6-03",
    "field": 6,
    "topic": "Packmittel",
    "difficulty": 3,
    "type": "number",
    "question": "Ein Versandkarton hat Außenmaße von 60 cm × 40 cm × 30 cm. Wie groß ist das äußere Volumen in m³?",
    "solution": "0,60 × 0,40 × 0,30 = 0,072 m³.",
    "answer": 0.072,
    "tolerance": 0.0001
  },
  {
    "id": "audit26-7-01",
    "field": 7,
    "topic": "Tourenplanung",
    "difficulty": 3,
    "type": "number",
    "question": "Abfahrt ist um 08:00 Uhr. Bis Kunde A dauern Fahrt und Service zusammen 75 Minuten, anschließend dauert die Fahrt zu B 45 Minuten. B nimmt Ware erst ab 10:15 Uhr an. Wie viele Minuten Wartezeit entstehen bei B?",
    "solution": "Ankunft B um 10:00 Uhr; bis 10:15 Uhr sind es 15 Minuten.",
    "answer": 15,
    "tolerance": 0
  },
  {
    "id": "audit26-7-02",
    "field": 7,
    "topic": "Tourenplanung",
    "difficulty": 3,
    "type": "free",
    "question": "Zwei Standorte sind gleich teuer. Standort A besitzt einen direkten Bahnanschluss, Standort B nur einen Straßenanschluss. Welcher Vorteil kann A bei regelmäßig großen Gütermengen bieten?",
    "solution": "Der Bahnanschluss kann Umladung oder Straßenvorlauf zu einem Terminal vermeiden und den gebündelten Schienentransport erleichtern. Ob er wirtschaftlich ist, hängt von Mengen, Verbindungen und Terminen ab.",
    "keywords": [
      "Bahn",
      "Vorlauf",
      "Terminal",
      "gebündelt"
    ],
    "minHits": 1
  },
  {
    "id": "audit26-7-03",
    "field": 7,
    "topic": "Wirtschaftlichkeit",
    "difficulty": 3,
    "type": "number",
    "question": "Eine Umfahrung verursacht 20 zusätzliche Kilometer zu 0,80 € je Kilometer, spart aber 45 Minuten bewertete Fahrer- und Fahrzeugzeit zu 40 € je Stunde. Wie hoch ist der Kostenvorteil der Umfahrung?",
    "solution": "Zeitersparnis 0,75 × 40 = 30 €. Mehrkilometer 20 × 0,80 = 16 €. Vorteil 14 €.",
    "answer": 14,
    "tolerance": 0.01
  },
  {
    "id": "audit26-8-01",
    "field": 8,
    "topic": "Ladungssicherung",
    "difficulty": 3,
    "type": "number",
    "question": "Rechenmodell: Eine Ladung von 1.000 kg erfährt eine Verzögerung von 8 m/s². Welche Trägheitskraft ergibt sich in Newton aus F = m × a? Reibung und Sicherungsmittel werden hier noch nicht berücksichtigt.",
    "solution": "F = 1.000 × 8 = 8.000 N. Das allein ist noch keine vollständige Ladungssicherungsberechnung.",
    "answer": 8000,
    "tolerance": 0
  },
  {
    "id": "audit26-8-02",
    "field": 8,
    "topic": "Ladungssicherung",
    "difficulty": 3,
    "type": "free",
    "question": "Auf einem Zurrgurt stehen LC und STF. Welche unterschiedliche Bedeutung haben die Angaben?",
    "solution": "LC bezeichnet die zulässige Zurrkraft; STF die standardisierte Vorspannkraft. Beim Niederzurren ist die erreichbare Vorspannung wichtig, beim Direktzurren unter anderem die zulässige Zurrkraft. Die Werte sind nicht austauschbar.",
    "keywords": [
      "Zurrkraft",
      "Vorspannkraft",
      "Niederzurren",
      "Direktzurren"
    ],
    "minHits": 1
  },
  {
    "id": "audit26-8-03",
    "field": 8,
    "topic": "Ladeeinheiten",
    "difficulty": 3,
    "type": "free",
    "question": "Nach der Verladung wird eine Plombe angebracht. Welche Daten sollten dokumentiert werden, und ersetzt die Plombe die Ladungssicherung?",
    "solution": "Plombennummer und Zuordnung zu Fahrzeug oder Container und Sendung dokumentieren. Die Plombe dient der Manipulationserkennung und ersetzt keine Ladungssicherung.",
    "keywords": [
      "Plombennummer",
      "Zuordnung",
      "Manipulation",
      "Sicherung"
    ],
    "minHits": 1
  },
  {
    "id": "audit26-9-01",
    "field": 9,
    "topic": "Versandarten",
    "difficulty": 3,
    "type": "number",
    "question": "Ein fiktiver Frachttarif lautet: bis einschließlich 100 kg 45 €, über 100 bis einschließlich 200 kg 70 €, über 200 bis 300 kg 95 €. Eine Sendung wiegt 180 kg; Zuschläge gibt es nicht. Wie hoch ist die Fracht?",
    "solution": "180 kg fällt in die Stufe über 100 bis 200 kg: 70 €.",
    "answer": 70,
    "tolerance": 0
  },
  {
    "id": "audit26-9-02",
    "field": 9,
    "topic": "Frachtpapiere",
    "difficulty": 3,
    "type": "free",
    "question": "Übersetze die Angaben einer Packliste: gross weight 120 kg, net weight 108 kg. Welche Masse entfällt rechnerisch auf die Verpackung?",
    "solution": "Bruttomasse 120 kg, Nettomasse 108 kg; Verpackungsmasse bzw. Tara = 12 kg.",
    "keywords": [
      "Brutto",
      "Netto",
      "Tara",
      "12"
    ],
    "minHits": 1
  },
  {
    "id": "audit26-9-03",
    "field": 9,
    "topic": "Versandarten",
    "difficulty": 3,
    "type": "free",
    "question": "Ein Container wird per Lkw zum Bahnterminal, im Hauptlauf per Bahn und zuletzt wieder per Lkw befördert. Warum kann dies kombinierter Verkehr sein?",
    "solution": "Der Hauptlauf erfolgt auf der Schiene, die Straße übernimmt Vor- und Nachlauf. Die Güter verbleiben beim Wechsel des Verkehrsträgers in derselben Ladeeinheit.",
    "keywords": [
      "Hauptlauf",
      "Schiene",
      "Vor",
      "Nachlauf",
      "Ladeeinheit"
    ],
    "minHits": 1
  },
  {
    "id": "audit26-10-01",
    "field": 10,
    "topic": "Lean",
    "difficulty": 3,
    "type": "number",
    "question": "ABC-Analyse nach Jahresverbrauchswert: Artikel A wird 100-mal zu 50 €, B 1.000-mal zu 2 € und C 200-mal zu 5 € verbraucht. Wie hoch ist der Wertanteil von Artikel A in Prozent?",
    "solution": "A = 5.000 €, B = 2.000 €, C = 1.000 €, Gesamt 8.000 €. Anteil A = 62,5 %. Der Artikelname A ist dabei noch keine ABC-Klassifizierung.",
    "answer": 62.5,
    "tolerance": 0.01
  },
  {
    "id": "audit26-10-02",
    "field": 10,
    "topic": "Lean",
    "difficulty": 3,
    "type": "free",
    "question": "Unterscheide programmgesteuerte und verbrauchsgesteuerte Bedarfsermittlung.",
    "solution": "Programmgesteuert wird Bedarf aus Produktionsprogramm und beispielsweise Stücklisten abgeleitet. Verbrauchsgesteuert wird er aus bisherigen Verbräuchen und deren erwarteter Entwicklung ermittelt.",
    "keywords": [
      "Produktionsprogramm",
      "Stückliste",
      "Verbrauch",
      "Vergangenheit"
    ],
    "minHits": 1
  },
  {
    "id": "audit26-10-03",
    "field": 10,
    "topic": "KVP",
    "difficulty": 3,
    "type": "free",
    "question": "Welche betrieblichen Produktionsfaktoren werden beim Kommissionieren kombiniert? Nenne ein Beispiel für jeden der drei elementaren Faktoren.",
    "solution": "Arbeit: Kommissionierer; Betriebsmittel: Regal oder Kommissionierwagen; Werkstoffe: beispielsweise Verpackungsmaterial. Planung und Leitung koordinieren ihren Einsatz.",
    "keywords": [
      "Arbeit",
      "Betriebsmittel",
      "Werkstoffe"
    ],
    "minHits": 1
  },
  {
    "id": "audit26-11-01",
    "field": 11,
    "topic": "Lieferanten",
    "difficulty": 3,
    "type": "free",
    "question": "Unterscheide Angebotsmonopol, Angebotsoligopol und Angebotspolypol anhand der Anzahl der Anbieter bei vielen Nachfragern.",
    "solution": "Monopol: ein Anbieter; Oligopol: wenige Anbieter; Polypol: viele Anbieter.",
    "keywords": [
      "ein",
      "wenige",
      "viele",
      "Anbieter"
    ],
    "minHits": 1
  },
  {
    "id": "audit26-11-02",
    "field": 11,
    "topic": "Beschaffung",
    "difficulty": 3,
    "type": "free",
    "question": "Bei FOB nach Incoterms 2020: Wann geht die Gefahr grundsätzlich vom Verkäufer auf den Käufer über?",
    "solution": "Wenn die Ware im benannten Verschiffungshafen an Bord des vom Käufer benannten Schiffs geliefert ist. FOB ist für See- und Binnenschiffstransport bestimmt.",
    "keywords": [
      "Bord",
      "Schiff",
      "Verschiffungshafen"
    ],
    "minHits": 1
  },
  {
    "id": "audit26-11-03",
    "field": 11,
    "topic": "Beschaffung",
    "difficulty": 3,
    "type": "free",
    "question": "Bei CIF nach Incoterms 2020 bezahlt der Verkäufer Fracht und Versicherung bis zum benannten Bestimmungshafen. Geht die Gefahr deshalb erst dort über?",
    "solution": "Nein. Der Gefahrübergang erfolgt grundsätzlich bereits mit Lieferung an Bord im Verschiffungshafen. Die bezahlte Beförderung und Versicherung bis zum Bestimmungshafen verlagern diesen Punkt nicht.",
    "keywords": [
      "Bord",
      "Verschiffungshafen",
      "Gefahr",
      "Versicherung"
    ],
    "minHits": 1
  },
  {
    "id": "audit26-11-04",
    "field": 11,
    "topic": "Beschaffung",
    "difficulty": 3,
    "type": "number",
    "question": "Listeneinkaufspreis gesamt 1.000 €, Rabatt 10 %, Skonto 2 % auf den Zieleinkaufspreis, Bezugskosten 40 €. Skonto wird genutzt. Berechne den Bezugspreis ohne Umsatzsteuer.",
    "solution": "1.000 × 0,90 = 900; 900 × 0,98 = 882; 882 + 40 = 922 €.",
    "answer": 922,
    "tolerance": 0.01
  },
  {
    "id": "audit26-12-01",
    "field": 12,
    "topic": "Wirtschaftlichkeit",
    "difficulty": 3,
    "type": "mc",
    "question": "Ein Betrieb begleicht eine Lieferantenverbindlichkeit per Banküberweisung. Welche Bilanzveränderung liegt ohne Gebühren vor?",
    "solution": "Bankguthaben und Verbindlichkeit sinken um denselben Betrag: Aktiv-Passiv-Minderung.",
    "options": [
      "Aktiv-Passiv-Minderung",
      "Aktivtausch",
      "Passivtausch",
      "Aktiv-Passiv-Mehrung"
    ],
    "correct": [
      0
    ]
  },
  {
    "id": "audit26-12-02",
    "field": 12,
    "topic": "Wirtschaftlichkeit",
    "difficulty": 3,
    "type": "free",
    "question": "Ein Unternehmen erhält einen Bankkredit über 5.000 €. Nenne den Buchungssatz ohne Zinsen oder Gebühren.",
    "solution": "Bank an Darlehensverbindlichkeiten 5.000 €. Das Aktivkonto Bank nimmt im Soll zu, die Verbindlichkeit im Haben.",
    "keywords": [
      "Bank",
      "Darlehen",
      "Soll",
      "Haben"
    ],
    "minHits": 1
  },
  {
    "id": "audit26-12-03",
    "field": 12,
    "topic": "Kosten",
    "difficulty": 3,
    "type": "number",
    "question": "Vereinfachte Warenrechnung: Anfangsbestand 10.000 €, Zugänge 40.000 €, Endbestand 12.000 €. Wie hoch ist der Wareneinsatz, wenn weitere Korrekturen entfallen?",
    "solution": "Wareneinsatz = Anfangsbestand + Zugänge − Endbestand = 38.000 €.",
    "answer": 38000,
    "tolerance": 0
  },
  {
    "id": "audit26-12-04",
    "field": 12,
    "topic": "Wirtschaftlichkeit",
    "difficulty": 3,
    "type": "number",
    "question": "Ein vereinfachter Jahresabschluss zeigt 70.000 € Umsatzerlöse, 38.000 € Wareneinsatz und 22.000 € weitere Aufwendungen. Wie hoch ist der Gewinn vor Steuern?",
    "solution": "70.000 − 38.000 − 22.000 = 10.000 €.",
    "answer": 10000,
    "tolerance": 0
  }
];
