'use client';
import {useMemo,useState} from 'react';

const AREAS=[
 {id:'in',icon:'🚚',name:'Wareneingang'},{id:'check',icon:'🔎',name:'Prüfung'},{id:'store',icon:'🏬',name:'Lager'},
 {id:'pick',icon:'🛒',name:'Kommissionierung'},{id:'pack',icon:'📦',name:'Verpackung'},{id:'out',icon:'🚛',name:'Warenausgang'}
];
const INITIAL=[
 {id:1,area:'in',kind:'damage',stage:'arrival',icon:'📦',title:'Lieferung 4711',text:'Palette sichtbar eingedrückt',due:14},
 {id:2,area:'in',kind:'danger',stage:'arrival',icon:'⚠️',title:'Gefahrgut-Lieferung',text:'UN 1263 · Dokumente liegen vor',due:18},
 {id:3,area:'pick',kind:'express',stage:'picking',icon:'🔴',title:'Express 381',text:'18 Positionen · Abfahrt in Kürze',due:9},
 {id:4,area:'store',kind:'stock',stage:'difference',icon:'❓',title:'A-Artikel X14',text:'Scanner: 124 · Fach: unklar',due:16},
 {id:5,area:'pack',kind:'normal',stage:'packing',icon:'📋',title:'Auftrag 377',text:'12 Positionen vollständig',due:13}
];
const clamp=n=>Math.max(0,Math.min(100,n));
const cloneInitial=()=>INITIAL.map(j=>({...j}));

