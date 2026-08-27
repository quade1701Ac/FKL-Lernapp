export const learningFields = [
  { id: 1, title: 'Güter annehmen und kontrollieren', icon: '📥', topics: ['Warenannahme', 'Begleitpapiere', 'Mängel'] },
  { id: 2, title: 'Güter lagern', icon: '🏬', topics: ['Lagerarten', 'Bestände', 'Lagerkennzahlen'] },
  { id: 3, title: 'Güter bearbeiten', icon: '🛠️', topics: ['Verpackung', 'Kennzeichnung', 'Mehrwertleistungen'] },
  { id: 4, title: 'Güter im Betrieb transportieren', icon: '🚜', topics: ['Fördermittel', 'Sicherheit', 'Transportwege'] },
  { id: 5, title: 'Güter kommissionieren', icon: '🧺', topics: ['Kommissionierverfahren', 'Belege', 'Fehler'] },
  { id: 6, title: 'Güter verpacken', icon: '📦', topics: ['Packmittel', 'Verpackungsfunktionen', 'Kennzeichnung'] },
  { id: 7, title: 'Touren planen', icon: '🗺️', topics: ['Tourenplanung', 'Fahrzeuge', 'Wirtschaftlichkeit'] },
  { id: 8, title: 'Güter verladen', icon: '🚚', topics: ['Ladungssicherung', 'Lastverteilung', 'Ladeeinheiten'] },
  { id: 9, title: 'Güter versenden', icon: '📨', topics: ['Versandarten', 'Frachtpapiere', 'KEP'] },
  { id: 10, title: 'Logistische Prozesse optimieren', icon: '⚙️', topics: ['KVP', 'Lean', 'Qualität'] },
  { id: 11, title: 'Güter beschaffen', icon: '🛒', topics: ['Beschaffung', 'Bestellverfahren', 'Lieferanten'] },
  { id: 12, title: 'Kennzahlen ermitteln und auswerten', icon: '📊', topics: ['Lagerkennzahlen', 'Kosten', 'Wirtschaftlichkeit'] },
];

