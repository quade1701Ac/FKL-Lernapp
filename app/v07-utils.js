const STOP = new Set(['der','die','das','den','dem','des','ein','eine','einer','einen','einem','und','oder','ist','sind','wird','werden','bei','mit','für','von','zu','im','in','auf','aus','an','am','als','auch','bzw','z','b','soll','sollte','kann','können','durch','damit','dass','wie','was','warum','welche','welcher','welches','noch','nur','sehr','besser','bessere']);

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
  ['qualität','beschaffenheit','zustand','art'],
  ['lieferzeit','laufzeit'],
  ['termintreue','pünktlich','pünktlichkeit'],
  ['bestand','lagerbestand','vorrat'],
  ['kapitalbindung','kapital','gebunden'],
  ['schnell','kurz','verkürzen','reduzieren','senken'],
  ['weg','wege','laufweg','fahrweg'],
  ['verwechslung','falschlieferung','falscher artikel'],
  ['kennzeichnung','etikett','label','barcode'],
  ['tracking','sendungsverfolgung','nachverfolgung','verfolgen','verfolgt','verfolgbar','verfolgbarkeit'],
  ['status','sendungsstatus','übersicht','transparenz'],
  ['planung','planen','planbar','planbarkeit'],
  ['kunde','kundeninformation','kundeninfo','empfänger'],
  ['zustellung','lieferung','sendung','transport'],
  ['fehler','fehlerquote','abweichung','differenz'],
  ['effizienz','wirtschaftlich','wirtschaftlichkeit','produktivität'],
  ['zeit','dauer','laufzeit','wartezeit'],
];

const CONTEXT_ONLY = new Set(['fahrer','kunde','zustellung','status']);

function norm(s=''){
  return String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[^a-z0-9äöü€%+\- ]/g,' ').replace(/\s+/g,' ').trim();
}
function stem(w){
  let x=norm(w);
  for(const end of ['ungen','ung','keiten','keit','heiten','heit','barkeit','bar','ern','eln','en','er','es','e','n','s']) if(x.length>6&&x.endsWith(end)){x=x.slice(0,-end.length);break}
  return x;
}
function words(s){return norm(s).split(' ').filter(w=>w.length>=4&&!STOP.has(w))}
function groupFor(term){
  const n=norm(term);
  return GROUPS.find(g=>g.some(x=>{const nx=norm(x);return n===nx||n.includes(nx)||nx.includes(n)}));
}
function conceptKey(term){const g=groupFor(term);return g?norm(g[0]):stem(term)}
function relatedTerms(term){const n=norm(term),set=new Set([n]);const g=groupFor(term);if(g)g.forEach(x=>set.add(norm(x)));return [...set]}
function termHit(text,term){
  const nt=norm(text),tokens=words(text).map(stem);
  return relatedTerms(term).some(t=>{const s=stem(t);return nt.includes(t)||tokens.some(w=>s.length>=4&&(w.startsWith(s)||s.startsWith(w)))})
}
function uniqueHits(text,keywords=[]){
  const seen=new Set(),hits=[];
  for(const k of keywords){if(!termHit(text,k))continue;const key=conceptKey(k);if(seen.has(key))continue;seen.add(key);hits.push(k)}
  return hits;
}
function semanticOverlap(answer,solution){
  const a=[...new Set(words(answer).map(stem))],s=[...new Set(words(solution).map(stem))];let count=0;
  for(const aw of a){if(s.some(sw=>aw.length>=4&&(aw.startsWith(sw)||sw.startsWith(aw)))){count++;continue}const ag=groupFor(aw);if(ag&&s.some(sw=>ag.some(x=>{const xs=stem(x);return sw.startsWith(xs)||xs.startsWith(sw)})))count++}
  return count;
}
function isComparisonQuestion(q){const x=norm(q?.question||'');return x.includes('unterschied')||x.includes('unterscheid')||x.includes('gegenuber')||x.includes('im vergleich')}
function requestedAspects(q){
  const x=norm(q?.question||'');
  const numberWords={eins:1,einen:1,eine:1,zwei:2,drei:3,vier:4,fuenf:5,'fünf':5,sechs:6};
  for(const [word,n] of Object.entries(numberWords)) if(new RegExp(`\\b${word}\\b`).test(x)) return n;
  if(isComparisonQuestion(q)) return 2;
  if(q?.minHits) return Math.max(1,q.minHits);
  const concepts=new Set((q?.keywords||[]).map(conceptKey)).size;
  return Math.max(1,Math.min(3,Math.ceil(concepts/2)||1));
}
function creditHits(hits){return hits.filter(h=>!CONTEXT_ONLY.has(conceptKey(h)))}
function roundScore(n){return Math.max(0,Math.min(100,Math.round(n/10)*10))}

