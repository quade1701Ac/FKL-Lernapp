// Zeichen und Bezeichnungen nach der BGHM-Übersicht für Sicherheitszeichen.
// Die Grafiken werden von Wikimedia Commons geladen; der Link führt zur Dateiseite.
const mandatory = [
  ['M001','Allgemeines Gebotszeichen'],['M003','Gehörschutz benutzen'],
  ['M004','Augenschutz benutzen'],['M008','Fußschutz benutzen'],
  ['M009','Handschutz benutzen'],['M010','Schutzkleidung benutzen'],
  ['M011','Hände waschen'],['M012','Handlauf benutzen'],
  ['M013','Gesichtsschutz benutzen'],['M014','Kopfschutz benutzen'],
  ['M015','Warnweste benutzen'],['M017','Atemschutz benutzen'],
  ['M018','Auffanggurt benutzen'],['M020','Rückhaltesystem benutzen'],
  ['M021','Vor Wartung oder Reparatur freischalten'],
  ['M022','Hautschutzmittel benutzen'],['M023','Übergang benutzen'],
  ['M024','Fußgängerweg benutzen'],['M026','Schutzschürze benutzen'],
  ['WSM001','Rettungsweste benutzen']
];
const prohibited = [
  ['D-P006','Zutritt für Unbefugte verboten'],
  ['D-P022','Besteigen für Unbefugte verboten'],
  ['P001','Allgemeines Verbotszeichen'],['P002','Rauchen verboten'],
  ['P003','Keine offene Flamme; Feuer, offene Zündquelle und Rauchen verboten'],
  ['P004','Für Fußgänger verboten'],['P005','Kein Trinkwasser'],
  ['P006','Für Flurförderzeuge verboten'],
  ['P007','Kein Zutritt für Personen mit Herzschrittmachern'],
  ['P010','Berühren verboten'],['P011','Mit Wasser löschen verboten'],
  ['P012','Keine schweren Lasten'],['P013','Eingeschaltete Mobiltelefone verboten'],
  ['P014','Kein Zutritt für Personen mit Implantaten'],
  ['P015','Hineinfassen verboten'],['P016','Mit Wasser spritzen verboten'],
  ['P020','Aufzug im Brandfall nicht benutzen'],
  ['P021','Mitführen von Hunden verboten'],['P022','Essen und Trinken verboten'],
  ['P023','Abstellen oder Lagern verboten'],['P024','Betreten der Fläche verboten'],
  ['P027','Personenbeförderung verboten'],
  ['P028','Benutzen von Handschuhen verboten'],['P031','Schalten verboten'],
  ['P042','Für schwangere Frauen verboten'],['WSP001','Laufen verboten']
];

