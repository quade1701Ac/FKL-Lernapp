'use client';
import {useMemo,useState} from 'react';

import { AREAS, clamp, cloneInitial, actionsFor, advanceJobs, shiftPerformance } from './warehouse-engine';

export default function WarehouseTycoon({onClose}){
 const [minute,setMinute]=useState(0),[jobs,setJobs]=useState(cloneInitial),[selected,setSelected]=useState(null),[score,setScore]=useState(100),[quality,setQuality]=useState(100),[safety,setSafety]=useState(100),[delivered,setDelivered]=useState(0),[log,setLog]=useState([]),[done,setDone]=useState(false);
 const job=jobs.find(j=>j.id===selected);const clock=`${String(8+Math.floor(minute/60)).padStart(2,'0')}:${String(minute%60).padStart(2,'0')}`;
 const open=jobs.length;const performance=useMemo(()=>shiftPerformance(score,quality,safety,jobs.length),[score,quality,safety,jobs.length]);
 const actions=actionsFor(job);
 function addLogs(entries){setLog(l=>[...entries,...l])}
 function act(action){
  if(done||!job||!action)return;
  const transition=advanceJobs(jobs,job.id,action.label);
  if(!transition)return;
  const {time,late,nextJobs}=transition;
  setJobs(nextJobs);setMinute(m=>m+time);setSelected(null);
  if(action.score)setScore(s=>clamp(s+action.score));
  if(action.quality)setQuality(q=>clamp(q+action.quality));
  if(action.safety)setSafety(s=>clamp(s+action.safety));
  if(action.delivered)setDelivered(d=>d+action.delivered);
  if(late)setScore(s=>clamp(s-late*8));
  const entries=[{time:clock,text:action.msg,bad:!!action.bad}];
  if(late)entries.unshift({time:clock,text:`${late} Vorgang${late>1?'e':''} hat die Frist überschritten.`,bad:true});
  addLogs(entries);
  if(minute+time>=40||nextJobs.length===0)setDone(true);
 }
 function restart(){setMinute(0);setJobs(cloneInitial());setSelected(null);setScore(100);setQuality(100);setSafety(100);setDelivered(0);setLog([]);setDone(false)}
 return <section className="pressure"><header className="pressureHead"><div><span>PRAXIS-SIMULATION</span><h1>🔥 Lager unter Druck</h1><p>Vorgänge durchlaufen echte Prozessschritte. Jede Aktion verändert ihren Zustand.</p></div><button onClick={onClose}>← Praxiswelt</button></header>
 <div className="pressureHud"><div><small>UHRZEIT</small><b>{clock}</b></div><div><small>OFFEN</small><b>{open}</b></div><div><small>TERMINE</small><b>{score}%</b></div><div><small>QUALITÄT</small><b>{quality}%</b></div><div><small>SICHERHEIT</small><b>{safety}%</b></div></div>
 {!done?<><div className="warehouseMap">{AREAS.map(a=><section key={a.id} className="warehouseArea"><header><span>{a.icon}</span><b>{a.name}</b><small>{jobs.filter(j=>j.area===a.id).length}</small></header><div>{jobs.filter(j=>j.area===a.id).map(j=><button key={j.id} className={`${selected===j.id?'active ':''}${j.due<=5?'urgent':''}`} onClick={()=>setSelected(j.id)}><span>{j.icon}</span><div><b>{j.title}</b><small>{j.text}</small></div><em>{j.due>=0?`${j.due} min`:'ÜBERFÄLLIG'}</em></button>)}</div></section>)}</div>
 {job?<aside className="jobPanel"><div><small>AKTIVER VORGANG</small><h2>{job.icon} {job.title}</h2><p>{job.text}</p></div><div className="jobActions">{actions.map(a=><button key={a.label} onClick={()=>act(a)}>{a.label} · {a.time||2} min</button>)}</div><small className="processHint">Nur Aktionen, die zum aktuellen Prozessschritt passen, sind verfügbar.</small></aside>:<div className="pressureHint">👆 Wähle einen Vorgang im Lager aus. Fristen laufen mit jeder Aktion weiter.</div>}
 <div className="pressureLog"><b>Schichtprotokoll</b>{log.length?log.map((l,i)=><p key={i} className={l.bad?'bad':''}><span>{l.time}</span>{l.text}</p>):<p>Noch keine Aktionen.</p>}</div><button className="finishShift" onClick={()=>setDone(true)}>Schicht vorzeitig auswerten</button></>:<article className="pressureEnd"><span>SCHICHT BEENDET</span><h2>{performance}% Schichtleistung</h2><div><p><b>{delivered}</b><small>Aufträge abgeschlossen</small></p><p><b>{jobs.length}</b><small>Vorgänge offen</small></p><p><b>{quality}%</b><small>Qualität</small></p><p><b>{safety}%</b><small>Sicherheit</small></p></div><p>{performance>=90?'Sehr sauber. Du hast die Vorgänge konsequent durch die Prozesskette gesteuert. 🏆':performance>=70?'Solide Schicht. Im Protokoll siehst du, wo Zeit oder Qualität verloren gingen.':'Das Lager hat ordentlich zurückgeschlagen. Genau dafür ist die Simulation da. 🔥'}</p><section className="pressureLog"><b>Deine Entscheidungen</b>{log.map((l,i)=><p key={i} className={l.bad?'bad':''}><span>{l.time}</span>{l.text}</p>)}</section><button onClick={restart}>↻ Schicht erneut üben</button></article>}
 </section>
}
