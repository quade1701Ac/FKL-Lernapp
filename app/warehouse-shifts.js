import {INITIAL,actionsFor,clamp} from './warehouse-engine';

export const SHIFTS=[
 {id:'normal',name:'Normaler Betrieb',description:'Plane Warenannahme und Versand mit zwei Mitarbeitenden.',jobs:[[1,0,18],[3,0,10],[5,0,14],[4,6,24],[2,10,30]]},
 {id:'express',name:'Express-Spitze',description:'Mehrere Expressaufträge treffen kurz hintereinander ein.',jobs:[[3,0,9],[5,0,14],[4,0,22],[3,4,15],[3,8,20],[1,12,30],[5,16,34]]},
 {id:'receiving',name:'Wareneingangsprobleme',description:'Sperrungen und Prüfungen konkurrieren mit dem Versand um Personal.',jobs:[[1,0,14],[2,0,18],[5,0,12],[1,5,23],[4,8,28],[2,12,32]]}
];
export const clock=minute=>`${String(8+Math.floor(minute/60)).padStart(2,'0')}:${String(minute%60).padStart(2,'0')}`;
export function createShift(id='normal'){
 const scenario=SHIFTS.find(s=>s.id===id)||SHIFTS[0];
 const all=scenario.jobs.map(([template,arrival,deadline],i)=>({...INITIAL.find(j=>j.id===template),id:i+1,title:`${INITIAL.find(j=>j.id===template).title} · ${i+1}`,arrival,deadline,late:false}));
 return {scenario:scenario.id,minute:0,jobs:all.filter(j=>j.arrival===0),pending:all.filter(j=>j.arrival>0),total:all.length,workers:[{id:1,name:'Alex',task:null},{id:2,name:'Sam',task:null}],completed:0,delivered:0,late:0,penalty:0,quality:100,safety:100,log:[],done:false};
}
export function assignTask(state,workerId,jobId,label){
 if(state.done)return state;
 const worker=state.workers.find(w=>w.id===workerId),job=state.jobs.find(j=>j.id===jobId);
 if(!worker||worker.task||!job||state.workers.some(w=>w.task?.jobId===jobId))return state;
 const action=actionsFor(job).find(a=>a.label===label);if(!action)return state;
 const duration=action.time||2;
 return {...state,workers:state.workers.map(w=>w.id===workerId?{...w,task:{jobId,action,finish:state.minute+duration}}:w),log:[...state.log,{minute:state.minute,text:`${worker.name}: ${job.title} – ${label} (${duration} min, fertig ${clock(state.minute+duration)}).`,kind:'start'}]};
}
export function tickShift(state){
 if(state.done)return state;
 const minute=state.minute+1,log=[...state.log];let quality=state.quality,safety=state.safety,completed=state.completed,delivered=state.delivered,late=state.late,penalty=state.penalty;
 let jobs=state.jobs.map(j=>({...j}));
 for(const job of jobs)if(!job.late&&minute>job.deadline){job.late=true;late++;const task=state.workers.find(w=>w.task?.jobId===job.id);log.push({minute,kind:'late',text:`${job.title}: Frist ${clock(job.deadline)} überschritten. ${task?`${task.name} bearbeitet „${task.task.action.label}“ seit ${clock(task.task.finish-(task.task.action.time||2))}.`:'Der Vorgang wartete ohne zugewiesene Person.'}`});}
 const workers=state.workers.map(worker=>{
  const task=worker.task;if(!task||task.finish>minute)return worker;
  const job=jobs.find(j=>j.id===task.jobId);if(!job)return {...worker,task:null};
  const a=task.action;penalty+=Math.max(0,-(a.score||0));
  // A later correct action does not erase an earlier quality or safety error.
  quality=clamp(quality+Math.min(0,a.quality||0));safety=clamp(safety+Math.min(0,a.safety||0));
  jobs=a.complete?jobs.filter(j=>j.id!==job.id):jobs.map(j=>j.id===job.id?{...j,...a.next}:j);
  if(a.complete)completed++;delivered+=a.delivered||0;
  log.push({minute,kind:a.bad?'error':'complete',text:`${worker.name} · ${job.title}: ${a.msg}${a.quality<0?` Qualität ${a.quality} Punkte.`:''}${a.safety<0?` Sicherheit ${a.safety} Punkte.`:''}`});
  return {...worker,task:null};
 });
 const arrived=state.pending.filter(j=>j.arrival<=minute),pending=state.pending.filter(j=>j.arrival>minute);
 for(const job of arrived)log.push({minute,kind:'arrival',text:`Eingetroffen: ${job.title}. Frist ${clock(job.deadline)}.`});
 jobs.push(...arrived);
 const done=minute>=40||(!jobs.length&&!pending.length);
 return {...state,minute,jobs,pending,workers,quality,safety,completed,delivered,late,penalty,log,done};
}
export function shiftResult(state){
 const punctuality=clamp(Math.round(100*(state.total-state.late)/state.total)-state.penalty);
 const progress=state.completed/state.total;
 return {punctuality,performance:Math.round((punctuality*.45+state.quality*.3+state.safety*.25)*progress),open:state.total-state.completed};
}