const baseQuestions = [
  { id:'1-1', field:1, topic:'Warenannahme', difficulty:1, type:'free', question:'Nenne drei Kontrollen, die bei der Warenannahme vor oder während des Entladens durchgeführt werden sollten.', keywords:['lieferadresse','plombe','beschädigung','menge','frachtbrief','lieferschein','verpackung'], minHits:3, solution:'Zum Beispiel Lieferadresse und Begleitpapiere prüfen, Fahrzeug oder Plombe kontrollieren und Ware auf sichtbare Schäden sowie Mengenabweichungen prüfen.' },
  { id:'1-2', field:1, topic:'Mängel', difficulty:2, type:'free', question:'Eine Lieferung weist äußerlich sichtbare Schäden auf. Welche Schritte leitest du ein?', keywords:['dokumentieren','fotos','frachtführer','quittung','vorbehalt','melden','annahme'], minHits:3, solution:'Schaden dokumentieren, möglichst fotografieren, auf dem Frachtpapier bzw. der Empfangsbestätigung unter Vorbehalt vermerken und den zuständigen Stellen melden.' },
  { id:'1-3', field:1, topic:'Begleitpapiere', difficulty:1, type:'free', question:'Welche Informationen vergleichst du typischerweise zwischen Lieferschein und angelieferter Ware?', keywords:['artikel','menge','lieferant','bestellnummer','empfänger'], minHits:2, solution:'Typisch sind Artikel bzw. Artikelnummer, Menge, Lieferant oder Absender, Bestellnummer und Empfänger.' },
  { id:'2-1', field:2, topic:'Bestände', difficulty:1, type:'free', question:'Was versteht man unter dem Mindestbestand und wozu dient er?', keywords:['reserve','sicherheit','lieferverzögerung','verbrauch','engpass'], minHits:2, solution:'Der Mindestbestand ist die Sicherheitsreserve, die Lieferverzögerungen oder unerwartet hohen Verbrauch überbrücken soll.' },
  { id:'2-2', field:2, topic:'Lagerkennzahlen', difficulty:2, type:'free', question:'Wie berechnet man den Meldebestand?', keywords:['tagesverbrauch','lieferzeit','mindestbestand','multiplizieren','plus'], minHits:3, solution:'Meldebestand = Tagesverbrauch × Lieferzeit + Mindestbestand.' },
  { id:'2-3', field:2, topic:'Lagerarten', difficulty:1, type:'free', question:'Nenne zwei Vorteile einer chaotischen Lagerplatzordnung.', keywords:['auslastung','flexibel','platz','wege','wms','lagerverwaltung'], minHits:2, solution:'Sie ermöglicht eine hohe Flächenauslastung und flexible Lagerplatzvergabe. Voraussetzung ist in der Regel eine zuverlässige Lagerverwaltung.' },
  { id:'3-1', field:3, topic:'Mehrwertleistungen', difficulty:1, type:'free', question:'Was sind Value Added Services im Lager? Nenne zwei Beispiele.', keywords:['zusatzleistung','etikettieren','verpacken','montage','konfektionieren','qualität'], minHits:2, solution:'Value Added Services sind zusätzliche Dienstleistungen zur eigentlichen Lagerung, etwa Etikettieren, Umpacken, Konfektionieren oder einfache Montagearbeiten.' },
  { id:'3-2', field:3, topic:'Kennzeichnung', difficulty:1, type:'free', question:'Warum ist eine eindeutige Kennzeichnung von Gütern im Lager wichtig?', keywords:['identifikation','verwechslung','rückverfolgung','fehler','bestand'], minHits:2, solution:'Sie erleichtert die eindeutige Identifikation, reduziert Verwechslungen und unterstützt Bestandsführung sowie Rückverfolgbarkeit.' },
  { id:'4-1', field:4, topic:'Fördermittel', difficulty:1, type:'free', question:'Worin unterscheidet sich ein stetiges von einem unstetigen Fördermittel?', keywords:['kontinuierlich','unterbrechung','förderband','stapler','einzeln','takt'], minHits:2, solution:'Stetigförderer transportieren Güter kontinuierlich, zum Beispiel Förderbänder. Unstetigförderer arbeiten in einzelnen Transportvorgängen, zum Beispiel Gabelstapler.' },
  { id:'4-2', field:4, topic:'Sicherheit', difficulty:1, type:'free', question:'Nenne drei Grundregeln für den sicheren innerbetrieblichen Transport mit Flurförderzeugen.', keywords:['geschwindigkeit','sicht','last','personen','fahrwege','abstand','gabel'], minHits:3, solution:'Zum Beispiel angepasste Geschwindigkeit, freie Sicht, Last sicher aufnehmen, Personen nicht gefährden und vorgeschriebene Fahrwege nutzen.' },
  { id:'5-1', field:5, topic:'Kommissionierverfahren', difficulty:1, type:'free', question:'Erkläre das Prinzip „Mann-zur-Ware“.', keywords:['kommissionierer','lagerplatz','ware','bewegt','läuft','fährt'], minHits:2, solution:'Beim Mann-zur-Ware-Prinzip bewegt sich der Kommissionierer zum Lagerplatz der Ware und entnimmt sie dort.' },
  { id:'5-2', field:5, topic:'Fehler', difficulty:2, type:'free', question:'Nenne drei typische Kommissionierfehler.', keywords:['menge','artikel','auslassen','verwechseln','beschädigung','falsch'], minHits:3, solution:'Typisch sind Mengenfehler, Artfehler bzw. falscher Artikel, Auslassungsfehler und Zustandsfehler wie beschädigte Ware.' },
  { id:'5-3', field:5, topic:'Kommissionierverfahren', difficulty:2, type:'free', question:'Was bedeutet eine zweistufige Kommissionierung?', keywords:['gesamtmenge','aufträge','sortieren','verteilen','zweite','stufe'], minHits:2, solution:'Zunächst wird die Gesamtmenge für mehrere Aufträge gesammelt. In der zweiten Stufe wird sie auf die einzelnen Kunden- oder Versandaufträge verteilt.' },
  { id:'6-1', field:6, topic:'Verpackungsfunktionen', difficulty:1, type:'free', question:'Nenne drei Funktionen einer Verpackung.', keywords:['schutz','lager','transport','information','verkauf','portion'], minHits:3, solution:'Verpackungen dienen unter anderem dem Schutz, der Lager- und Transportfähigkeit, der Information sowie Verkaufs- oder Portionierungszwecken.' },
  { id:'6-2', field:6, topic:'Packmittel', difficulty:1, type:'free', question:'Was ist der Unterschied zwischen Packmittel und Packhilfsmittel?', keywords:['behältnis','umschließt','karton','hilfsmittel','klebeband','folie'], minHits:2, solution:'Das Packmittel umschließt oder nimmt das Packgut auf, etwa ein Karton. Packhilfsmittel unterstützen die Verpackung, etwa Klebeband, Polster oder Umreifungsband.' },
  { id:'7-1', field:7, topic:'Tourenplanung', difficulty:2, type:'free', question:'Welche Faktoren spielen bei einer wirtschaftlichen Tourenplanung eine Rolle?', keywords:['strecke','zeit','auslastung','gewicht','volumen','termin','kosten'], minHits:3, solution:'Wichtig sind unter anderem Strecke, Fahrzeit, Liefertermine, Fahrzeugauslastung, Gewicht und Volumen sowie die entstehenden Kosten.' },
  { id:'7-2', field:7, topic:'Fahrzeuge', difficulty:1, type:'free', question:'Welche zwei Kapazitätsgrenzen eines Fahrzeugs müssen bei der Tourenplanung besonders beachtet werden?', keywords:['gewicht','nutzlast','volumen','ladevolumen'], minHits:2, solution:'Vor allem zulässige Nutzlast bzw. Gewicht und das verfügbare Ladevolumen.' },
  { id:'8-1', field:8, topic:'Ladungssicherung', difficulty:1, type:'free', question:'Was ist der Unterschied zwischen formschlüssiger und kraftschlüssiger Ladungssicherung?', keywords:['lückenlos','formschluss','anliegen','reibung','zurren','niederzurren','kraftschluss'], minHits:3, solution:'Formschluss verhindert Bewegung durch lückenloses Anlegen oder Blockieren. Kraftschluss erhöht vor allem durch Niederzurren die Reibung zwischen Ladung und Ladefläche.' },
  { id:'8-2', field:8, topic:'Ladeeinheiten', difficulty:1, type:'free', question:'Welche Aufgabe hat eine Ladeeinheit?', keywords:['güter','zusammenfassen','transport','umschlag','lagerung','palette'], minHits:2, solution:'Eine Ladeeinheit fasst Güter so zusammen, dass sie gemeinsam transportiert, gelagert und umgeschlagen werden können, etwa auf einer Palette.' },
  { id:'8-3', field:8, topic:'Lastverteilung', difficulty:2, type:'free', question:'Warum muss bei der Beladung eines Lkw ein Lastverteilungsplan beachtet werden?', keywords:['achslast','gesamtgewicht','fahrverhalten','sicherheit','überlastung'], minHits:2, solution:'Damit zulässige Gesamt- und Achslasten eingehalten werden und das Fahrzeug ein sicheres Fahr- und Bremsverhalten behält.' },
  { id:'9-1', field:9, topic:'KEP', difficulty:1, type:'free', question:'Wofür steht die Abkürzung KEP?', keywords:['kurier','express','paket'], minHits:3, solution:'KEP steht für Kurier-, Express- und Paketdienste.' },
  { id:'9-2', field:9, topic:'Frachtpapiere', difficulty:1, type:'free', question:'Welche Funktion hat ein Frachtbrief grundsätzlich?', keywords:['transport','vertrag','nachweis','absender','empfänger','gut'], minHits:2, solution:'Er dokumentiert wesentliche Angaben zum Transport und dient unter anderem als Nachweis über den Beförderungsauftrag und die transportierten Güter.' },
  { id:'10-1', field:10, topic:'KVP', difficulty:1, type:'free', question:'Was bedeutet KVP und welches Ziel verfolgt es?', keywords:['kontinuierlicher','verbesserungsprozess','ständig','verbessern','prozesse','mitarbeiter'], minHits:2, solution:'KVP bedeutet Kontinuierlicher Verbesserungsprozess. Abläufe sollen durch viele kleine, fortlaufende Verbesserungen optimiert werden.' },
  { id:'10-2', field:10, topic:'Qualität', difficulty:2, type:'free', question:'Nenne die vier Schritte des PDCA-Zyklus.', keywords:['plan','do','check','act'], minHits:4, solution:'Plan, Do, Check, Act: planen, umsetzen, überprüfen und auf Basis der Ergebnisse handeln bzw. standardisieren.' },
  { id:'10-3', field:10, topic:'Lean', difficulty:2, type:'free', question:'Welches Kernziel verfolgt Lean Management?', keywords:['verschwendung','wertschöpfung','prozess','effizienz','kunden'], minHits:2, solution:'Lean Management will Verschwendung reduzieren, wertschöpfende Tätigkeiten stärken und Prozesse effizienter am Kundennutzen ausrichten.' },
  { id:'11-1', field:11, topic:'Bestellverfahren', difficulty:2, type:'free', question:'Beschreibe kurz das Bestellpunktverfahren.', keywords:['bestand','meldebestand','bestellung','unterschreitet','erreicht','auslösen'], minHits:3, solution:'Beim Bestellpunktverfahren wird eine Bestellung ausgelöst, sobald der Lagerbestand den festgelegten Meldebestand erreicht oder unterschreitet.' },
  { id:'11-2', field:11, topic:'Lieferanten', difficulty:2, type:'free', question:'Nenne vier Kriterien, nach denen Lieferanten bewertet werden können.', keywords:['preis','qualität','lieferzeit','termintreue','service','zuverlässigkeit','konditionen'], minHits:4, solution:'Zum Beispiel Preis, Qualität, Lieferzeit, Termintreue, Zuverlässigkeit, Service und Zahlungs- oder Lieferkonditionen.' },
  { id:'12-1', field:12, topic:'Lagerkennzahlen', difficulty:2, type:'free', question:'Wie berechnet sich die Umschlagshäufigkeit eines Lagers?', keywords:['jahresverbrauch','durchschnittlicher','lagerbestand','verbrauch','bestand'], minHits:2, solution:'Umschlagshäufigkeit = Jahresverbrauch bzw. Jahresabgang ÷ durchschnittlicher Lagerbestand.' },
  { id:'12-2', field:12, topic:'Lagerkennzahlen', difficulty:3, type:'free', question:'Was sagt eine hohe Umschlagshäufigkeit grundsätzlich aus?', keywords:['schnell','bestand','gebunden','kapital','lagerdauer','gering'], minHits:2, solution:'Eine hohe Umschlagshäufigkeit bedeutet grundsätzlich, dass Bestände häufig erneuert werden. Die durchschnittliche Lagerdauer und Kapitalbindung fallen tendenziell geringer aus.' },
  { id:'12-3', field:12, topic:'Kosten', difficulty:2, type:'free', question:'Welche typischen Kosten entstehen durch Lagerhaltung?', keywords:['kapital','raum','personal','versicherung','schwund','risiko'], minHits:3, solution:'Typisch sind Kapitalbindungskosten, Raum- und Gebäudekosten, Personalkosten, Versicherungen sowie Kosten durch Schwund, Verderb oder Wertminderung.' },
];

