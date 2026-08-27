'use client';

import { useEffect, useState } from 'react';
import { learningFields } from './data';

const STATS_KEY='lagerlogik-v07-stats';
const REVIEW_KEY='lagerlogik-v07-review';

function load(key,fallback={}){
  if(typeof window==='undefined') return fallback;
  try{return JSON.parse(localStorage.getItem(key))??fallback}catch{return fallback}
}

export default function ProgressDashboard({ onClose }) {
  const [stats,setStats]=useState({});
  const [reviews,setReviews]=useState({});

  useEffect(()=>{
    setStats(load(STATS_KEY,{}));
    setReviews(load(REVIEW_KEY,{}));
  },[]);

  const fieldRows=learningFields.map(field=>{
    const x=stats[field.id];
    const avg=x?.answered?Math.round(x.points/x.answered):0;
    return {field,avg,answered:x?.answered||0};
  });
  const practiced=fieldRows.filter(x=>x.answered>0);
  const strongest=practiced.length?[...practiced].sort((a,b)=>b.avg-a.avg)[0]:null;
  const weakest=practiced.length?[...practiced].sort((a,b)=>a.avg-b.avg)[0]:null;
  const topics=[];
  for(const field of learningFields){
    const topicStats=stats[field.id]?.topics||{};
    for(const [topic,x] of Object.entries(topicStats)){
      if(!x?.answered)continue;
      topics.push({field,topic,answered:x.answered,avg:Math.round(x.points/x.answered)});
    }
  }
  const weakTopics=[...topics].sort((a,b)=>a.avg-b.avg||b.answered-a.answered).slice(0,3);
  const totalAnswered=fieldRows.reduce((n,x)=>n+x.answered,0);
  const totalPoints=Object.values(stats).reduce((n,x)=>n+(x?.points||0),0);
  const overall=totalAnswered?Math.round(totalPoints/totalAnswered):0;
  const dueCount=Object.values(reviews).filter(r=>!r.next||r.next<=Date.now()).length;
  const recommendation=weakest||fieldRows.find(x=>x.answered===0)||fieldRows[0];

  return <div style={s.overlay} onClick={onClose}>
    <section style={s.shell} onClick={e=>e.stopPropagation()}>
      <div style={s.head}>
        <div><span style={s.kicker}>PERSÖNLICHES DASHBOARD</span><h2 style={s.title}>Dein Lernstand</h2></div>
        <button style={s.close} onClick={onClose}>✕ Schließen</button>
      </div>

      <div style={s.metrics}>
        <Metric label="Gesamtleistung" value={`${overall}%`} note={`${totalAnswered} Antworten`} />
        <Metric label="Stärkstes Lernfeld" value={strongest?`LF ${strongest.field.id}`:'–'} note={strongest?`${strongest.avg}% · ${strongest.field.title}`:'Noch keine Daten'} />
        <Metric label="Schwächstes Lernfeld" value={weakest?`LF ${weakest.field.id}`:'–'} note={weakest?`${weakest.avg}% · ${weakest.field.title}`:'Noch keine Daten'} />
        <Metric label="Wiederholungen" value={String(dueCount)} note="aktuell fällig" />
      </div>

      <div style={s.columns}>
        <div style={s.panel}>
          <div style={s.panelHead}><strong>Fortschritt je Lernfeld</strong><span style={s.muted}>12 Lernfelder</span></div>
          <div style={s.fieldList}>{fieldRows.map(x=><div key={x.field.id} style={s.fieldRow}>
            <span style={s.fieldLabel}>{x.field.icon} LF {x.field.id}</span>
            <span style={s.bar}><i style={{...s.barFill,width:`${x.answered?Math.max(4,x.avg):0}%`}} /></span>
            <b style={x.avg>=80?s.good:x.avg>=60?s.mid:x.answered?s.low:s.muted}>{x.answered?`${x.avg}%`:'Neu'}</b>
          </div>)}</div>
        </div>

        <div style={s.sideCol}>
          <div style={s.panel}>
            <span style={s.kicker}>EMPFEHLUNG</span>
            <h3 style={s.recoTitle}>{recommendation?`${recommendation.field.icon} LF ${recommendation.field.id}`:'Weiterlernen'}</h3>
            <p style={s.copy}>{recommendation?recommendation.field.title:'Starte mit einem Lernfeld.'}</p>
            <p style={s.note}>{recommendation?.answered?`Aktuell ${recommendation.avg}% bei ${recommendation.answered} Antworten.`:'Hier liegen noch keine Antworten vor.'}</p>
          </div>
          <div style={s.panel}>
            <div style={s.panelHead}><strong>Schwächste Themen</strong><span style={s.muted}>nach Quote</span></div>
            {weakTopics.length?<div style={s.topicList}>{weakTopics.map((x,i)=><div key={`${x.field.id}-${x.topic}`} style={s.topic}>
              <span><b>{i+1}. {x.topic}</b><small style={s.topicSmall}>LF {x.field.id} · {x.answered} Antworten</small></span>
              <strong style={x.avg>=60?s.mid:s.low}>{x.avg}%</strong>
            </div>)}</div>:<p style={s.copy}>Noch keine Themen ausgewertet. Erst ein paar Fragen beantworten, dann wird es hier spannend. 📦</p>}
          </div>
        </div>
      </div>
    </section>
  </div>;
}

