// Gezielte Praxisergänzungen; Quellen und Umfang: docs/PRACTICAL-2026.md.
export const practicalQuestions = [
  {
    "id": "practice26-01",
    "field": 1,
    "topic": "Warenannahme",
    "difficulty": 3,
    "type": "free",
    "question": "Du sollst an einer Rampe entladen. Der Lkw steht noch ungesichert und die Ladebrücke liegt nur lose auf. Wie bereitest du das Entladen sicher vor?",
    "solution": "Entladung noch nicht beginnen. Fahrzeug gegen Wegrollen sichern lassen, Ladebrücke auf Zustand, Tragfähigkeit und Sicherung gegen Verschieben prüfen sowie Ladefläche und Übergang kontrollieren. Erst nach sicherer Freigabe entladen.",
    "keywords": [
      "sichern",
      "wegrollen",
      "ladebrücke",
      "tragfähig"
    ],
    "minHits": 1
  },
  {
    "id": "practice26-02",
    "field": 1,
    "topic": "Warenannahme",
    "difficulty": 3,
    "type": "free",
    "question": "Eine Ladebrücke ist für 3.000 kg zugelassen. Stapler und beladene Palette wiegen zusammen 3.250 kg. Darfst du darüberfahren? Begründe.",
    "solution": "Nein. Die Gesamtmasse von Stapler und Last überschreitet die zulässige Tragfähigkeit. Ein ausreichend tragfähiger Übergang beziehungsweise ein anderes geeignetes Entladeverfahren ist erforderlich.",
    "keywords": [
      "nein",
      "gesamtmasse",
      "tragfähigkeit",
      "überschritten"
    ],
    "minHits": 1
  },
  {
    "id": "practice26-03",
    "field": 1,
    "topic": "Warenannahme",
    "difficulty": 3,
    "type": "free",
    "question": "Ein Karton enthält zwölf Einzelpackungen. Bestellt sind 96 Stück, angeliefert werden acht Kartons. Wie kontrollierst du die Menge und was dokumentierst du?",
    "solution": "Acht mal zwölf ergibt 96 Stück. Verpackungseinheit und tatsächlichen Inhalt anhand der Kennzeichnung und der vorgesehenen Kontrolle prüfen; Kartonzahl, Stückzahl und mögliche Abweichungen mit Bestellung und Lieferschein abgleichen und dokumentieren.",
    "keywords": [
      "96",
      "verpackungseinheit",
      "stückzahl",
      "abgleichen"
    ],
    "minHits": 1
  },
  {
    "id": "practice26-04",
    "field": 1,
    "topic": "Mängel",
    "difficulty": 3,
    "type": "free",
    "question": "Bei der Warenannahme riecht ein Gebinde stark nach Chemikalien und ist feucht. Welche unmittelbaren Maßnahmen sind sinnvoll?",
    "solution": "Abstand halten, gefährdeten Bereich sichern und zuständige Stelle alarmieren. Gebinde nicht öffnen oder ungeschützt anfassen. Stoff über Kennzeichnung und Sicherheitsdatenblatt klären; weitere Maßnahmen nur nach Betriebsanweisung und durch unterwiesene Personen durchführen.",
    "keywords": [
      "abstand",
      "sichern",
      "melden",
      "sicherheitsdatenblatt"
    ],
    "minHits": 1
  },
  {
    "id": "practice26-05",
    "field": 1,
    "topic": "Warenannahme",
    "difficulty": 3,
    "type": "free",
    "question": "Du sollst die Nettomasse einer Kiste wiegen. Wie bereitest du eine geeignete Waage vor und ermittelst das Nettoergebnis?",
    "solution": "Waage mit ausreichender Höchstlast und geeigneter Auflösung wählen, sicheren ebenen Standort und Nullanzeige prüfen. Leere Verpackung tarieren oder ihre Masse vom Bruttowert abziehen; Ergebnis mit Einheit dokumentieren.",
    "keywords": [
      "höchstlast",
      "null",
      "tara",
      "brutto"
    ],
    "minHits": 1
  },
  {
    "id": "practice26-06",
    "field": 1,
    "topic": "Warenannahme",
    "difficulty": 3,
    "type": "number",
    "question": "Eine Waage zeigt 128,6 kg Bruttomasse. Die leere Kiste wiegt 11,8 kg. Welche Nettomasse in kg ist zu erfassen?",
    "solution": "Nettomasse = 128,6 − 11,8 = 116,8 kg.",
    "answer": 116.8,
    "tolerance": 0.01
  },
  {
    "id": "practice26-07",
    "field": 1,
    "topic": "Warenannahme",
    "difficulty": 3,
    "type": "free",
    "question": "Ein Temperaturmessgerät ist beschädigt und zeigt bei derselben Ware stark wechselnde Werte. Wie führst du die Eingangskontrolle fort?",
    "solution": "Nicht mit dem unzuverlässigen Gerät freigeben. Defekt melden und ein geeignetes geprüftes Messgerät verwenden; Messung nach Vorgaben durchführen und dokumentieren. Ware bis zur Klärung entsprechend den betrieblichen Regeln behandeln.",
    "keywords": [
      "melden",
      "geeignet",
      "messgerät",
      "dokumentieren"
    ],
    "minHits": 1
  },
  {
    "id": "practice26-08",
    "field": 2,
    "topic": "Bestände",
    "difficulty": 3,
    "type": "free",
    "question": "Welche Angaben müssen auf einer Lagerfachkarte stehen, damit Zu- und Abgänge einem Artikel und Lagerplatz eindeutig zugeordnet werden können?",
    "solution": "Artikelnummer beziehungsweise eindeutige Bezeichnung, Lagerplatz und Mengeneinheit; für Bewegungen Datum, Belegnummer, Zugang oder Abgang sowie fortgeschriebener Bestand. Je nach Betrieb kommen Charge und weitere Angaben hinzu.",
    "keywords": [
      "artikel",
      "lagerplatz",
      "einheit",
      "datum",
      "beleg",
      "bestand"
    ],
    "minHits": 1
  },
  {
    "id": "practice26-09",
    "field": 2,
    "topic": "Bestände",
    "difficulty": 3,
    "type": "number",
    "question": "Lagerfachkarte: Anfangsbestand 145 Stück; Zugang laut WE-18: 72 Stück; Abgang laut KA-09: 58 Stück; freigegebene Kundenrückgabe: 6 Stück. Welcher Endbestand in Stück ist einzutragen?",
    "solution": "145 + 72 − 58 + 6 = 165 Stück. Die Rückgabe wird nach Freigabe als Zugang gebucht.",
    "answer": 165,
    "tolerance": 0.01
  },
  {
    "id": "practice26-10",
    "field": 2,
    "topic": "Bestände",
    "difficulty": 3,
    "type": "free",
    "question": "Auf der Lagerfachkarte stehen 84 Stück. Du zählst 79. Darfst du die Karte einfach auf 79 ändern? Beschreibe das Vorgehen.",
    "solution": "Nachzählen und Einheit, Lagerplatz sowie offene oder falsch gebuchte Bewegungen prüfen. Abweichung dokumentieren und melden; eine Korrektur nur mit Freigabe beziehungsweise gemäß dem festgelegten Verfahren buchen.",
    "keywords": [
      "nachzählen",
      "bewegungen",
      "dokumentieren",
      "freigabe"
    ],
    "minHits": 1
  },
  {
    "id": "practice26-11",
    "field": 2,
    "topic": "Bestände",
    "difficulty": 3,
    "type": "number",
    "question": "Eine Fachkarte führt Stück. Ein Zugang umfasst sieben Kartons mit je 24 Stück. Welcher Zugang in Stück ist zu buchen?",
    "solution": "7 × 24 = 168 Stück. Die Buchungseinheit muss mit der Einheit der Fachkarte übereinstimmen.",
    "answer": 168,
    "tolerance": 0.01
  },
  {
    "id": "practice26-12",
    "field": 2,
    "topic": "Lagerarten",
    "difficulty": 3,
    "type": "free",
    "question": "Am Regal sind Fachlast 800 kg und Feldlast 2.400 kg angegeben. Erläutere, welche beiden Grenzen du beim Einlagern beachten musst.",
    "solution": "Fachlast begrenzt die gesamte Last auf einer Lagerebene. Feldlast begrenzt die gesamte eingebrachte Last eines Regalfelds zwischen zwei Stützen. Beide Grenzen und weitere Herstellervorgaben müssen gleichzeitig eingehalten werden.",
    "keywords": [
      "fach",
      "ebene",
      "feld",
      "gesamtlast"
    ],
    "minHits": 1
  },
  {
    "id": "practice26-13",
    "field": 2,
    "topic": "Lagerarten",
    "difficulty": 3,
    "type": "number",
    "question": "Ein Regal hat eine Fachlast von 900 kg. Zwei Paletten auf dieser Ebene wiegen 285 kg und 310 kg. Wie viele kg Fachlast bleiben rechnerisch frei? Feldlast und Lastverteilung werden separat geprüft.",
    "solution": "900 − 285 − 310 = 305 kg. Freie Fachlast allein ist noch keine Einlagerungsfreigabe.",
    "answer": 305,
    "tolerance": 0.01
  },
  {
    "id": "practice26-14",
    "field": 2,
    "topic": "Lagerarten",
    "difficulty": 3,
    "type": "free",
    "question": "Nach einer Staplerkollision ist eine Regalstütze sichtbar verbogen. Was tust du vor der nächsten Einlagerung?",
    "solution": "Betroffenen Bereich absperren beziehungsweise sperren und Schaden melden. Nicht weiter ein- oder auslagern, bis eine fachkundige Beurteilung und Freigabe vorliegen. Keine improvisierte Reparatur durchführen.",
    "keywords": [
      "sperren",
      "melden",
      "beurteilung",
      "freigabe"
    ],
    "minHits": 1
  },
  {
    "id": "practice26-15",
    "field": 3,
    "topic": "Kennzeichnung",
    "difficulty": 3,
    "type": "free",
    "question": "Ein Chemikalienetikett trägt eine rote Raute mit schwarzem Symbol auf weißem Grund. Gehört das zu den gelben dreieckigen Warnzeichen? Erkläre den Unterschied.",
    "solution": "Die rote Raute ist ein GHS-Gefahrenpiktogramm für die Stoffkennzeichnung. Ein gelbes Dreieck ist ein Sicherheits-Warnzeichen für eine Gefahr am Ort. Beide Systeme haben unterschiedliche Aufgaben; Etikett und Sicherheitsdatenblatt gemeinsam beachten.",
    "keywords": [
      "ghs",
      "stoff",
      "warnzeichen",
      "sicherheitsdatenblatt"
    ],
    "minHits": 1
  },
  {
    "id": "practice26-16",
    "field": 3,
    "topic": "Kennzeichnung",
    "difficulty": 3,
    "type": "free",
    "question": "Welche unterschiedliche Aussage haben H-Hinweise und P-Hinweise auf einem Gefahrstoffetikett?",
    "solution": "H-Hinweise beschreiben die Gefahren des Stoffes oder Gemisches. P-Hinweise beschreiben empfohlene Sicherheitsmaßnahmen, etwa zum Umgang, zur Lagerung oder bei Unfällen.",
    "keywords": [
      "gefahr",
      "sicherheit",
      "maßnahmen"
    ],
    "minHits": 1
  },
  {
    "id": "practice26-17",
    "field": 3,
    "topic": "Kennzeichnung",
    "difficulty": 3,
    "type": "free",
    "question": "Auf einem Etikett steht das Signalwort „Gefahr“, auf einem anderen „Achtung“. Was sagt diese Unterscheidung aus?",
    "solution": "Gefahr kennzeichnet schwerwiegendere Gefahrenkategorien, Achtung weniger schwerwiegende. Das Signalwort ersetzt nicht die Prüfung der konkreten Piktogramme, Gefahrenhinweise und Sicherheitsmaßnahmen.",
    "keywords": [
      "schwerwiegender",
      "kategorie",
      "hinweise"
    ],
    "minHits": 1
  },
  {
    "id": "practice26-18",
    "field": 2,
    "topic": "Lagerarten",
    "difficulty": 3,
    "type": "free",
    "question": "Ein neues Gefahrstoffgebinde soll eingelagert werden. Welche Informationsquellen nutzt du für Lagerbedingungen und Unverträglichkeiten?",
    "solution": "Kennzeichnung, aktuelles Sicherheitsdatenblatt, insbesondere Angaben zur sicheren Handhabung und Lagerung sowie Stabilität und Reaktivität, und die betriebliche Betriebsanweisung beziehungsweise Lagerregeln prüfen. Nicht allein nach dem Piktogramm entscheiden.",
    "keywords": [
      "sicherheitsdatenblatt",
      "lagerung",
      "unverträglichkeit",
      "betriebsanweisung"
    ],
    "minHits": 1
  },
  {
    "id": "practice26-19",
    "field": 4,
    "topic": "Sicherheit",
    "difficulty": 3,
    "type": "free",
    "question": "Du siehst ein gelbes dreieckiges Schild mit Staplersymbol. Welche Gefahr wird angezeigt und wie verhältst du dich als Fußgänger?",
    "solution": "Warnung vor Flurförderzeugen. Auf Staplerverkehr achten, freigegebene Fußwege benutzen und Kreuzungsstellen erst nach sicherer Verständigung beziehungsweise freier Sicht passieren.",
    "keywords": [
      "flurförderzeug",
      "stapler",
      "fußweg",
      "achten"
    ],
    "minHits": 1
  },
  {
    "id": "practice26-20",
    "field": 4,
    "topic": "Sicherheit",
    "difficulty": 3,
    "type": "free",
    "question": "Ordne die fünf Sicherheitszeichenarten ihren typischen Formen und Farben zu: Gebot, Verbot, Warnung, Rettung und Brandschutz.",
    "solution": "Gebot: blau und rund. Verbot: rund mit rotem Rand und rotem Schrägbalken. Warnung: gelbes Dreieck mit schwarzem Rand. Rettung: grünes Quadrat oder Rechteck. Brandschutz: rotes Quadrat oder Rechteck.",
    "keywords": [
      "blau",
      "rund",
      "rot",
      "gelb",
      "dreieck",
      "grün"
    ],
    "minHits": 1
  },
  {
    "id": "practice26-21",
    "field": 4,
    "topic": "Sicherheit",
    "difficulty": 3,
    "type": "free",
    "question": "Was unterscheidet ein rotes quadratisches Feuerlöscherschild von einem runden roten Verbotszeichen?",
    "solution": "Das Brandschutzzeichen zeigt den Standort eines Feuerlöschers. Ein Verbotszeichen untersagt eine Handlung; es hat einen roten Rand und Schrägbalken. Rot allein reicht für die Zuordnung nicht aus.",
    "keywords": [
      "standort",
      "feuerlöscher",
      "verbietet",
      "schrägbalken"
    ],
    "minHits": 1
  },
  {
    "id": "practice26-22",
    "field": 4,
    "topic": "Sicherheit",
    "difficulty": 3,
    "type": "free",
    "question": "Du hörst den Räumungsalarm. Welche Bedeutung hat das grüne Schild mit vier zur Mitte gerichteten Pfeilen und mehreren Personen?",
    "solution": "Es kennzeichnet die Sammelstelle. Nach dem betrieblichen Räumungsplan auf sicheren Fluchtwegen dorthin gehen, sich melden und auf Anweisungen warten; nicht eigenmächtig zurück ins Gebäude gehen.",
    "keywords": [
      "sammelstelle",
      "fluchtweg",
      "melden",
      "warten"
    ],
    "minHits": 1
  },
  {
    "id": "practice26-23",
    "field": 4,
    "topic": "Sicherheit",
    "difficulty": 3,
    "type": "free",
    "question": "Wozu dienen die grünen Zeichen für Augenspüleinrichtung und Notdusche im Gefahrstoffbereich?",
    "solution": "Sie zeigen den Standort von Einrichtungen für die schnelle Hilfe bei Kontamination. Standort und sichere Benutzung vor der Arbeit kennen; im Unfallfall nach Betriebsanweisung reagieren und Hilfe alarmieren.",
    "keywords": [
      "standort",
      "hilfe",
      "kontamination",
      "betriebsanweisung"
    ],
    "minHits": 1
  },
  {
    "id": "practice26-24",
    "field": 4,
    "topic": "Sicherheit",
    "difficulty": 3,
    "type": "free",
    "question": "Ordne die Brandklassen A, B, C, D und F jeweils einer Stoffgruppe zu.",
    "solution": "A: feste Stoffe, meist mit Glutbildung; B: flüssige oder flüssig werdende Stoffe; C: Gase; D: Metalle; F: Speiseöle und Speisefette in Küchengeräten.",
    "keywords": [
      "fest",
      "flüssig",
      "gas",
      "metall",
      "speise"
    ],
    "minHits": 1
  },
  {
    "id": "practice26-25",
    "field": 4,
    "topic": "Sicherheit",
    "difficulty": 3,
    "type": "free",
    "question": "Ein kleiner Stapel Kartonagen brennt. Welche Brandklasse liegt typischerweise vor und woran erkennst du einen geeigneten Feuerlöscher?",
    "solution": "Typischerweise Brandklasse A. Der Löscher muss für A gekennzeichnet und für die Situation geeignet sein. Alarmierung, eigener Fluchtweg und Eigenschutz haben Vorrang; nur einen Entstehungsbrand ohne Eigengefährdung bekämpfen.",
    "keywords": [
      "a",
      "kennzeichnung",
      "eigenschutz",
      "alarm"
    ],
    "minHits": 1
  },
  {
    "id": "practice26-26",
    "field": 4,
    "topic": "Sicherheit",
    "difficulty": 3,
    "type": "free",
    "question": "Warum ist ein normaler Wasserstrahl bei brennendem Speiseöl ungeeignet? Welche Löscherkennzeichnung wäre für diesen Brand maßgeblich?",
    "solution": "Wasser kann schlagartig verdampfen und brennendes Fett herausschleudern. Speiseöl- beziehungsweise Fettbrand gehört zur Brandklasse F; ein dafür geeigneter, mit F gekennzeichneter Löscher ist maßgeblich.",
    "keywords": [
      "verdampfen",
      "fett",
      "f",
      "geeignet"
    ],
    "minHits": 1
  },
  {
    "id": "practice26-27",
    "field": 4,
    "topic": "Sicherheit",
    "difficulty": 3,
    "type": "free",
    "question": "Ein Feuerlöscher wurde für wenige Sekunden benutzt. Darfst du ihn direkt wieder an den Wandhalter hängen?",
    "solution": "Nein. Ein eingesetzter Löscher muss durch eine sachkundige Person geprüft und neu befüllt werden. Benutzung melden und die betriebliche Ersatzversorgung sicherstellen.",
    "keywords": [
      "nein",
      "prüfen",
      "befüllen",
      "melden"
    ],
    "minHits": 1
  },
  {
    "id": "practice26-28",
    "field": 4,
    "topic": "Sicherheit",
    "difficulty": 3,
    "type": "free",
    "question": "Bei einem Brand versperrt Rauch deinen vorgesehenen Weg. Wie reagierst du?",
    "solution": "Nicht in den verrauchten Bereich gehen. Sichere alternative Fluchtwege nach Räumungsplan nutzen, andere warnen und Hilfe alarmieren. Wenn eine sichere Flucht nicht möglich ist, geschützt auf sich aufmerksam machen und den Standort mitteilen.",
    "keywords": [
      "rauch",
      "alternativ",
      "warnen",
      "alarmieren"
    ],
    "minHits": 1
  },
  {
    "id": "practice26-29",
    "field": 4,
    "topic": "Fördermittel",
    "difficulty": 3,
    "type": "free",
    "question": "Unterscheide bei der täglichen Staplerkontrolle eine Sichtprüfung von einer Funktionsprüfung und nenne jeweils zwei Beispiele.",
    "solution": "Sichtprüfung: beispielsweise Gabelzinken auf Risse oder Verformung und Hydraulik auf Leckagen prüfen. Funktionsprüfung: beispielsweise Betriebs- und Feststellbremse, Lenkung oder Warneinrichtung kontrollieren. Hersteller- und Betriebsvorgaben beachten.",
    "keywords": [
      "sicht",
      "gabel",
      "hydraulik",
      "bremse",
      "funktion"
    ],
    "minHits": 1
  },
  {
    "id": "practice26-30",
    "field": 4,
    "topic": "Sicherheit",
    "difficulty": 3,
    "type": "free",
    "question": "Vor Arbeitsbeginn tropft Hydrauliköl am Stapler. Ein Kollege empfiehlt, erst die schnelle Entladung zu erledigen. Wie entscheidest du?",
    "solution": "Stapler nicht einsetzen, Mangel sofort melden und gegen Benutzung sichern. Reparatur durch zuständiges Fachpersonal und Freigabe abwarten; geeignetes Ersatzgerät verwenden.",
    "keywords": [
      "nicht",
      "melden",
      "sichern",
      "fachpersonal"
    ],
    "minHits": 1
  },
  {
    "id": "practice26-31",
    "field": 4,
    "topic": "Fördermittel",
    "difficulty": 3,
    "type": "free",
    "question": "Für einen Stapler liegt eine gültige wiederkehrende Prüfung vor. Kann deshalb die tägliche Sicht- und Funktionskontrolle entfallen? Begründe.",
    "solution": "Nein. Die wiederkehrende Prüfung ersetzt die tägliche Kontrolle vor Arbeitsbeginn nicht. Zwischen Prüfungen können Schäden oder Funktionsmängel entstehen.",
    "keywords": [
      "nein",
      "täglich",
      "schäden",
      "nicht ersetzen"
    ],
    "minHits": 1
  },
  {
    "id": "practice26-32",
    "field": 4,
    "topic": "Fördermittel",
    "difficulty": 3,
    "type": "free",
    "question": "Du sollst einen Handhubwagen vor dem Transport prüfen. Welche Punkte sind für einen sicheren Einsatz besonders wichtig?",
    "solution": "Tragfähigkeit und Eignung für Last und Weg prüfen. Gabeln, Rollen und Räder sowie Hydraulik auf erkennbare Schäden oder Leckagen kontrollieren, Hub- und Senkfunktion nach Vorgaben prüfen und bei sicherheitsrelevanten Mängeln nicht einsetzen.",
    "keywords": [
      "tragfähigkeit",
      "rollen",
      "hydraulik",
      "hub",
      "mängel"
    ],
    "minHits": 1
  },
  {
    "id": "practice26-33",
    "field": 4,
    "topic": "Fördermittel",
    "difficulty": 3,
    "type": "free",
    "question": "Das Tragfähigkeitsdiagramm eines Staplers erlaubt bei der benötigten Hubhöhe 1.400 kg bei 500 mm Lastschwerpunktabstand und 1.050 kg bei 700 mm. Die Last wiegt 1.200 kg bei 700 mm. Darfst du sie aufnehmen?",
    "solution": "Nein. Maßgeblich ist der tatsächliche Lastschwerpunktabstand von 700 mm bei der benötigten Hubhöhe. Dort sind nur 1.050 kg zulässig; 1.200 kg überschreiten die Grenze.",
    "keywords": [
      "nein",
      "700",
      "1050",
      "überschreitet"
    ],
    "minHits": 1
  },
  {
    "id": "practice26-34",
    "field": 4,
    "topic": "Sicherheit",
    "difficulty": 3,
    "type": "free",
    "question": "Weshalb darf eine Palette mit einem beschädigten tragenden Brett nicht ungeprüft weiter als Ladeeinheit eingesetzt werden?",
    "solution": "Die Tragfähigkeit und Stabilität können beeinträchtigt sein. Palette beziehungsweise Ladeeinheit sichern und nach betrieblichem Verfahren prüfen; beschädigten Ladungsträger ersetzen, wenn seine sichere Nutzung nicht gewährleistet ist.",
    "keywords": [
      "tragfähigkeit",
      "stabilität",
      "prüfen",
      "ersetzen"
    ],
    "minHits": 1
  },
  {
    "id": "practice26-35",
    "field": 6,
    "topic": "Packmittel",
    "difficulty": 3,
    "type": "free",
    "question": "Du bereitest eine Umreifung vor. Welche Kontrollen und Schutzmaßnahmen planst du am Umreifungsgerät?",
    "solution": "Gerät und Band auf Zustand und passende Ausführung prüfen, Bedienungsanleitung beachten und erforderliche PSA benutzen. Hände aus Spann- und Verschlussbereich halten; Bandende und gespannte Bänder kontrolliert handhaben, um Rückschlag und Schnittverletzungen zu vermeiden.",
    "keywords": [
      "zustand",
      "bedienungsanleitung",
      "psa",
      "spann",
      "rückschlag"
    ],
    "minHits": 1
  },
  {
    "id": "practice26-36",
    "field": 6,
    "topic": "Packmittel",
    "difficulty": 3,
    "type": "free",
    "question": "Ein gespanntes Umreifungsband soll entfernt werden. Warum darfst du es nicht unkontrolliert durchtrennen?",
    "solution": "Das unter Spannung stehende Band kann zurückschnellen; außerdem kann die Ladung auseinanderfallen. Ladeeinheit zunächst stabilisieren und Band mit geeignetem Werkzeug und Schutzmaßnahmen nach Vorgaben kontrolliert lösen.",
    "keywords": [
      "zurückschnellen",
      "spannung",
      "stabilisieren",
      "werkzeug"
    ],
    "minHits": 1
  },
  {
    "id": "practice26-37",
    "field": 3,
    "topic": "Verpackung",
    "difficulty": 3,
    "type": "free",
    "question": "Du benutzt ein Klammergerät zum Verschließen von Kisten. Wie verhinderst du, dass jemand durch austretende Klammern verletzt wird?",
    "solution": "Gerät bestimmungsgemäß nach Anleitung verwenden, auf sicheren Untergrund und ausreichend geeignetes Material achten. Hände aus der Austrittszone halten, niemals auf Personen richten und Gerät vor Störungsbeseitigung sicher von seiner Energieversorgung trennen.",
    "keywords": [
      "hände",
      "austritt",
      "personen",
      "energie"
    ],
    "minHits": 1
  },
  {
    "id": "practice26-38",
    "field": 4,
    "topic": "Fördermittel",
    "difficulty": 3,
    "type": "free",
    "question": "Vor dem Anschlagen einer Last bemerkst du einen Schnitt im Hebeband; das Kennzeichnungsetikett ist unlesbar. Wie gehst du vor?",
    "solution": "Hebeband nicht verwenden, aussondern beziehungsweise sperren und melden. Nur ein unbeschädigtes, eindeutig gekennzeichnetes geeignetes Anschlagmittel mit ausreichender Tragfähigkeit verwenden.",
    "keywords": [
      "nicht",
      "sperren",
      "kennzeichnung",
      "tragfähigkeit"
    ],
    "minHits": 1
  },
  {
    "id": "practice26-39",
    "field": 8,
    "topic": "Ladeeinheiten",
    "difficulty": 3,
    "type": "number",
    "question": "Eine Ladeeinheit besteht aus einer 22-kg-Palette, 18 Kartons mit jeweils 14 kg Bruttomasse und 3 kg zusätzlichem Sicherungsmaterial. Wie schwer ist die gesamte Ladeeinheit in kg?",
    "solution": "22 + 18 × 14 + 3 = 277 kg. Diese Gesamtmasse ist für die Auswahl der Arbeitsmittel relevant.",
    "answer": 277,
    "tolerance": 0.01
  },
  {
    "id": "practice26-40",
    "field": 8,
    "topic": "Ladungssicherung",
    "difficulty": 3,
    "type": "free",
    "question": "Ein Zurrgurt hat sichtbare Einschnitte und ein unlesbares Etikett. Warum reicht eine scheinbar kräftige Ratsche nicht zur Freigabe?",
    "solution": "Beschädigungen können die Festigkeit herabsetzen, und ohne lesbares Etikett sind die maßgeblichen Kennwerte nicht sicher feststellbar. Gurt nicht benutzen, aussondern und durch ein geeignetes einwandfreies Zurrmittel ersetzen.",
    "keywords": [
      "beschädigung",
      "etikett",
      "kennwerte",
      "ersetzen"
    ],
    "minHits": 1
  },
  {
    "id": "practice26-41",
    "field": 2,
    "topic": "Bestände",
    "difficulty": 3,
    "type": "free",
    "question": "Eine Packung ist falsch am Nachbarlagerplatz abgelegt. Welche Folgen hat das für Kommissionierung und Bestandsführung, und wie korrigierst du den Vorgang?",
    "solution": "Es drohen Suchzeiten, Fehlentnahmen und scheinbare Bestandsdifferenzen. Artikelidentität und Buchung prüfen, Ware nach Freigabe an den richtigen Platz bringen und nötige Umlagerung nachvollziehbar buchen; Ursache melden beziehungsweise abstellen.",
    "keywords": [
      "fehlentnahme",
      "bestand",
      "platz",
      "buchen"
    ],
    "minHits": 1
  },
  {
    "id": "practice26-42",
    "field": 1,
    "topic": "Begleitpapiere",
    "difficulty": 3,
    "type": "free",
    "question": "Bei einer Warenannahme stimmen Artikel und Menge. Welche Angaben hältst du im Wareneingangsbeleg fest, damit die Einlagerung nachvollziehbar bleibt?",
    "solution": "Eindeutige Artikel- und Mengenangaben mit Einheit, Bezug zur Bestellung beziehungsweise Lieferung, Eingangsdatum und Belegnummer sowie Prüfstatus und gegebenenfalls Charge, Abweichungen oder Sperrstatus. Der Lagerplatz wird nach betrieblichem Ablauf ergänzt.",
    "keywords": [
      "artikel",
      "menge",
      "datum",
      "beleg",
      "prüfstatus"
    ],
    "minHits": 1
  },
  {
    "id": "practice26-43",
    "field": 10,
    "topic": "Lean",
    "difficulty": 3,
    "type": "free",
    "question": "Am Packplatz liegen nicht benötigte Werkzeuge, gesuchte Hilfsmittel fehlen und es gibt keinen festen Kontrollrhythmus. Wie gehst du mit der 5S-Methode vor?",
    "solution": "Sortieren: Unnötiges entfernen. Systematisieren: feste Plätze schaffen. Säubern: reinigen und Mängel entdecken. Standardisieren: Regeln und sichtbare Sollzustände festlegen. Selbstdisziplin: Standards regelmäßig einhalten und prüfen.",
    "keywords": [
      "sortieren",
      "systematisieren",
      "säubern",
      "standardisieren",
      "selbstdisziplin"
    ],
    "minHits": 1
  },
  {
    "id": "practice26-44",
    "field": 10,
    "topic": "KVP",
    "difficulty": 3,
    "type": "free",
    "question": "Ein Team will wiederkehrende Falschetikettierungen mit einem A3-Report bearbeiten. Welche Inhalte braucht der Bericht außer einer fertigen Lösung?",
    "solution": "Problem und Istzustand mit Daten, Zielzustand, Ursachenanalyse, geeignete Gegenmaßnahmen mit Verantwortlichen und Terminen sowie Überprüfung der Wirkung und weitere Schritte. A3 unterstützt einen nachvollziehbaren Problemlösungsprozess.",
    "keywords": [
      "istzustand",
      "ziel",
      "ursache",
      "maßnahme",
      "wirkung"
    ],
    "minHits": 1
  },
  {
    "id": "practice26-45",
    "field": 10,
    "topic": "Qualität",
    "difficulty": 3,
    "type": "free",
    "question": "Was unterscheidet eine Qualitätsprüfung einzelner Packstücke von einem Audit des Verpackungsprozesses?",
    "solution": "Die Produktprüfung kontrolliert konkrete Packstücke anhand von Anforderungen. Das Audit untersucht systematisch, ob der Prozess und seine Umsetzung festgelegten Kriterien entsprechen, anhand von nachvollziehbaren Nachweisen; daraus können Verbesserungen folgen.",
    "keywords": [
      "packstück",
      "prozess",
      "kriterien",
      "nachweis"
    ],
    "minHits": 1
  },
  {
    "id": "practice26-46",
    "field": 11,
    "topic": "Beschaffung",
    "difficulty": 3,
    "type": "free",
    "question": "Ein Betrieb führt E-Procurement ein. Welche Schritte einer Beschaffung lassen sich digital unterstützen und welche Kontrolle bleibt trotzdem notwendig?",
    "solution": "Bedarfsmeldung, Freigabe, Katalogauswahl, Bestellung und Rechnungsabgleich lassen sich digital unterstützen. Berechtigungen, sachliche Richtigkeit, Lieferanteneignung und Wareneingang müssen weiterhin kontrolliert werden.",
    "keywords": [
      "bedarf",
      "freigabe",
      "bestellung",
      "rechnung",
      "kontrolle"
    ],
    "minHits": 1
  },
  {
    "id": "practice26-47",
    "field": 9,
    "topic": "KEP",
    "difficulty": 3,
    "type": "free",
    "question": "Warum stellt E-Commerce mit vielen kleinen Kundenbestellungen andere Anforderungen an ein Lager als die Belieferung eines Großkunden mit wenigen Paletten?",
    "solution": "Viele Einzelpositionen und kleine Sendungen verlangen schnelle genaue Kommissionierung, geeignete Versandverpackung, zuverlässige Adress- und Versanddaten sowie einen leistungsfähigen Retourenprozess.",
    "keywords": [
      "einzel",
      "kommissionierung",
      "verpackung",
      "retouren"
    ],
    "minHits": 1
  },
  {
    "id": "practice26-48",
    "field": 9,
    "topic": "Frachtpapiere",
    "difficulty": 3,
    "type": "free",
    "question": "Bei einem Gefahrgutauftrag fehlt die verbindliche Versandklassifizierung. Auf dem Gebinde ist nur ein GHS-Piktogramm. Reicht dieses für die Auswahl der Transportkennzeichnung?",
    "solution": "Nein. GHS-Stoffkennzeichnung und Gefahrguttransportkennzeichnung sind unterschiedliche Systeme. Die erforderliche Versandklassifizierung und Transportangaben müssen mit der zuständigen Stelle beziehungsweise anhand verlässlicher Unterlagen, etwa Abschnitt 14 des Sicherheitsdatenblatts, geklärt werden.",
    "keywords": [
      "nein",
      "unterschied",
      "klassifizierung",
      "14",
      "klären"
    ],
    "minHits": 1
  }
];
