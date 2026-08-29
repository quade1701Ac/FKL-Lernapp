// Adaptive Fragenauswahl: Schwächen und fällige Wiederholungen werden bevorzugt,
// gleichzeitig bleibt ein fester Zufallsanteil für neue/abwechslungsreiche Fragen erhalten.
import { qualityCheckedQuestions } from './question-quality-filter';
import { finalAuditQuestions } from './question-audit';

function shuffle(a){return [...a].sort(()=>Math.random()-.5)}
function shuffleMc(q){
 if(q?.type!=='mc'||!Array.isArray(q.options)||q.options.length<2)return q;
 const correct=new Set((q.correct||[]).map(Number));
 const mixed=shuffle(q.options.map((text,index)=>({text,wasCorrect:correct.has(index)})));
 return {...q,options:mixed.map(x=>x.text),correct:mixed.map((x,index)=>x.wasCorrect?index:null).filter(x=>x!==null)};
}
function preparePicked(list){return list.map(shuffleMc)}
function checkedPool(qs){return finalAuditQuestions(qualityCheckedQuestions(qs))}
function average(s){return s?.answered?Math.round((s.points||0)/s.answered):null}
function weightFor(q,reviews,stats){
 const review=reviews?.[q.id],field=stats?.[q.field],topic=field?.topics?.[q.topic];let w=1;
 if(!review)w+=3;else{const last=Number(review.lastScore);if(Number.isFinite(last)){if(last<60)w+=7;else if(last<80)w+=4;else if(last<90)w+=1.5;else w-=.25}if(!review.next||review.next<=Date.now()){w+=5;if(review.next){const overdueDays=Math.max(0,(Date.now()-review.next)/86400000);w+=Math.min(3,overdueDays/3)}}const box=Number(review.box)||0;if(box>=4)w-=.5;if(box>=5)w-=.5}
 const fAvg=average(field);if(fAvg!=null&&(field?.answered||0)>=3){if(fAvg<60)w+=3;else if(fAvg<80)w+=1.5;else if(fAvg>=90)w-=.25}
 const tAvg=average(topic);if(tAvg!=null&&(topic?.answered||0)>=2){if(tAvg<60)w+=3;else if(tAvg<80)w+=1.5;else if(tAvg>=90)w-=.25}
 if(q.difficulty>=3)w+=.5;return Math.max(.35,w)
}
function weightedPick(pool,reviews,stats){const weighted=pool.map(q=>({q,w:weightFor(q,reviews,stats)})),total=weighted.reduce((n,x)=>n+x.w,0);let r=Math.random()*total;for(const x of weighted){r-=x.w;if(r<=0)return x.q}return weighted[weighted.length-1]?.q}
export function smartPick(qs,limit,reviews={},stats={},randomShare=.35){
 const checked=checkedPool(qs),unique=[...new Map(checked.map(q=>[String(q.id),q])).values()],target=Math.min(limit,unique.length);if(target<=0)return[];
 const randomCount=Math.min(target,Math.max(1,Math.round(target*randomShare))),randomPart=shuffle(unique).slice(0,randomCount),chosen=[...randomPart],chosenIds=new Set(chosen.map(q=>String(q.id)));let pool=unique.filter(q=>!chosenIds.has(String(q.id)));
 while(chosen.length<target&&pool.length){const q=weightedPick(pool,reviews,stats);if(!q)break;chosen.push(q);const id=String(q.id);pool=pool.filter(x=>String(x.id)!==id)}return preparePicked(shuffle(chosen))
}

// Prüfungssimulation: nicht einfach 30 Zufallsfragen.
// Sie deckt möglichst alle 12 Lernfelder ab und hält gleichzeitig einen Mix aus
// Freitext, MC, Rechnen und Reihenfolge-Aufgaben. Fehlt ein Typ im Pool,
// wird flexibel mit anderen geprüften Aufgaben aufgefüllt.
export function examPick(qs,limit=30){
 const checked=checkedPool(qs),unique=[...new Map(checked.map(q=>[String(q.id),q])).values()],target=Math.min(limit,unique.length);if(target<=0)return[];
 const chosen=[],ids=new Set(),typeCount={free:0,mc:0,number:0,order:0},fieldCount={};
 const typeTargets={free:Math.round(target*.34),mc:Math.round(target*.33),number:Math.max(3,Math.round(target*.20)),order:Math.max(3,Math.round(target*.13))};
 function add(q){if(!q||ids.has(String(q.id)))return false;chosen.push(q);ids.add(String(q.id));typeCount[q.type]=(typeCount[q.type]||0)+1;fieldCount[q.field]=(fieldCount[q.field]||0)+1;return true}
 function bestFrom(pool){const ranked=shuffle(pool).sort((a,b)=>{const aType=(typeTargets[a.type]||0)-(typeCount[a.type]||0),bType=(typeTargets[b.type]||0)-(typeCount[b.type]||0);const aField=2-(fieldCount[a.field]||0),bField=2-(fieldCount[b.field]||0);const aDiff=Number(a.difficulty)||1,bDiff=Number(b.difficulty)||1;return (bField*4+bType*2+bDiff*.25)-(aField*4+aType*2+aDiff*.25)});return ranked[0]}
 // Erst Grundabdeckung: nach Möglichkeit zwei Aufgaben aus jedem Lernfeld.
 for(let field=1;field<=12&&chosen.length<target;field++){
  for(let n=0;n<2&&chosen.length<target;n++){
   const pool=unique.filter(q=>q.field===field&&!ids.has(String(q.id)));if(!pool.length)break;add(bestFrom(pool));
  }
 }
 // Rest nach Typdefizit + noch unterrepräsentierten Lernfeldern auffüllen.
 while(chosen.length<target){const pool=unique.filter(q=>!ids.has(String(q.id)));if(!pool.length)break;add(bestFrom(pool))}
 return preparePicked(shuffle(chosen));
}

export function randomPick(qs,limit){const checked=checkedPool(qs),unique=[...new Map(checked.map(q=>[String(q.id),q])).values()];return preparePicked(shuffle(unique).slice(0,Math.min(limit,unique.length)))}