function actionsFor(job){
 if(!job)return[];
 if(job.kind==='damage'){
  if(job.stage==='arrival')return[
   {label:'Schaden dokumentieren & prüfen',next:{area:'check',stage:'inspection',text:'Schaden dokumentiert · Ware wird geprüft'},msg:'Schaden dokumentiert und Ware zur Prüfung gegeben.'},
   {label:'Direkt ins Sperrlager',complete:true,msg:'Beschädigte Ware gesichert und Vorgang dokumentiert.',score:2},
   {label:'Trotz Schaden einlagern',next:{area:'store',stage:'stored-bad',text:'Beschädigte Ware ungeprüft eingelagert'},msg:'Beschädigte Ware ungeprüft eingelagert.',bad:true,quality:-18,time:4}
  ];
  if(job.stage==='inspection')return[
   {label:'Restware freigeben & einlagern',complete:true,msg:'Schaden erfasst, verwendbare Ware freigegeben und sauber eingebucht.',quality:3},
   {label:'Gesamte Lieferung sperren',complete:true,msg:'Lieferung nach Prüfung vollständig gesperrt.',quality:2}
  ];
  if(job.stage==='stored-bad')return[{label:'Fehler korrigieren & Ware sperren',complete:true,msg:'Falsche Einlagerung korrigiert. Ware nachträglich gesperrt.',quality:4,time:4}];
 }
 if(job.kind==='danger'){
  if(job.stage==='arrival')return[
   {label:'Dokumente & Kennzeichnung prüfen',next:{area:'check',stage:'inspection',text:'Gefahrgut-Dokumente werden geprüft'},msg:'Gefahrgut-Unterlagen und Kennzeichnung werden geprüft.',safety:2},
   {label:'Ohne Prüfung einlagern',next:{area:'store',stage:'stored-bad',text:'Gefahrgut ungeprüft im Lager'},msg:'Gefahrgut ohne Prüfung eingelagert.',bad:true,safety:-22,time:4},
   {label:'Lieferung sofort zurückweisen',complete:true,msg:'Lieferung ohne sachlichen Grund zurückgewiesen.',bad:true,score:-8,time:4}
  ];
  if(job.stage==='inspection')return[
   {label:'Prüfung okay → vorschriftsmäßig einlagern',complete:true,msg:'Gefahrgut geprüft und vorschriftsmäßig eingelagert.',safety:3},
   {label:'Abweichung feststellen → Annahme klären',complete:true,msg:'Abweichung erkannt und Lieferung bis zur Klärung gesichert.',safety:4,quality:2}
  ];
  if(job.stage==='stored-bad')return[{label:'Einlagerung stoppen & Prüfung nachholen',next:{area:'check',stage:'inspection',text:'Nachträgliche Gefahrgutprüfung läuft'},msg:'Unsichere Einlagerung gestoppt. Prüfung wird nachgeholt.',safety:5,time:4}];
 }
 if(job.kind==='express'){
  if(job.stage==='picking')return[
   {label:'Priorisieren & Kommissionierung abschließen',next:{area:'pack',stage:'packing',text:'18 Positionen kommissioniert · Express'},msg:'Expressauftrag priorisiert und zur Verpackung gegeben.',score:3},
   {label:'Normal weiterbearbeiten',next:{area:'pack',stage:'packing',text:'18 Positionen kommissioniert'},msg:'Expressauftrag ohne Sonderpriorität zur Verpackung gegeben.'},
   {label:'Zurückstellen',next:{area:'pick',stage:'picking-wait',text:'Expressauftrag wartet weiter'},msg:'Expressauftrag zurückgestellt.',bad:true,score:-8,time:4}
  ];
  if(job.stage==='picking-wait')return[
   {label:'Jetzt priorisieren',next:{area:'pack',stage:'packing',text:'18 Positionen kommissioniert · Express'},msg:'Expressauftrag verspätet priorisiert und zur Verpackung gegeben.',score:1},
   {label:'Noch einmal warten lassen',next:{area:'pick',stage:'picking-wait',text:'Expressauftrag wartet weiter'},msg:'Expressauftrag erneut zurückgestellt.',bad:true,score:-8,time:4}
  ];
  if(job.stage==='packing')return[
   {label:'Express verpacken & kennzeichnen',next:{area:'out',stage:'ready',text:'Versandbereit · Expresskennzeichnung gesetzt'},msg:'Expressauftrag verpackt und für den Warenausgang bereitgestellt.',quality:2},
   {label:'Ohne Abschlusskontrolle weitergeben',next:{area:'out',stage:'ready-risk',text:'Versandbereit · Kontrolle übersprungen'},msg:'Expressauftrag ohne Abschlusskontrolle weitergegeben.',bad:true,quality:-8}
  ];
  if(job.stage==='ready'||job.stage==='ready-risk')return[
   {label:'Verladen & Versand abschließen',complete:true,delivered:1,msg:'Expressauftrag verladen und abgeschlossen.',score:5}
  ];
 }
 if(job.kind==='normal'){
  if(job.stage==='packing')return[
   {label:'Verpacken & zum Warenausgang',next:{area:'out',stage:'ready',text:'12 Positionen · versandbereit'},msg:'Auftrag verpackt und für den Warenausgang bereit.'},
   {label:'Zurückstellen',next:{area:'pack',stage:'packing-wait',text:'Fertiger Auftrag wartet'},msg:'Fertiger Auftrag unnötig zurückgestellt.',bad:true,score:-5,time:4}
  ];
  if(job.stage==='packing-wait')return[{label:'Jetzt verpacken',next:{area:'out',stage:'ready',text:'12 Positionen · versandbereit'},msg:'Auftrag nach Wartezeit verpackt und bereitgestellt.'}];
  if(job.stage==='ready')return[{label:'Verladen & Versand abschließen',complete:true,delivered:1,msg:'Auftrag 377 verladen und abgeschlossen.',score:4}];
 }
 if(job.kind==='stock'){
  if(job.stage==='difference')return[
   {label:'Bestand gezielt prüfen',next:{area:'check',stage:'inspection',text:'Soll/Ist-Abgleich läuft'},msg:'Bestandsabweichung wird gezielt geprüft.',quality:2},
   {label:'Bestand einfach korrigieren',complete:true,msg:'Bestand ohne Ursachenprüfung korrigiert.',bad:true,quality:-15},
   {label:'Abweichung ignorieren',next:{area:'store',stage:'ignored',text:'Bestandsabweichung weiterhin offen'},msg:'Bestandsabweichung ignoriert.',bad:true,quality:-10,time:4}
  ];
  if(job.stage==='inspection')return[
   {label:'Differenz klären & Bestand berichtigen',complete:true,msg:'Ursache gefunden, Bestand sauber berichtigt und Vorgang abgeschlossen.',quality:5},
   {label:'Keine Ursache gefunden → Nachzählung',next:{area:'check',stage:'recount',text:'Kontrollzählung läuft'},msg:'Kontrollzählung für den A-Artikel gestartet.',time:3}
  ];
  if(job.stage==='recount')return[{label:'Zählung abschließen & buchen',complete:true,msg:'Kontrollzählung abgeschlossen und Bestand korrekt gebucht.',quality:4,time:3}];
  if(job.stage==='ignored')return[{label:'Abweichung doch prüfen',next:{area:'check',stage:'inspection',text:'Verspäteter Soll/Ist-Abgleich läuft'},msg:'Bestandsabweichung wird verspätet geprüft.',quality:1,time:3}];
 }
 return[];
}

