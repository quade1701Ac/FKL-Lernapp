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
export function randomPick(qs,limit){const checked=checkedPool(qs),unique=[...new Map(checked.map(q=>[String(q.id),q])).values()];return preparePicked(shuffle(unique).slice(0,Math.min(limit,unique.length)))}