function Metric({label,value,note}){return <div style={s.metric}><span style={s.muted}>{label}</span><strong style={s.metricValue}>{value}</strong><small style={s.metricNote}>{note}</small></div>}

const s={
 overlay:{position:'fixed',inset:0,zIndex:90,background:'rgba(3,7,14,.78)',backdropFilter:'blur(7px)',overflowY:'auto',padding:'72px 18px 28px'},shell:{maxWidth:'1100px',margin:'0 auto',padding:'24px',borderRadius:'22px',background:'#0b1321',border:'1px solid #2a3b58',boxShadow:'0 30px 100px rgba(0,0,0,.5)',color:'#edf4ff'},head:{display:'flex',justifyContent:'space-between',alignItems:'end',gap:'16px',marginBottom:'16px'},kicker:{fontSize:'10px',fontWeight:800,letterSpacing:'.14em',color:'#7fa8e7'},title:{fontSize:'32px',margin:'5px 0 0'},close:{border:'1px solid #344d72',background:'#17243a',color:'#edf4ff',borderRadius:'10px',padding:'10px 13px',cursor:'pointer'},metrics:{display:'grid',gridTemplateColumns:'repeat(4,minmax(0,1fr))',gap:'12px',marginBottom:'12px'},metric:{background:'linear-gradient(180deg,#131d2f,#0d1523)',border:'1px solid #24344f',borderRadius:'16px',padding:'17px'},metricValue:{display:'block',fontSize:'28px',margin:'5px 0'},metricNote:{color:'#93a4bf',fontSize:'11px',lineHeight:1.35},columns:{display:'grid',gridTemplateColumns:'minmax(0,1.55fr) minmax(280px,.75fr)',gap:'12px'},sideCol:{display:'grid',gap:'12px'},panel:{background:'linear-gradient(180deg,#131d2f,#0d1523)',border:'1px solid #24344f',borderRadius:'16px',padding:'18px'},panelHead:{display:'flex',justifyContent:'space-between',gap:'12px',alignItems:'center',marginBottom:'12px'},muted:{color:'#93a4bf',fontSize:'11px'},fieldList:{display:'grid',gap:'7px'},fieldRow:{display:'grid',gridTemplateColumns:'115px 1fr 48px',gap:'10px',alignItems:'center',padding:'6px 0'},fieldLabel:{fontSize:'12px',fontWeight:700},bar:{height:'8px',background:'#17243a',borderRadius:'999px',overflow:'hidden'},barFill:{display:'block',height:'100%',background:'linear-gradient(90deg,#6b9eff,#8cb7ff)',borderRadius:'999px'},good:{color:'#64d6a3'},mid:{color:'#ffd27a'},low:{color:'#ff8a9b'},recoTitle:{fontSize:'28px',margin:'8px 0 3px'},copy:{color:'#c6d2e5',fontSize:'13px',lineHeight:1.45,margin:'5px 0 8px'},note:{color:'#93a4bf',fontSize:'11px',lineHeight:1.45,margin:0},topicList:{display:'grid',gap:'7px'},topic:{display:'flex',alignItems:'center',justifyContent:'space-between',gap:'12px',padding:'10px 0',borderBottom:'1px solid rgba(255,255,255,.06)'},topicSmall:{display:'block',color:'#93a4bf',fontSize:'10px',marginTop:'3px'}
};
