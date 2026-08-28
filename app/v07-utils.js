const STOP = new Set(['der','die','das','den','dem','des','ein','eine','einer','einen','einem','und','oder','ist','sind','wird','werden','bei','mit','für','von','zu','im','in','auf','aus','an','am','als','auch','bzw','z','b','soll','sollte','kann','können','durch','damit','dass','wie','was','warum','welche','welcher','welches','noch','nur','sehr','besser','bessere']);

const GROUPS = [
  ['schaden','beschädigung','beschädigt','defekt'],['dokumentieren','vermerken','vermerk','festhalten','notieren','eintragen'],['foto','fotos','fotografieren','bild','bilder'],['fahrer','frachtführer','spediteur'],['nachweis','beweis','belegen','reklamation','anspruch'],['erschweren','schwerer','schwierig','problematisch'],['menge','anzahl','stückzahl','packstücke','fehlmenge','mengendifferenz'],['prüfen','kontrollieren','abgleichen','vergleich','vergleichen'],['melden','informieren','benachrichtigen'],['reserve','sicherheit','puffer','sicherheitsbestand','mindestbestand'],['kosten','aufwand','mehrkosten'],['qualität','beschaffenheit','zustand','art'],['lieferzeit','laufzeit'],['termintreue','pünktlich','pünktlichkeit','verspätung','verspaetung','verzögerung','verzoegerung','zu spät','zu spaet'],['bestand','lagerbestand','vorrat'],['kapitalbindung','kapital','gebunden'],['schnell','kurz','verkürzen','reduzieren','senken'],['weg','wege','laufweg','fahrweg'],['verwechslung','falschlieferung','falscher artikel','fehlleitung','falsche adresse','falsch zugeordnet','falsche zuordnung'],['kennzeichnung','etikett','label','barcode'],['tracking','sendungsverfolgung','nachverfolgung','verfolgen','verfolgt','verfolgbar','verfolgbarkeit'],['status','sendungsstatus','übersicht','transparenz'],['planung','planen','planbar','planbarkeit'],['kunde','kundeninformation','kundeninfo','empfänger'],['zustellung','lieferung','sendung','transport'],['fehler','fehlerquote','abweichung','differenz'],['effizienz','wirtschaftlich','wirtschaftlichkeit','produktivität'],['zeit','dauer','laufzeit','wartezeit'],['verlust','verloren','verschwunden','abhanden'],
];
const CONTEXT_ONLY = new Set(['fahrer','kunde','zustellung','status']);
const NEGATION = /\b(nicht|kein|keine|keinen|keinem|keiner|niemals|nie|unnötig|ueberfluessig|überflüssig|ignorieren|egal)\b/;
const CONTRADICTION = /\b(immer|grundsätzlich|grundsaetzlich|automatisch)\b.{0,28}\b(erlaubt|egal|richtig|sicher|unproblematisch)\b|\b(ignorieren|einfach weiter|trotzdem einlagern|trotzdem verladen|ohne prüfung|ohne pruefung)\b/;
const NON_ANSWER = /^(keine ahnung|keine idee|weiss ich nicht|weiß ich nicht|kp|ka|keine|nichts|egal|keine antwort|keinen plan|keine plan|keine ahnung leider)[.! ]*$/;
const KEYWORD_DUMP_SEPARATORS = /[,;/|]/g;
function norm(s=''){return String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[^a-z0-9äöü€%+\- ]/g,' ').replace(/\s+/g,' ').trim()}
function stem(w){let x=norm(w);for(const end of ['ungen','ung','keiten','keit','heiten','heit','barkeit','bar','ern','eln','en','er','es','e','n','s'])if(x.length>6&&x.endsWith(end)){x=x.slice(0,-end.length);break}return x}
function words(s){return norm(s).split(' ').filter(w=>w.length>=4&&!STOP.has(w))}
function groupFor(term){const n=norm(term);return GROUPS.find(g=>g.some(x=>{const nx=norm(x);return n===nx||n.includes(nx)||nx.includes(n)}))}
function conceptKey(term){const g=groupFor(term);return g?norm(g[0]):stem(term)}
function relatedTerms(term){const n=norm(term),set=new Set([n]);const g=groupFor(term);if(g)g.forEach(x=>set.add(norm(x)));return [...set]}
function termHit(text,term){const nt=norm(text),tokens=words(text).map(stem);return relatedTerms(term).some(t=>{const s=stem(t);return nt.includes(t)||tokens.some(w=>s.length>=4&&(w.startsWith(s)||s.startsWith(w)))})}
function uniqueHits(text,keywords=[]){const seen=new Set(),hits=[];for(const k of keywords){if(!termHit(text,k))continue;const key=conceptKey(k);if(seen.has(key))continue;seen.add(key);hits.push(k)}return hits}
function semanticOverlap(answer,solution){const a=[...new Set(words(answer).map(stem))],s=[...new Set(words(solution).map(stem))];let count=0;for(const aw of a){if(s.some(sw=>aw.length>=4&&(aw.startsWith(sw)||sw.startsWith(aw)))){count++;continue}const ag=groupFor(aw);if(ag&&s.some(sw=>ag.some(x=>{const xs=stem(x);return sw.startsWith(xs)||xs.startsWith(sw)})))count++}return count}
function isComparisonQuestion(q){const x=norm(q?.question||'');return x.includes('unterschied')||x.includes('unterscheid')||x.includes('gegenuber')||x.includes('im vergleich')}
function isExplanationQuestion(q){const x=norm(q?.question||'');return /\b(warum|begrunde|begruende|erklare|erklaere|erlautere|erlaeutere|beschreibe|wie gehst du|wie reagierst du|wie bewertest du)\b/.test(x)}
function explicitRequestedCount(q){const x=norm(q?.question||'');const numberWords={eins:1,einen:1,eine:1,zwei:2,drei:3,vier:4,funf:5,fuenf:5,sechs:6};const np='(eins|einen|eine|zwei|drei|vier|funf|fuenf|sechs|[1-6])';for(const p of [new RegExp(`\\b(?:nenne|nenn|gib|beschreibe|erlaeutere|erklare|erklaere|zeige|formuliere)\\s+(?:je\\s+)?${np}\\b`),new RegExp(`\\b${np}\\s+(?:mogliche\\s+|moegliche\\s+)?(?:folgen|grunde|gruende|ursachen|vorteile|nachteile|massnahmen|maßnahmen|kriterien|schritte|beispiele|ziele|risiken|punkte|faktoren|anforderungen|kostenarten|fehler)\\b`)]){const m=x.match(p);if(m){const r=m[1];return /^\d$/.test(r)?Number(r):(numberWords[r]||null)}}return null}
function requestedAspects(q){const explicit=explicitRequestedCount(q);if(explicit)return explicit;if(isComparisonQuestion(q))return 2;if(q?.minHits)return Math.max(1,q.minHits);const concepts=new Set((q?.keywords||[]).map(conceptKey)).size;return Math.max(1,Math.min(3,Math.ceil(concepts/2)||1))}
function creditHits(hits){return hits.filter(h=>!CONTEXT_ONLY.has(conceptKey(h)))}
function roundScore(n){return Math.max(0,Math.min(100,Math.round(n/10)*10))}
function looksLikeKeywordDump(raw,contentWords,usefulHits,q){if(explicitRequestedCount(q))return false;const separators=(String(raw).match(KEYWORD_DUMP_SEPARATORS)||[]).length,hasSentence=/[.!?]|\b(weil|damit|deshalb|dadurch|anschließend|zuerst|danach|wenn|um)\b/i.test(String(raw));return usefulHits>=2&&contentWords<=Math.max(4,usefulHits+1)&&separators>=usefulHits-1&&!hasSentence}
function hasSuspiciousNegation(answer,hits){const a=norm(answer);if(!NEGATION.test(a)||!hits.length)return false;return hits.some(k=>relatedTerms(k).some(t=>{const idx=a.indexOf(t);if(idx<0)return false;const left=a.slice(Math.max(0,idx-28),idx),right=a.slice(idx+t.length,idx+t.length+28);return NEGATION.test(left)||NEGATION.test(right)}))}
function enumerationParts(answer){return String(answer).split(/[,;\n]|\s+und\s+/i).map(norm).filter(x=>words(x).length>0)}
function enumerationCredit(answer,q){const requested=explicitRequestedCount(q);if(!requested)return null;const parts=enumerationParts(answer),used=new Set();let valid=0;for(const part of parts){const hs=creditHits(uniqueHits(part,q.keywords||[]));const fresh=hs.find(h=>!used.has(conceptKey(h)));if(fresh){used.add(conceptKey(fresh));valid++}}return Math.min(requested,valid)}
function clearlyNonsense(text,hits,overlap){const a=norm(text);if(NON_ANSWER.test(a))return true;if(words(a).length<=2&&hits.length===0)return true;if(words(a).length>=3&&hits.length===0&&overlap===0)return true;return false}
export function scoreAnswerV07(answer,q,fallback){
 if(q.type==='number')return fallback(answer,q);const text=norm(answer);if(!text)return {score:0,hits:[]};
 const hits=uniqueHits(text,q.keywords||[]),usefulHits=creditHits(hits),overlap=semanticOverlap(answer,q.solution||''),contentWords=[...new Set(words(answer).map(stem))].length,needed=requestedAspects(q);
 if(clearlyNonsense(answer,usefulHits,overlap))return {score:0,hits};
 const enumCredit=enumerationCredit(answer,q);let aspects=enumCredit==null?usefulHits.length:enumCredit;
 // Semantischer Bonus nur bei substanziellen Erklärantworten. Er darf keine fehlenden
 // ausdrücklich verlangten Aufzählungspunkte künstlich ersetzen.
 if(enumCredit==null&&contentWords>=7&&overlap>=4&&aspects<needed)aspects++;
 let score=aspects>0?roundScore((Math.min(aspects,needed)/needed)*100):0;
 if(score===100&&needed>=2&&contentWords<5&&!explicitRequestedCount(q))score=80;
 if(looksLikeKeywordDump(answer,contentWords,usefulHits,q))score=Math.min(score,50);
 if(isExplanationQuestion(q)&&!explicitRequestedCount(q)&&score>=80&&contentWords<6)score=Math.min(score,70);
 if(isComparisonQuestion(q)){if(usefulHits.length<2||overlap<2||contentWords<5)score=Math.min(score,50);if(usefulHits.length>=2&&overlap>=4&&contentWords>=6)score=100}
 if(hasSuspiciousNegation(answer,usefulHits))score=Math.min(score,20);
 if(CONTRADICTION.test(text)&&overlap<5)score=Math.min(score,20);
 if(usefulHits.length===0&&overlap<3)score=0;if(contentWords<=1)score=0;
 return {score:Math.min(100,score),hits};
}
export function calculationInfo(q){const id=q?.id||'';let formula='';if(id.startsWith('calc-melde'))formula='Meldebestand = Tagesverbrauch × Lieferzeit + Mindestbestand';else if(id.startsWith('calc-avg'))formula='Ø Lagerbestand = (Anfangsbestand + Endbestand) ÷ 2';else if(id.startsWith('calc-umschlag'))formula='Umschlagshäufigkeit = Jahresverbrauch ÷ Ø Lagerbestand';else if(id.startsWith('calc-dauer'))formula='Ø Lagerdauer = 360 ÷ Umschlagshäufigkeit';else if(id.startsWith('calc-andler'))formula='Optimale Bestellmenge = √((200 × Jahresbedarf × Bestellkosten) ÷ (Einstandspreis × Lagerhaltungskostensatz))';else if(id.startsWith('calc-inventur'))formula='Inventurdifferenz = Sollbestand − Istbestand';const raw=String(q?.solution||''),parts=raw.split('Ergebnis:');return {formula,rechenweg:(parts[0]||'').trim().replace(/=$/,'').trim(),ergebnis:(parts[1]||'').trim()}}
