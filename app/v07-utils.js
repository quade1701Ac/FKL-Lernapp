const STOP = new Set(['der','die','das','den','dem','des','ein','eine','einer','einen','einem','und','oder','ist','sind','wird','werden','bei','mit','für','von','zu','im','in','auf','aus','an','am','als','auch','bzw','z','b','soll','sollte','kann','können','durch','damit','dass','wie','was','warum','welche','welcher','welches']);

const GROUPS = [
  ['schaden','beschädigung','beschädigt','defekt'],
  ['dokumentieren','vermerken','vermerk','festhalten','notieren','eintragen'],
  ['foto','fotos','fotografieren','bild','bilder'],
  ['fahrer','frachtführer','spediteur'],
  ['nachweis','beweis','belegen','reklamation','anspruch'],
  ['erschweren','schwerer','schwierig','problematisch'],
  ['menge','anzahl','stückzahl','packstücke','fehlmenge','mengendifferenz'],
  ['prüfen','kontrollieren','abgleichen','vergleich','vergleichen'],
  ['melden','informieren','benachrichtigen'],
  ['reserve','sicherheit','puffer','sicherheitsbestand','mindestbestand'],
  ['kosten','aufwand','mehrkosten'],
  ['qualität','fehlerfrei','mangel'],
  ['lieferzeit','laufzeit'],
  ['termintreue','pünktlich','pünktlichkeit'],
  ['bestand','lagerbestand','vorrat'],
  ['kapitalbindung','kapital','gebunden'],
  ['schnell','kurz','verkürzen','reduzieren','senken'],
  ['weg','wege','laufweg','fahrweg'],
  ['verwechslung','falschlieferung','falscher artikel'],
  ['kennzeichnung','etikett','label','barcode'],
];

function norm(s=''){
  return String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[^a-z0-9äöü€%+\- ]/g,' ').replace(/\s+/g,' ').trim();
}
function stem(w){
  let x=norm(w);
  for(const end of ['ungen','ung','keiten','keit','heiten','heit','ern','en','er','es','e','n','s']) if(x.length>6&&x.endsWith(end)){x=x.slice(0,-end.length);break}
  return x;
}
function words(s){return norm(s).split(' ').filter(w=>w.length>=4&&!STOP.has(w))}
function relatedTerms(term){
  const n=norm(term); const set=new Set([n]);
  for(const g of GROUPS) if(g.some(x=>n.includes(norm(x))||norm(x).includes(n))) g.forEach(x=>set.add(norm(x)));
  return [...set];
}
function termHit(text,term){
  const nt=norm(text); const tokens=words(text).map(stem);
  return relatedTerms(term).some(t=>nt.includes(t)||tokens.some(w=>{const s=stem(t);return s.length>=4&&(w.startsWith(s)||s.startsWith(w))}));
}

export function scoreAnswerV07(answer,q,fallback){
  if(q.type==='number') return fallback(answer,q);
  const text=norm(answer); if(!text) return {score:0,hits:[]};
  const hits=(q.keywords||[]).filter(k=>termHit(text,k));
  const target=q.minHits||Math.max(2,Math.ceil((q.keywords||[]).length/2));
  let score=Math.min(100,Math.round((hits.length/Math.max(1,target))*100));

  // Zusätzlicher Bedeutungsabgleich mit der Musterlösung. Dadurch werden sinnvolle
  // Formulierungen erkannt, auch wenn nicht exakt die hinterlegten Schlüsselwörter fallen.
  const aStems=[...new Set(words(answer).map(stem))];
  const sStems=[...new Set(words(q.solution||'').map(stem))];
  const overlap=aStems.filter(a=>sStems.some(s=>a.length>=4&&(a.startsWith(s)||s.startsWith(a)))).length;
  if(overlap>=3) score=Math.max(score,80);
  else if(overlap===2) score=Math.max(score,70);
  else if(overlap===1&&hits.length>=1) score=Math.max(score,55);

  // Kurze, aber inhaltlich klare Antworten nicht künstlich abstrafen.
  if(hits.length>=1&&text.length>=20&&score<60) score=60;
  if(hits.length>=2&&score<70) score=70;
  return {score:Math.min(100,score),hits};
}

export function calculationInfo(q){
  const id=q?.id||'';
  let formula='';
  if(id.startsWith('calc-melde')) formula='Meldebestand = Tagesverbrauch × Lieferzeit + Mindestbestand';
  else if(id.startsWith('calc-avg')) formula='Ø Lagerbestand = (Anfangsbestand + Endbestand) ÷ 2';
  else if(id.startsWith('calc-umschlag')) formula='Umschlagshäufigkeit = Jahresverbrauch ÷ Ø Lagerbestand';
  else if(id.startsWith('calc-dauer')) formula='Ø Lagerdauer = 360 ÷ Umschlagshäufigkeit';
  else if(id.startsWith('calc-andler')) formula='Optimale Bestellmenge = √((200 × Jahresbedarf × Bestellkosten) ÷ (Einstandspreis × Lagerhaltungskostensatz))';
  else if(id.startsWith('calc-inventur')) formula='Inventurdifferenz = Sollbestand − Istbestand';
  const raw=String(q?.solution||'');
  const parts=raw.split('Ergebnis:');
  return {formula,rechenweg:(parts[0]||'').trim().replace(/=$/,'').trim(),ergebnis:(parts[1]||'').trim()};
}