function calc(id, field, topic, difficulty, question, answer, formula, tolerance = 0.01) {
  return { id, field, topic, difficulty, type:'number', question, answer, tolerance, solution:`${formula} Ergebnis: ${formatNumber(answer)}.` };
}

export function createCalculationQuestions(seed = Date.now()) {
  const r = mulberry32(seed % 2147483647);
  const int = (min,max) => Math.floor(r()*(max-min+1))+min;
  const daily = int(18,65), delivery = int(3,8), minStock = int(40,140);
  const annual = int(6000,18000), avg = int(400,1200);
  const start = int(700,1800), end = int(500,1300), inv = int(500,1500);
  const usage = int(7000,16000), orderCost = int(35,90), price = int(18,65), rate = int(8,18);
  const avgStock = (start + end) / 2;
  const inventoryDiff = int(5,35);
  const inventoryActual = inv - inventoryDiff;
  const turnover = annual / avg;
  const storageDays = 360 / turnover;
  const andler = Math.sqrt((200 * usage * orderCost) / (price * rate));
  return [
    calc(`calc-melde-${seed}`,2,'Bestände',2,`Der Tagesverbrauch beträgt ${daily} Stück, die Lieferzeit ${delivery} Tage und der Mindestbestand ${minStock} Stück. Berechne den Meldebestand.`,daily*delivery+minStock,`Meldebestand = ${daily} × ${delivery} + ${minStock} =`),
    calc(`calc-avg-${seed}`,12,'Lagerkennzahlen',1,`Anfangsbestand: ${start} Stück, Endbestand: ${end} Stück. Berechne den einfachen durchschnittlichen Lagerbestand.`,avgStock,`Ø Lagerbestand = (${start} + ${end}) ÷ 2 =`),
    calc(`calc-umschlag-${seed}`,12,'Lagerkennzahlen',2,`Jahresverbrauch: ${annual} Stück, durchschnittlicher Lagerbestand: ${avg} Stück. Berechne die Umschlagshäufigkeit.`,turnover,`Umschlagshäufigkeit = ${annual} ÷ ${avg} =`,0.05),
    calc(`calc-dauer-${seed}`,12,'Lagerkennzahlen',2,`Die Umschlagshäufigkeit beträgt ${formatNumber(turnover)}. Berechne die durchschnittliche Lagerdauer bei 360 Tagen.`,storageDays,`Lagerdauer = 360 ÷ ${formatNumber(turnover)} =`,0.15),
    calc(`calc-andler-${seed}`,11,'Bestellverfahren',3,`Andler-Formel: Jahresbedarf ${usage} Stück, Bestellkosten ${orderCost} €, Einstandspreis ${price} €, Lagerhaltungskostensatz ${rate} %. Berechne die optimale Bestellmenge. Runde auf ganze Stück.`,Math.round(andler),`q = √((200 × ${usage} × ${orderCost}) ÷ (${price} × ${rate})) ≈`,1),
    calc(`calc-inventur-${seed}`,12,'Lagerkennzahlen',1,`Ein Artikelbestand laut Lagerbuch beträgt ${inv} Stück. Bei der Inventur werden ${inventoryActual} Stück gezählt. Wie groß ist die Inventurdifferenz in Stück?`,inventoryDiff,`Inventurdifferenz = ${inv} − ${inventoryActual} =`),
  ];
}

export const questions = baseQuestions;

export function scoreAnswer(answer, q) {
  if (q.type === 'number') {
    const parsed = Number(String(answer).replace(',', '.').replace(/[^0-9.\-]/g,''));
    if (!Number.isFinite(parsed)) return { score:0, hits:[], numeric:true, parsed:null };
    const delta = Math.abs(parsed - q.answer);
    const allowed = Math.max(q.tolerance ?? 0.01, Math.abs(q.answer) * 0.01);
    const score = delta <= allowed ? 100 : delta <= allowed * 3 ? 60 : 0;
    return { score, hits:[], numeric:true, parsed };
  }
  const normalized = String(answer).toLowerCase().replace(/[.,;:!?()]/g, ' ');
  if (!normalized.trim()) return { score: 0, hits: [] };
  const hits = q.keywords.filter(k => normalized.includes(k.toLowerCase()));
  const target = q.minHits || Math.max(2, Math.ceil(q.keywords.length / 2));
  return { score: Math.min(100, Math.round((hits.length / target) * 100)), hits };
}

export function formatNumber(n) {
  return new Intl.NumberFormat('de-DE',{maximumFractionDigits:2}).format(n);
}

function mulberry32(a) {
  return function() {
    let t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
