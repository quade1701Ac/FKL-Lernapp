// Finaler Laufzeit-Audit für den Fragenpool.
// Entfernt bekannte Altlasten und prüft Struktur, Themenzuordnung,
// triviale MC-Aufgaben sowie semantisch sehr ähnliche Fragen.
const EXCLUDED_IDS=new Set([
  'v08-5-11','v08-5-15','v08-5-21','v08-5-25','v08-6-11','v08-6-13','v08-6-17','v08-6-21','v08-6-25',
  'v08-7-11','v09-9-30','v09-9-34','v09-10-30','v09-10-34','v09-11-30','v09-11-34','v09-12-26',
  'qx-1-04','qx-6-02','qx-7-03','qr-9-03','qb13-1-08','qb13-1-12','qb13-2-10','qb14-9-06',
  // sehr einfache Altfragen, deren Inhalt durch stärkere Aufgaben im Pool abgedeckt ist
  'v05-1-11','v05-1-13','v05-1-19','v05-1-25',
  'v05-2-11','v05-2-13','v05-2-20','v05-2-21','v05-2-24',
  'v06-5-01','v06-5-03','v06-5-06','v06-5-10',
  'v06-6-01','v06-6-02','v06-6-05','v06-6-10',
  'v06-7-01','v06-7-02','v06-7-06','v06-7-08','v06-7-09',
  'v06-8-01'
]);
const TOPICS={1:new Set(['Warenannahme','Begleitpapiere','Mängel']),2:new Set(['Lagerarten','Bestände','Lagerkennzahlen']),3:new Set(['Verpackung','Kennzeichnung','Mehrwertleistungen']),4:new Set(['Fördermittel','Sicherheit','Transportwege']),5:new Set(['Kommissionierverfahren','Belege','Fehler']),6:new Set(['Packmittel','Verpackungsfunktionen','Kennzeichnung']),7:new Set(['Tourenplanung','Fahrzeuge','Wirtschaftlichkeit']),8:new Set(['Ladungssicherung','Lastverteilung','Ladeeinheiten']),9:new Set(['Versandarten','Frachtpapiere','KEP']),10:new Set(['KVP','Lean','Qualität']),11:new Set(['Beschaffung','Bestellverfahren','Lieferanten']),12:new Set(['Lagerkennzahlen','Kosten','Wirtschaftlichkeit'])};
const STOP=new Set(['der','die','das','den','dem','des','ein','eine','einer','einem','einen','und','oder','ist','sind','wird','werden','was','wie','warum','welche','welcher','welches','bei','beim','mit','für','von','vor','nach','zu','zur','zum','auf','im','in','am','an','als','auch','nicht','du','drei','vier','zwei','nenn','nenne','erkläre','beschreibe']);
function norm(s=''){return String(s).toLowerCase().replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue').replace(/ß/g,'ss').replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim()}
function tokens(s=''){return new Set(norm(s).split(' ').filter(x=>x.length>3&&!STOP.has(x)))}
function similarity(a,b){const A=tokens(a),B=tokens(b);if(!A.size||!B.size)return 0;let hit=0;A.forEach(x=>{if(B.has(x))hit++});return hit/Math.min(A.size,B.size)}
function validShape(q){if(!q||!q.id||!q.question||!Number.isInteger(q.field)||q.field<1||q.field>12)return false;if(!['free','mc','number','order'].includes(q.type))return false;if(q.type==='mc'){if(!Array.isArray(q.options)||q.options.length<3||!Array.isArray(q.correct)||!q.correct.length||q.correct.some(i=>i<0||i>=q.options.length))return false;const opts=q.options.map(norm);if(new Set(opts).size!==opts.length)return false}if(q.type==='order'&&(!Array.isArray(q.items)||q.items.length<3||new Set(q.items.map(norm)).size!==q.items.length))return false;if(q.type==='number'&&!Number.isFinite(Number(q.answer)))return false;if(q.type==='free'&&(!Array.isArray(q.keywords)||!q.keywords.length||!q.solution))return false;return true}
function validTopic(q){return TOPICS[q.field]?.has(q.topic)}
function tooEasy(q){
  if(q.type!=='mc')return false;
  const text=norm(q.question),d=Number(q.difficulty)||1;
  if(d<=1&&/wofuer steht|was bedeutet|welches beispiel|was ist ein|welcher vorteil|welche kontrolle|wozu dient|was bezeichnet|welche information/.test(text))return true;
  const absurd=(q.options||[]).filter(o=>/lieblingsfarbe|lohnsteuer|urlaubsplanung|bilanzsumme|radioleistung|sitzbezug|arbeitsvertrag|pausenraum|automatisch billiger|verkaufspreis|private handynummer|private telefonnummer|nur roboter|irgendwann am tag|zufaellige reihenfolge|ungueltig machen|bewusst falsch|ohne kontrolle/.test(norm(o))).length;
  return d<=2&&absurd>=2;
}
export function finalAuditQuestions(source=[]){const out=[],ids=new Set(),texts=new Set();for(const q of source){if(EXCLUDED_IDS.has(String(q.id))||!validShape(q)||!validTopic(q)||tooEasy(q))continue;const id=String(q.id),text=norm(q.question);if(ids.has(id)||texts.has(text))continue;const duplicate=out.some(old=>old.field===q.field&&old.topic===q.topic&&old.type===q.type&&similarity(old.question,q.question)>=.88);if(duplicate)continue;ids.add(id);texts.add(text);out.push(q)}return out}