export function scoreAnswerV07(answer,q,fallback){
  if(q.type==='number') return fallback(answer,q);
  const text=norm(answer);if(!text)return {score:0,hits:[]};

  const hits=uniqueHits(text,q.keywords||[]);
  const usefulHits=creditHits(hits);
  const overlap=semanticOverlap(answer,q.solution||'');
  const contentWords=[...new Set(words(answer).map(stem))].length;
  const needed=requestedAspects(q);

  // Bewertet werden richtige fachliche Aspekte, nicht bloß Wörter aus der Musterlösung.
  // Kontextwörter wie "Fahrer" oder "Kunde" geben alleine keine Punkte.
  let aspects=usefulHits.length;

  // Eine sauber sinngemäße Formulierung kann einen nicht explizit als Keyword hinterlegten
  // richtigen Aspekt ergänzen. Maximal ein Zusatzaspekt, damit Wortüberschneidungen nicht aufblasen.
  if(contentWords>=4&&overlap>=3&&aspects<needed) aspects++;

  let score=aspects>0?roundScore((Math.min(aspects,needed)/needed)*100):0;

  // Für 100 % muss die Antwort erkennbar vollständig sein. Bei längeren Erklärfragen reicht
  // reines Keyword-Aufzählen nicht ganz aus.
  if(score===100&&needed>=2&&contentWords<4) score=80;

  // Vergleichsfragen müssen beide Seiten fachlich unterscheiden.
  if(isComparisonQuestion(q)){
    if(usefulHits.length<2||overlap<2||contentWords<4) score=Math.min(score,50);
    if(usefulHits.length>=2&&overlap>=3&&contentWords>=5) score=100;
  }

  // Einzelnes Kontextwort oder inhaltsarme Kurzantwort bleibt 0 %.
  if(usefulHits.length===0&&overlap<2) score=0;
  if(contentWords<=1) score=0;

  return {score:Math.min(100,score),hits};
}

export function calculationInfo(q){
  const id=q?.id||'';let formula='';
  if(id.startsWith('calc-melde')) formula='Meldebestand = Tagesverbrauch × Lieferzeit + Mindestbestand';
  else if(id.startsWith('calc-avg')) formula='Ø Lagerbestand = (Anfangsbestand + Endbestand) ÷ 2';
  else if(id.startsWith('calc-umschlag')) formula='Umschlagshäufigkeit = Jahresverbrauch ÷ Ø Lagerbestand';
  else if(id.startsWith('calc-dauer')) formula='Ø Lagerdauer = 360 ÷ Umschlagshäufigkeit';
  else if(id.startsWith('calc-andler')) formula='Optimale Bestellmenge = √((200 × Jahresbedarf × Bestellkosten) ÷ (Einstandspreis × Lagerhaltungskostensatz))';
  else if(id.startsWith('calc-inventur')) formula='Inventurdifferenz = Sollbestand − Istbestand';
  const raw=String(q?.solution||''),parts=raw.split('Ergebnis:');
  return {formula,rechenweg:(parts[0]||'').trim().replace(/=$/,'').trim(),ergebnis:(parts[1]||'').trim()};
}
