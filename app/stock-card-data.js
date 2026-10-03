// Fiktive Übungsbelege; Mengen und Einheiten sind innerhalb eines Falls eindeutig.
export const stockCardCases=[
 {id:'teile',title:'Ersatzteile buchen',article:'LT-240 · Lagerrolle',place:'A-02-03',unit:'Stück',opening:120,movements:[
  {date:'05.10.2026',ref:'WE-241',text:'Annahme freigegeben: 5 Kartons mit je 12 Stück.',incoming:60,outgoing:0},
  {date:'05.10.2026',ref:'KA-108',text:'Kommissionierauftrag: 47 Stück entnommen.',incoming:0,outgoing:47},
  {date:'06.10.2026',ref:'RT-019',text:'Kundenrückgabe: 8 Stück geprüft und für den Lagerbestand freigegeben.',incoming:8,outgoing:0}]},
 {id:'kartons',title:'Verpackungseinheiten umrechnen',article:'PK-610 · Versandkarton',place:'B-01-02',unit:'Stück',opening:250,movements:[
  {date:'05.10.2026',ref:'WE-252',text:'Wareneingang: 4 Bündel mit je 25 Kartons; vollständig freigegeben.',incoming:100,outgoing:0},
  {date:'05.10.2026',ref:'VP-061',text:'Verpackungsauftrag: 86 Kartons verbraucht.',incoming:0,outgoing:86},
  {date:'06.10.2026',ref:'VP-062',text:'Weiterer Verpackungsauftrag: 2 Bündel mit je 25 Kartons verbraucht.',incoming:0,outgoing:50}]},
 {id:'sperre',title:'Verfügbaren Bestand getrennt führen',article:'BT-180 · Befestigungssatz',place:'C-03-01',unit:'Stück',opening:80,movements:[
  {date:'05.10.2026',ref:'WE-260',text:'24 Stück angeliefert: 18 Stück freigegeben und eingelagert, 6 Stück direkt in das getrennte Sperrlager. Diese Fachkarte führt nur den verfügbaren Bestand dieses Lagerplatzes.',incoming:18,outgoing:0},
  {date:'05.10.2026',ref:'KA-122',text:'Auftrag: 35 verfügbare Stück entnommen.',incoming:0,outgoing:35},
  {date:'06.10.2026',ref:'UM-014',text:'Die 6 Stück im Sperrlager wurden geprüft, freigegeben und auf diesen Lagerplatz umgelagert.',incoming:6,outgoing:0}]}
];
export function stockCardSolution(c){let balance=c.opening;return c.movements.map(m=>{balance+=m.incoming-m.outgoing;return {incoming:m.incoming,outgoing:m.outgoing,balance}})}
export function stockValue(raw){if(typeof raw!=='string'||!raw.trim())return null;const value=raw.trim().replace(',','.');if(!/^\d+(?:\.\d+)?$/.test(value))return null;const n=Number(value);return Number.isFinite(n)?n:null}
export function evaluateStockCard(c,entries){const solution=stockCardSolution(c);const rows=solution.map((expected,i)=>{
 const entered=Object.fromEntries(['incoming','outgoing','balance'].map(k=>[k,stockValue(entries[i]?.[k])]));
 const correct=Object.fromEntries(Object.keys(expected).map(k=>[k,entered[k]===expected[k]]));
 // Ein einmaliger Übertragsfehler wird nicht in jeder folgenden Bestandszeile erneut abgezogen.
 const previous=i?stockValue(entries[i-1]?.balance):c.opening;
 const followThrough=!correct.balance&&i>0&&previous!==null&&entered.incoming!==null&&entered.outgoing!==null&&entered.balance===previous+entered.incoming-entered.outgoing;
 const balanceCredit=correct.balance||followThrough&&correct.incoming&&correct.outgoing;
 return {expected,correct,followThrough:!!(followThrough&&balanceCredit),points:Number(correct.incoming)+Number(correct.outgoing)+Number(balanceCredit)};
 });const points=rows.reduce((n,r)=>n+r.points,0),max=solution.length*3;return {rows,points,max,percent:Math.round(points/max*100),exact:rows.every(r=>Object.values(r.correct).every(Boolean))}}
