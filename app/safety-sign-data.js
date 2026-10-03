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

export const safetySigns = [
  ...mandatory.map(([code,label])=>({code,label,kind:'mandatory'})),
  ...prohibited.map(([code,label])=>({code,label,kind:'prohibited'}))
];

export function signImage(code){
  const filename=code.startsWith('D-')?`DIN_4844-2_${code}.svg`:
    code==='WSP001'?'ISO_7010_P048.svg':
    code==='WSM001'?'ISO_7010_M053;_mandatory;_wear_personal_floatation_device_(PFD)_(lifejacket).svg':`ISO_7010_${code}.svg`;
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
