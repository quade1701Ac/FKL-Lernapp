import {checkedPool,preparePicked} from './smart-selection';

// Training composition, not a claim about official IHK type quotas.
export const EXAM_AREAS=[
 {name:'Prozesse der Lagerlogistik',fields:[1,2,5,6,9,11,12],size:15,types:{free:5,mc:5,number:3,order:2}},
 {name:'Rationeller & qualitätssichernder Güterumschlag',fields:[3,4,7,8,10],size:9,types:{free:3,mc:3,number:2,order:1}},
 {name:'Wirtschafts- & Sozialkunde',fields:[13],size:6,types:{free:3,mc:3}}
];
function shuffled(items){const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}

export function pickExamArea(questions,area){
 const pool=[...new Map(checkedPool(questions.filter(q=>area.fields.includes(q.field))).map(q=>[String(q.id),q])).values()];
 const fields=shuffled(area.fields),quota={},available={};
 for(const f of fields){quota[f]=0;available[f]=pool.filter(q=>q.field===f).length}
 const target=Math.min(area.size,pool.length);
 // Equal field allocation; randomize who gets the remainder. Exhausted fields
 // donate their places without duplicating a question or stalling selection.
 for(let n=0;n<target;){for(const f of fields){if(n>=target)break;if(quota[f]<available[f]){quota[f]++;n++}}}

 // Small integral flow network: type -> field, respecting both quotas.
 // Residual edges allow an early choice to move when a rare type needs its slot.
 const graph=new Map();
 function edge(a,b,capacity){if(!graph.has(a))graph.set(a,[]);if(!graph.has(b))graph.set(b,[]);const forward={to:b,left:capacity,capacity},back={to:a,left:0,capacity:0};forward.reverse=back;back.reverse=forward;graph.get(a).push(forward);graph.get(b).push(back);return forward}
 const cells=[];
 for(const [type,count] of Object.entries(area.types)){edge('source',`t:${type}`,count);for(const f of fields){const capacity=pool.filter(q=>q.type===type&&q.field===f).length;cells.push({type,field:f,edge:edge(`t:${type}`,`f:${f}`,capacity)})}}
 for(const f of fields)edge(`f:${f}`,'sink',quota[f]);
 while(true){
  const queue=['source'],previous=new Map([['source',null]]);
  for(let i=0;i<queue.length&&!previous.has('sink');i++)for(const e of graph.get(queue[i])||[]){if(e.left>0&&!previous.has(e.to)){previous.set(e.to,{from:queue[i],edge:e});queue.push(e.to)}}
  if(!previous.has('sink'))break;
  for(let at='sink';at!=='source';){const p=previous.get(at);p.edge.left--;p.edge.reverse.left++;at=p.from}
 }
 const chosen=[],ids=new Set(),topics={},fieldCounts={};
 function addFrom(candidates){
  const ordered=shuffled(candidates.filter(q=>!ids.has(String(q.id)))).sort((a,b)=>(topics[`${a.field}:${a.topic}`]||0)-(topics[`${b.field}:${b.topic}`]||0));
  const q=ordered[0];if(!q)return;
  chosen.push(q);ids.add(String(q.id));topics[`${q.field}:${q.topic}`]=(topics[`${q.field}:${q.topic}`]||0)+1;fieldCounts[q.field]=(fieldCounts[q.field]||0)+1;
 }
 for(const cell of cells)for(let n=0;n<cell.edge.capacity-cell.edge.left;n++)addFrom(pool.filter(q=>q.field===cell.field&&q.type===cell.type));
 // If a type is missing, fill from other valid types in the same field.
 for(const f of fields)while((fieldCounts[f]||0)<quota[f])addFrom(pool.filter(q=>q.field===f));
 return preparePicked(shuffled(chosen)).map(q=>({...q,_examArea:area.name}));
}

export function buildWrittenExam(questions){
 const result=EXAM_AREAS.flatMap(area=>{
  const selected=pickExamArea(questions,area);
  if(selected.length!==area.size)throw new Error(`Für „${area.name}“ sind nicht genügend gültige Aufgaben verfügbar.`);
  return selected;
 });
 if(new Set(result.map(q=>String(q.id))).size!==30)throw new Error('Die Prüfung enthält doppelte Aufgabenkennungen.');
 return result;
}