export default function WarehouseTycoon({onClose}){
 const [minute,setMinute]=useState(0),[jobs,setJobs]=useState(cloneInitial),[selected,setSelected]=useState(null),[score,setScore]=useState(100),[quality,setQuality]=useState(100),[safety,setSafety]=useState(100),[delivered,setDelivered]=useState(0),[log,setLog]=useState([]),[done,setDone]=useState(false);
 const job=jobs.find(j=>j.id===selected);const clock=`${String(8+Math.floor(minute/60)).padStart(2,'0')}:${String(minute%60).padStart(2,'0')}`;
 const open=jobs.length;const performance=useMemo(()=>Math.round(clamp(score*.45+quality*.3+safety*.25)),[score,quality,safety]);
 const actions=actionsFor(job);
 function addLogs(entries){setLog(l=>[...entries,...l].slice(0,10))}
 function act(action){
  if(!job||!action)return;
  const time=action.time||2;
  let nextJobs=action.complete?jobs.filter(x=>x.id!==job.id):jobs.map(x=>x.id===job.id?{...x,...action.next}:x);
  const previousDue=new Map(jobs.map(x=>[x.id,x.due]));
  nextJobs=nextJobs.map(x=>({...x,due:x.due-time}));
  const late=nextJobs.filter(x=>(previousDue.get(x.id)??0)>0&&x.due<=0).length;
  setJobs(nextJobs);setMinute(m=>m+time);setSelected(null);
  if(action.score)setScore(s=>clamp(s+action.score));
  if(action.quality)setQuality(q=>clamp(q+action.quality));
  if(action.safety)setSafety(s=>clamp(s+action.safety));
  if(action.delivered)setDelivered(d=>d+action.delivered);
  if(late)setScore(s=>clamp(s-late*8));
  const entries=[{time:clock,text:action.msg,bad:!!action.bad}];
  if(late)entries.unshift({time:clock,text:`${late} Vorgang${late>1?'e':''} hat die Frist überschritten.`,bad:true});
  addLogs(entries);
  if(minute+time>=40)setDone(true);
 }
 function restart(){setMinute(0);setJobs(cloneInitial());setSelected(null);setScore(100);setQuality(100);setSafety(100);setDelivered(0);setLog([]);setDone(false)}
 return <section className="pressure"><header className="pressureHead"><div><span>PRAXIS-SIMULATION</span><h1>🔥 Lager unter Druck</h1><p>Vorgänge durchlaufen echte Prozessschritte. Jede Aktion verändert ihren Zustand.</p></div><button onClick={onClose}>← Praxiswelt</button></header>
 <div className="pressureHud"><div><small>UHRZEIT</small><b>{clock}</b></div><div><small>OFFEN</small><b>{open}</b></div><div><small>TERMINE</small><b>{score}%</b></div><div><small>QUALITÄT</small><b>{quality}%</b></div><div><small>SICHERHEIT</small><b>{safety}%</b></div></div>
 {!done?<><div className="warehouseMap">{AREAS.map(a=><section key={a.id} className="warehouseArea"><header><span>{a.icon}</span><b>{a.name}</b><small>{jobs.filter(j=>j.area===a.id).length}</small></header><div>{jobs.filter(j=>j.area===a.id).map(j=><button key={j.id} className={`${selected===j.id?'active ':''}${j.due<=5?'urgent':''}`} onClick={()=>setSelected(j.id)}><span>{j.icon}</span><div><b>{j.title}</b><small>{j.text}</small></div><em>{j.due>0?`${j.due} min`:'ÜBERFÄLLIG'}</em></button>)}</div></section>)}</div>
 {job?<aside className="jobPanel"><div><small>AKTIVER VORGANG</small><h2>{job.icon} {job.title}</h2><p>{job.text}</p></div><div className="jobActions">{actions.map(a=><button key={a.label} onClick={()=>act(a)}>{a.label}</button>)}</div><small className="processHint">Nur Aktionen, die zum aktuellen Prozessschritt passen, sind verfügbar.</small></aside>:<div className="pressureHint">👆 Wähle einen Vorgang im Lager aus. Fristen laufen mit jeder Aktion weiter.</div>}
 <div className="pressureLog"><b>Schichtprotokoll</b>{log.length?log.map((l,i)=><p key={i} className={l.bad?'bad':''}><span>{l.time}</span>{l.text}</p>):<p>Noch keine Aktionen.</p>}</div><button className="finishShift" onClick={()=>setDone(true)}>Schicht vorzeitig auswerten</button></>:<article className="pressureEnd"><span>SCHICHT BEENDET</span><h2>{performance}% Schichtleistung</h2><div><p><b>{delivered}</b><small>Aufträge abgeschlossen</small></p><p><b>{jobs.length}</b><small>Vorgänge offen</small></p><p><b>{quality}%</b><small>Qualität</small></p><p><b>{safety}%</b><small>Sicherheit</small></p></div><p>{performance>=90?'Sehr sauber. Du hast die Vorgänge konsequent durch die Prozesskette gesteuert. 🏆':performance>=70?'Solide Schicht. Im Protokoll siehst du, wo Zeit oder Qualität verloren gingen.':'Das Lager hat ordentlich zurückgeschlagen. Genau dafür ist die Simulation da. 🔥'}</p><section className="pressureLog"><b>Deine Entscheidungen</b>{log.map((l,i)=><p key={i} className={l.bad?'bad':''}><span>{l.time}</span>{l.text}</p>)}</section><button onClick={restart}>↻ Neue Chaos-Schicht</button></article>}
 </section>
}