export const signKinds = [
 {id:'mandatory',label:'Gebote',name:'Gebot',mark:'●',rule:'Blauer Kreis · vorgeschriebene Handlung'},
 {id:'prohibited',label:'Verbote',name:'Verbot',mark:'⊘',rule:'Roter Kreis mit Schrägbalken · untersagte Handlung'},
 {id:'warning',label:'Warnung',name:'Warnung',mark:'▲',rule:'Gelbes Dreieck · Gefahr beachten'},
 {id:'rescue',label:'Rettung',name:'Rettung',mark:'✚',rule:'Grünes Quadrat oder Rechteck · Fluchtweg oder Hilfe'},
 {id:'fire',label:'Brandschutz',name:'Brandschutz',mark:'▣',rule:'Rotes Quadrat oder Rechteck · Brandbekämpfung'},
 {id:'ghs',label:'Gefahrstoffe',name:'GHS',mark:'◇',rule:'Rote Raute · Gefahren eines Stoffes oder Gemisches'}
];
const warning = [
 ['W001','Allgemeines Warnzeichen'],['W002','Warnung vor explosionsgefährlichen Stoffen'],
 ['W007','Warnung vor Hindernissen am Boden'],['W008','Warnung vor Absturzgefahr'],
 ['W009','Warnung vor Biogefährdung'],['W010','Warnung vor niedriger Temperatur / Frost'],
 ['W011','Warnung vor Rutschgefahr'],['W012','Warnung vor elektrischer Spannung'],
 ['W014','Warnung vor Flurförderzeugen'],['W015','Warnung vor schwebender Last'],
 ['W016','Warnung vor giftigen Stoffen'],['W017','Warnung vor heißer Oberfläche'],
 ['W018','Warnung vor automatischem Anlauf'],['W019','Warnung vor Quetschgefahr'],
 ['W021','Warnung vor feuergefährlichen Stoffen'],['W023','Warnung vor ätzenden Stoffen'],
 ['W024','Warnung vor Handverletzungen'],['W028','Warnung vor brandfördernden Stoffen'],
 ['W029','Warnung vor Gasflaschen']
];
const rescue = [
 ['E001','Rettungsweg / Notausgang (links)'],['E002','Rettungsweg / Notausgang (rechts)'],
 ['E003','Erste Hilfe'],['E004','Notruftelefon'],['E007','Sammelstelle'],
 ['E009','Arzt'],['E010','Automatisierter Externer Defibrillator (AED)'],
 ['E011','Augenspüleinrichtung'],['E012','Notdusche'],['E013','Krankentrage']
];
const fire = [
 ['F001','Feuerlöscher'],['F002','Löschschlauch'],['F003','Feuerleiter'],
 ['F004','Mittel und Geräte zur Brandbekämpfung'],['F005','Brandmelder'],['F006','Brandmeldetelefon']
];
// GHS-Piktogramme: einzelne Gefahrenkategorien und Maßnahmen ergeben sich erst aus dem vollständigen Etikett und Sicherheitsdatenblatt.
const ghs = [
 ['GHS01','Explodierende Bombe · explosionsgefährlich'],
 ['GHS02','Flamme · unter anderem entzündbar'],
 ['GHS03','Flamme über Kreis · oxidierend / brandfördernd'],
 ['GHS04','Gasflasche · Gase unter Druck'],
 ['GHS05','Ätzwirkung · unter anderem schwere Haut- und Augenschäden'],
 ['GHS06','Totenkopf · akute Toxizität (schwere Kategorien)'],
 ['GHS07','Ausrufezeichen · unter anderem reizend oder gesundheitsschädlich'],
 ['GHS08','Gesundheitsgefahr · unter anderem krebserzeugend'],
 ['GHS09','Umwelt · gewässergefährdend']
];

export const safetySigns = [
  ...mandatory.map(([code,label])=>({code,label,kind:'mandatory'})),
  ...prohibited.map(([code,label])=>({code,label,kind:'prohibited'})),
  ...warning.map(([code,label])=>({code,label,kind:'warning'})),
  ...rescue.map(([code,label])=>({code,label,kind:'rescue'})),
  ...fire.map(([code,label])=>({code,label,kind:'fire'})),
  ...ghs.map(([code,label])=>({code,label,kind:'ghs'}))
];

export function signImage(code){
  const ghsFiles={GHS01:'GHS-pictogram-explos.svg',GHS02:'GHS-pictogram-flamme.svg',GHS03:'GHS-pictogram-rondflam.svg',GHS04:'GHS-pictogram-bottle.svg',GHS05:'GHS-pictogram-acid.svg',GHS06:'GHS-pictogram-skull.svg',GHS07:'GHS-pictogram-exclam.svg',GHS08:'GHS-pictogram-silhouette.svg',GHS09:'GHS-pictogram-pollu.svg'};
  const filename=ghsFiles[code]|| (code.startsWith('D-')?`DIN_4844-2_${code}.svg`:
    code==='WSP001'?'ISO_7010_P048.svg':
    code==='WSM001'?'ISO_7010_M053;_mandatory;_wear_personal_floatation_device_(PFD)_(lifejacket).svg':`ISO_7010_${code}.svg`);
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(filename)}`;
}

export function shuffledSigns(items,random=Math.random){
  const result=[...items];
  for(let i=result.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[result[i],result[j]]=[result[j],result[i]]}
  return result;
}

export function signOptions(sign,pool,random=Math.random){
  const others=shuffledSigns(pool.filter(item=>item.code!==sign.code&&item.label!==sign.label),random).slice(0,3);
  return shuffledSigns([sign,...others],random);
}
