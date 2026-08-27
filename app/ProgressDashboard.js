'use client';

import { useEffect, useMemo, useState } from 'react';
import { supabase } from './supabase-client';
import { learningFields } from './data';

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

  const latest={};
  for(const r of rows){if(!r.question_id)continue;if(!latest[r.question_id]||new Date(r.created_at)>new Date(latest[r.question_id].created_at))latest[r.question_id]=r}
  const openMistakes=Object.values(latest).filter(r=>(Number(r.score)||0)<60).length;

  const dayKeys=[...new Set(rows.map(r=>new Date(r.created_at).toISOString().slice(0,10)))].sort().reverse();
  let streak=0;
  if(dayKeys.length){let cursor=new Date();cursor.setHours(0,0,0,0);const today=cursor.toISOString().slice(0,10),yesterday=new Date(cursor.getTime()-DAY).toISOString().slice(0,10);if(dayKeys.includes(today)||dayKeys.includes(yesterday)){if(!dayKeys.includes(today))cursor=new Date(cursor.getTime()-DAY);while(dayKeys.includes(cursor.toISOString().slice(0,10))){streak++;cursor=new Date(cursor.getTime()-DAY)}}}
  const activeDays7=new Set(recent.map(r=>new Date(r.created_at).toISOString().slice(0,10))).size;
  return{overall,fieldRows,strongest,weakest,weakTopics,recentCount:recent.length,recentAvg,previousAvg,trend,openMistakes,streak,activeDays7};
 },[rows]);
 if(loading)return <div style={s.overlay}><div style={s.shell}><p style={s.copy}>☁️ Lernstand wird geladen …</p></div></div>;
 const trendText=stats.trend==null?'Noch kein Vergleich':stats.trend>0?`▲ ${stats.trend} Prozentpunkte`:stats.trend<0?`▼ ${Math.abs(stats.trend)} Prozentpunkte`:'± 0 Prozentpunkte';
 return <div style={s.overlay} onClick={onClose}><section style={s.shell} onClick={e=>e.stopPropagation()}>
  <div style={s.head}><div><span style={s.kicker}>PERSÖNLICHES DASHBOARD · CLOUD</span><h2 style={s.title}>Dein Lernstand</h2></div><button style={s.close} onClick={onClose}>✕ Schließen</button></div>
  {error&&<div style={s.error}>{error}</div>}
  <div style={s.metrics}>
   <Metric label="Gesamtleistung" value={stats.overall==null?'–':`${stats.overall}%`} note={stats.overall==null?`Noch ${Math.max(0,MIN_OVERALL_ANSWERS-rows.length)} Antworten bis zur ersten Quote`:`${rows.length} Antworten insgesamt`} />
   <Metric label="Letzte 7 Tage" value={String(stats.recentCount)} note={`${stats.activeDays7} aktive Tage · ${stats.recentAvg==null?'noch keine Quote':`${stats.recentAvg}% Ø`}`} />
   <Metric label="Trend" value={stats.trend==null?'–':`${stats.trend>0?'+':''}${stats.trend}`} note={`${trendText} gegenüber den 7 Tagen davor`} tone={stats.trend>0?'good':stats.trend<0?'low':'normal'} />
   <Metric label="Offene Fehler" value={String(stats.openMistakes)} note="Letzte Antwort unter 60 %" tone={stats.openMistakes?'low':'good'} />
  </div>
  <div style={s.miniMetrics}>
   <div style={s.mini}><span>🔥 Lernserie</span><strong>{stats.streak} {stats.streak===1?'Tag':'Tage'}</strong></div>
   <div style={s.mini}><span>🏆 Stärkstes LF</span><strong>{stats.strongest?`LF ${stats.strongest.field.id} · ${stats.strongest.avg}%`:'Noch offen'}</strong></div>
   <div style={s.mini}><span>🧱 Schwächstes LF</span><strong>{stats.weakest?`LF ${stats.weakest.field.id} · ${stats.weakest.avg}%`:'Noch offen'}</strong></div>
  </div>
  <div style={s.columns}>
   <div style={s.panel}><div style={s.panelHead}><strong>Fortschritt je Lernfeld</strong><span style={s.muted}>Quote · Anzahl Antworten</span></div><div style={s.fieldList}>{stats.fieldRows.map(x=><div key={x.field.id} style={s.fieldRow}><span style={s.fieldLabel}>{x.field.icon} LF {x.field.id}</span><span style={s.bar}><i style={{...s.barFill,width:`${x.answered?Math.max(4,x.avg):0}%`}}/></span><b style={x.avg>=80?s.good:x.avg>=60?s.mid:x.answered?s.low:s.muted}>{x.answered?`${x.avg}%`:'Neu'}{x.answered?<small style={s.count}> {x.answered}×</small>:null}</b></div>)}</div></div>
   <div style={s.sideCol}>
    <div style={s.panel}><span style={s.kicker}>EMPFEHLUNG</span><h3 style={s.recoTitle}>{stats.weakest?`${stats.weakest.field.icon} LF ${stats.weakest.field.id}`:'📥 Noch Daten sammeln'}</h3><p style={s.copy}>{stats.weakest?stats.weakest.field.title:'Beantworte weiter Fragen. Sobald genug Daten vorliegen, erscheint hier dein schwächstes Lernfeld.'}</p><p style={s.note}>{stats.weakest?`Aktuell ${stats.weakest.avg}% bei ${stats.weakest.answered} Antworten.`:`${rows.length} von ${MIN_OVERALL_ANSWERS} Antworten für die Gesamtquote erfasst.`}</p></div>
    <div style={s.panel}><div style={s.panelHead}><strong>Schwächste Themen</strong><span style={s.muted}>mind. {MIN_TOPIC_ANSWERS} Antworten</span></div>{stats.weakTopics.length?<div style={s.topicList}>{stats.weakTopics.map((x,i)=><div key={`${x.field}-${x.topic}`} style={s.topic}><span><b>{i+1}. {x.topic}</b><small style={s.topicSmall}>LF {x.field} · {x.answered} Antworten</small></span><strong style={x.avg>=60?s.mid:s.low}>{x.avg}%</strong></div>)}</div>:<p style={s.copy}>Noch kein Thema hat mindestens {MIN_TOPIC_ANSWERS} Antworten. Erst etwas mehr Daten sammeln, dann wird die Rangliste aussagekräftig. 📦</p>}</div>
   </div>
  </div>
 </section></div>
}
function Metric({label,value,note,tone='normal'}){const toneStyle=tone==='good'?s.good:tone==='low'?s.low:null;return <div style={s.metric}><span style={s.muted}>{label}</span><strong style={{...s.metricValue,...(toneStyle||{})}}>{value}</strong><small style={s.metricNote}>{note}</small></div>}
const s={overlay:{position:'fixed',inset:0,zIndex:90,background:'rgba(3,7,14,.78)',backdropFilter:'blur(7px)',overflowY:'auto',padding:'72px 18px 28px'},shell:{maxWidth:'1100px',margin:'0 auto',padding:'24px',borderRadius:'22px',background:'#0b1321',border:'1px solid #2a3b58',boxShadow:'0 30px 100px rgba(0,0,0,.5)',color:'#edf4ff'},head:{display:'flex',justifyContent:'space-between',alignItems:'end',gap:'16px',marginBottom:'16px'},kicker:{fontSize:'10px',fontWeight:800,letterSpacing:'.14em',color:'#7fa8e7'},title:{fontSize:'32px',margin:'5px 0 0'},close:{border:'1px solid #344d72',background:'#17243a',color:'#edf4ff',borderRadius:'10px',padding:'10px 13px',cursor:'pointer'},metrics:{display:'grid',gridTemplateColumns:'repeat(4,minmax(0,1fr))',gap:'12px',marginBottom:'12px'},metric:{background:'linear-gradient(180deg,#131d2f,#0d1523)',border:'1px solid #24344f',borderRadius:'16px',padding:'17px'},metricValue:{display:'block',fontSize:'28px',margin:'5px 0'},metricNote:{display:'block',color:'#93a4bf',fontSize:'11px',lineHeight:1.35},miniMetrics:{display:'grid',gridTemplateColumns:'repeat(3,minmax(0,1fr))',gap:'12px',marginBottom:'12px'},mini:{display:'flex',justifyContent:'space-between',gap:'12px',alignItems:'center',background:'#101a2a',border:'1px solid #24344f',borderRadius:'13px',padding:'12px 15px',fontSize:'12px'},columns:{display:'grid',gridTemplateColumns:'minmax(0,1.55fr) minmax(280px,.75fr)',gap:'12px'},sideCol:{display:'grid',gap:'12px'},panel:{background:'linear-gradient(180deg,#131d2f,#0d1523)',border:'1px solid #24344f',borderRadius:'16px',padding:'18px'},panelHead:{display:'flex',justifyContent:'space-between',gap:'12px',alignItems:'center',marginBottom:'12px'},muted:{color:'#93a4bf',fontSize:'11px'},fieldList:{display:'grid',gap:'7px'},fieldRow:{display:'grid',gridTemplateColumns:'115px 1fr 62px',gap:'10px',alignItems:'center',padding:'6px 0'},fieldLabel:{fontSize:'12px',fontWeight:700},bar:{height:'8px',background:'#17243a',borderRadius:'999px',overflow:'hidden'},barFill:{display:'block',height:'100%',background:'linear-gradient(90deg,#6b9eff,#8cb7ff)',borderRadius:'999px'},good:{color:'#64d6a3'},mid:{color:'#ffd27a'},low:{color:'#ff8a9b'},count:{color:'#93a4bf',fontSize:'9px',fontWeight:500},recoTitle:{fontSize:'28px',margin:'8px 0 3px'},copy:{color:'#c6d2e5',fontSize:'13px',lineHeight:1.45,margin:'5px 0 8px'},note:{color:'#93a4bf',fontSize:'11px',lineHeight:1.45,margin:0},topicList:{display:'grid',gap:'7px'},topic:{display:'flex',alignItems:'center',justifyContent:'space-between',gap:'12px',padding:'10px 0',borderBottom:'1px solid rgba(255,255,255,.06)'},topicSmall:{display:'block',color:'#93a4bf',fontSize:'10px',marginTop:'3px'},error:{padding:'10px 12px',marginBottom:'12px',borderRadius:'10px',background:'#3a1822',border:'1px solid #d06480',color:'#fff4f6'}};