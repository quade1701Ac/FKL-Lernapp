'use client';

import { useEffect, useMemo, useState } from 'react';
import { supabase } from './supabase-client';
import { learningFields } from './data';
import './progress-dashboard.css';

const MIN_OVERALL_ANSWERS=10;
const MIN_FIELD_ANSWERS=5;
const MIN_TOPIC_ANSWERS=3;
const DAY=86400000;

export default function ProgressDashboard({onClose}){
 const [rows,setRows]=useState([]),[loading,setLoading]=useState(true),[error,setError]=useState('');
 useEffect(()=>{let active=true;(async()=>{setLoading(true);const {data:{user}}=await supabase.auth.getUser();if(!user){if(active){setRows([]);setLoading(false)}return}const {data,error}=await supabase.from('answer_history').select('question_id,field,topic,score,created_at').eq('user_id',user.id).order('created_at',{ascending:false});if(!active)return;if(error)setError(error.message);else setRows(data||[]);setLoading(false)})();return()=>{active=false}},[]);
 const stats=useMemo(()=>{
  const fields={},topics={};let sum=0;
  for(const r of rows){const score=Number(r.score)||0,field=Number(r.field);sum+=score;fields[field]||={sum:0,count:0};fields[field].sum+=score;fields[field].count++;const key=`${field}|||${r.topic||'Ohne Thema'}`;topics[key]||={field,topic:r.topic||'Ohne Thema',sum:0,count:0};topics[key].sum+=score;topics[key].count++}
  const overall=rows.length>=MIN_OVERALL_ANSWERS?Math.round(sum/rows.length):null;
  const fieldRows=learningFields.map(field=>{const x=fields[field.id]||{sum:0,count:0};return{field,answered:x.count,avg:x.count?Math.round(x.sum/x.count):0}});
  const reliable=fieldRows.filter(x=>x.answered>=MIN_FIELD_ANSWERS),strongest=reliable.length?[...reliable].sort((a,b)=>b.avg-a.avg)[0]:null,weakest=reliable.length?[...reliable].sort((a,b)=>a.avg-b.avg)[0]:null;
  const weakTopics=Object.values(topics).filter(x=>x.count>=MIN_TOPIC_ANSWERS).map(x=>({...x,answered:x.count,avg:Math.round(x.sum/x.count)})).sort((a,b)=>a.avg-b.avg||b.answered-a.answered).slice(0,3);
  const now=Date.now(),start7=now-7*DAY,start14=now-14*DAY;
  const recent=rows.filter(r=>new Date(r.created_at).getTime()>=start7);
  const previous=rows.filter(r=>{const t=new Date(r.created_at).getTime();return t>=start14&&t<start7});
  const avgOf=a=>a.length?Math.round(a.reduce((n,r)=>n+(Number(r.score)||0),0)/a.length):null;
  const recentAvg=avgOf(recent),previousAvg=avgOf(previous),trend=recentAvg!=null&&previousAvg!=null?recentAvg-previousAvg:null;
  const latest={};for(const r of rows){if(!r.question_id)continue;if(!latest[r.question_id]||new Date(r.created_at)>new Date(latest[r.question_id].created_at))latest[r.question_id]=r}
  const openMistakes=Object.values(latest).filter(r=>(Number(r.score)||0)<60).length;
  const dayKeys=[...new Set(rows.map(r=>new Date(r.created_at).toISOString().slice(0,10)))].sort().reverse();let streak=0;
  if(dayKeys.length){let cursor=new Date();cursor.setHours(0,0,0,0);const today=cursor.toISOString().slice(0,10),yesterday=new Date(cursor.getTime()-DAY).toISOString().slice(0,10);if(dayKeys.includes(today)||dayKeys.includes(yesterday)){if(!dayKeys.includes(today))cursor=new Date(cursor.getTime()-DAY);while(dayKeys.includes(cursor.toISOString().slice(0,10))){streak++;cursor=new Date(cursor.getTime()-DAY)}}}
  const activeDays7=new Set(recent.map(r=>new Date(r.created_at).toISOString().slice(0,10))).size;
  return{overall,fieldRows,strongest,weakest,weakTopics,recentCount:recent.length,recentAvg,previousAvg,trend,openMistakes,streak,activeDays7};
 },[rows]);
 if(loading)return <div className="pd-overlay"><section className="pd-shell"><p className="pd-copy">☁️ Lernstand wird geladen …</p></section></div>;
 const trendText=stats.trend==null?'Noch kein Vergleich':stats.trend>0?`▲ ${stats.trend} Prozentpunkte`:stats.trend<0?`▼ ${Math.abs(stats.trend)} Prozentpunkte`:'± 0 Prozentpunkte';
 return <div className="pd-overlay" onClick={onClose}><section className="pd-shell" onClick={e=>e.stopPropagation()}>
  <div className="pd-head"><div><span className="pd-kicker">PERSÖNLICHES DASHBOARD · CLOUD</span><h2>Dein Lernstand</h2></div><button className="pd-close" onClick={onClose}>✕ <span>Schließen</span></button></div>
  {error&&<div className="pd-error">{error}</div>}
  <div className="pd-metrics">
   <Metric label="Gesamtleistung" value={stats.overall==null?'–':`${stats.overall}%`} note={stats.overall==null?`Noch ${Math.max(0,MIN_OVERALL_ANSWERS-rows.length)} Antworten bis zur ersten Quote`:`${rows.length} Antworten insgesamt`} />
   <Metric label="Letzte 7 Tage" value={String(stats.recentCount)} note={`${stats.activeDays7} aktive Tage · ${stats.recentAvg==null?'noch keine Quote':`${stats.recentAvg}% Ø`}`} />
   <Metric label="Trend" value={stats.trend==null?'–':`${stats.trend>0?'+':''}${stats.trend}`} note={`${trendText} gegenüber den 7 Tagen davor`} tone={stats.trend>0?'good':stats.trend<0?'low':'normal'} />
   <Metric label="Offene Fehler" value={String(stats.openMistakes)} note="Letzte Antwort unter 60 %" tone={stats.openMistakes?'low':'good'} />
  </div>
  <div className="pd-miniMetrics">
   <div className="pd-mini"><span>🔥 Lernserie</span><strong>{stats.streak} {stats.streak===1?'Tag':'Tage'}</strong></div>
   <div className="pd-mini"><span>🏆 Stärkstes LF</span><strong>{stats.strongest?`LF ${stats.strongest.field.id} · ${stats.strongest.avg}%`:'Noch offen'}</strong></div>
   <div className="pd-mini"><span>🧱 Schwächstes LF</span><strong>{stats.weakest?`LF ${stats.weakest.field.id} · ${stats.weakest.avg}%`:'Noch offen'}</strong></div>
  </div>
  <div className="pd-columns">
   <div className="pd-panel"><div className="pd-panelHead"><strong>Fortschritt je Lernfeld</strong><span>Quote · Anzahl Antworten</span></div><div className="pd-fieldList">{stats.fieldRows.map(x=><div key={x.field.id} className="pd-fieldRow"><span className="pd-fieldLabel">{x.field.icon} LF {x.field.id}</span><span className="pd-bar"><i style={{width:`${x.answered?Math.max(4,x.avg):0}%`}}/></span><b className={x.avg>=80?'pd-good':x.avg>=60?'pd-mid':x.answered?'pd-low':'pd-muted'}>{x.answered?`${x.avg}%`:'Neu'}{x.answered?<small> {x.answered}×</small>:null}</b></div>)}</div></div>
   <div className="pd-sideCol">
    <div className="pd-panel pd-reco"><span className="pd-kicker">EMPFEHLUNG</span><h3>{stats.weakest?`${stats.weakest.field.icon} LF ${stats.weakest.field.id}`:'📥 Noch Daten sammeln'}</h3><p>{stats.weakest?stats.weakest.field.title:'Beantworte weiter Fragen. Sobald genug Daten vorliegen, erscheint hier dein schwächstes Lernfeld.'}</p><small>{stats.weakest?`Aktuell ${stats.weakest.avg}% bei ${stats.weakest.answered} Antworten.`:`${rows.length} von ${MIN_OVERALL_ANSWERS} Antworten für die Gesamtquote erfasst.`}</small></div>
    <div className="pd-panel"><div className="pd-panelHead"><strong>Schwächste Themen</strong><span>mind. {MIN_TOPIC_ANSWERS} Antworten</span></div>{stats.weakTopics.length?<div className="pd-topicList">{stats.weakTopics.map((x,i)=><div key={`${x.field}-${x.topic}`} className="pd-topic"><span><b>{i+1}. {x.topic}</b><small>LF {x.field} · {x.answered} Antworten</small></span><strong className={x.avg>=60?'pd-mid':'pd-low'}>{x.avg}%</strong></div>)}</div>:<p className="pd-copy">Noch kein Thema hat mindestens {MIN_TOPIC_ANSWERS} Antworten. Erst etwas mehr Daten sammeln, dann wird die Rangliste aussagekräftig. 📦</p>}</div>
   </div>
  </div>
 </section></div>
}
function Metric({label,value,note,tone='normal'}){return <div className="pd-metric"><span>{label}</span><strong className={tone==='good'?'pd-good':tone==='low'?'pd-low':''}>{value}</strong><small>{note}</small></div>}
