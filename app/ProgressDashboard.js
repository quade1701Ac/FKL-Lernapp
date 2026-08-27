'use client';

import { useEffect, useMemo, useState } from 'react';
import { learningFields } from './data';
import { supabase } from './supabase-client';

const MIN_FIELD_ANSWERS=5;
const MIN_TOPIC_ANSWERS=3;
const PRIOR_SCORE=60;
const TOPIC_PRIOR_WEIGHT=3;

function weightedAverage(points,answered){
  if(!answered)return 0;
  return Math.round((points+PRIOR_SCORE*TOPIC_PRIOR_WEIGHT)/(answered+TOPIC_PRIOR_WEIGHT));
}

function buildAnalytics(rows){
  const byField={};
  const latestByQuestion={};
  let totalPoints=0;

  for(const row of rows){
    const field=Number(row.field);
    if(!field)continue;
    const score=Number(row.score)||0;
    const topic=row.topic||'Sonstiges';
    totalPoints+=score;

    const f=byField[field]||{answered:0,points:0,topics:{}};
    const t=f.topics[topic]||{answered:0,points:0};
    f.answered+=1;
    f.points+=score;
    f.topics[topic]={answered:t.answered+1,points:t.points+score};
    byField[field]=f;

    if(row.question_id){
      const old=latestByQuestion[row.question_id];
      if(!old||new Date(row.created_at)>new Date(old.created_at)) latestByQuestion[row.question_id]=row;
    }
  }

  const now=Date.now();
  let dueCount=0;
  for(const row of Object.values(latestByQuestion)){
    const score=Number(row.score)||0;
    const answeredAt=new Date(row.created_at).getTime();
    const delay=score>=80?86400000:score>=60?43200000:0;
    if(!answeredAt||answeredAt+delay<=now)dueCount+=1;
  }

  return {byField,totalPoints,totalAnswered:rows.length,dueCount};
}

export default function ProgressDashboard({ onClose }) {
  const [rows,setRows]=useState([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState('');

  useEffect(()=>{
    let active=true;
    async function loadCloud(){
      setLoading(true);setError('');
      const {data,error:cloudError}=await supabase
        .from('answer_history')
        .select('question_id,field,topic,score,created_at')
        .order('created_at',{ascending:true});
      if(!active)return;
      if(cloudError){setError('Cloud-Auswertung konnte nicht geladen werden.');setRows([])}
      else setRows(data||[]);
      setLoading(false);
    }
    loadCloud();
    return()=>{active=false};
  },[]);

  const analytics=useMemo(()=>buildAnalytics(rows),[rows]);
  const {byField,totalPoints,totalAnswered,dueCount}=analytics;

  const fieldRows=learningFields.map(field=>{
    const x=byField[field.id];
    const avg=x?.answered?Math.round(x.points/x.answered):0;
    return {field,avg,answered:x?.answered||0,points:x?.points||0};
  });

  const reliableFields=fieldRows.filter(x=>x.answered>=MIN_FIELD_ANSWERS);
  const strongest=reliableFields.length?[...reliableFields].sort((a,b)=>b.avg-a.avg||b.answered-a.answered)[0]:null;
  const weakest=reliableFields.length?[...reliableFields].sort((a,b)=>a.avg-b.avg||b.answered-a.answered)[0]:null;

  const topics=[];
  for(const field of learningFields){
    const topicStats=byField[field.id]?.topics||{};
    for(const [topic,x] of Object.entries(topicStats)){
      if(!x?.answered)continue;
      topics.push({
        field,topic,answered:x.answered,
        avg:Math.round(x.points/x.answered),
        weighted:weightedAverage(x.points,x.answered)
      });
    }
  }
  const weakTopics=topics
    .filter(x=>x.answered>=MIN_TOPIC_ANSWERS)
    .sort((a,b)=>a.weighted-b.weighted||b.answered-a.answered)
    .slice(0,3);

  const overall=totalAnswered?Math.round(totalPoints/totalAnswered):0;
  const leastPracticed=[...fieldRows].sort((a,b)=>a.answered-b.answered||a.avg-b.avg)[0];
  const recommendation=weakest||leastPracticed||fieldRows[0];

  return <div style={s.overlay} onClick={onClose}>
    <section style={s.shell} onClick={e=>e.stopPropagation()}>
      <div style={s.head}>
        <div><span style={s.kicker}>PERSÖNLICHES DASHBOARD · CLOUD</span><h2 style={s.title}>Dein Lernstand</h2></div>
        <button style={s.close} onClick={onClose}>✕ Schließen</button>
      </div>

      {loading&&<div style={s.info}>☁️ Cloud-Daten werden ausgewertet …</div>}
      {error&&<div style={s.error}>{error}</div>}

      <div style={s.metrics}>
        <Metric label="Gesamtleistung" value={`${overall}%`} note={`${totalAnswered} Cloud-Antworten`} />
        <Metric label="Stärkstes Lernfeld" value={strongest?`LF ${strongest.field.id}`:'–'} note={strongest?`${strongest.avg}% · ${strongest.field.title}`:`Ab ${MIN_FIELD_ANSWERS} Antworten je LF`} />
        <Metric label="Schwächstes Lernfeld" value={weakest?`LF ${weakest.field.id}`:'–'} note={weakest?`${weakest.avg}% · ${weakest.field.title}`:`Ab ${MIN_FIELD_ANSWERS} Antworten je LF`} />
        <Metric label="Wiederholungen" value={String(dueCount)} note="aktuell fällig" />
      </div>

      <div style={s.columns}>
        <div style={s.panel}>
          <div style={s.panelHead}><strong>Fortschritt je Lernfeld</strong><span style={s.muted}>Quote · Anzahl Antworten</span></div>
          <div style={s.fieldList}>{fieldRows.map(x=><div key={x.field.id} style={s.fieldRow}>
            <span style={s.fieldLabel}>{x.field.icon} LF {x.field.id}</span>
            <span style={s.bar}><i style={{...s.barFill,width:`${x.answered?Math.max(4,x.avg):0}%`}} /></span>
            <span style={s.rowResult}><b style={x.avg>=80?s.good:x.avg>=60?s.mid:x.answered?s.low:s.muted}>{x.answered?`${x.avg}%`:'Neu'}</b><small style={s.answerCount}>{x.answered?`${x.answered}×`:''}</small></span>
          </div>)}</div>
        </div>

        <div style={s.sideCol}>
          <div style={s.panel}>
            <span style={s.kicker}>EMPFEHLUNG</span>
            <h3 style={s.recoTitle}>{recommendation?`${recommendation.field.icon} LF ${recommendation.field.id}`:'Weiterlernen'}</h3>
            <p style={s.copy}>{recommendation?recommendation.field.title:'Starte mit einem Lernfeld.'}</p>
            <p style={s.note}>{weakest?`Belastbar schwächstes Lernfeld: ${weakest.avg}% bei ${weakest.answered} Antworten.`:recommendation?.answered?`Noch keine belastbare Schwäche. LF ${recommendation.field.id} hat bisher nur ${recommendation.answered} Antworten.`:'Hier liegen noch keine Antworten vor.'}</p>
          </div>
          <div style={s.panel}>
            <div style={s.panelHead}><strong>Schwächste Themen</strong><span style={s.muted}>mind. {MIN_TOPIC_ANSWERS} Antworten</span></div>
            {weakTopics.length?<div style={s.topicList}>{weakTopics.map((x,i)=><div key={`${x.field.id}-${x.topic}`} style={s.topic}>
              <span><b>{i+1}. {x.topic}</b><small style={s.topicSmall}>LF {x.field.id} · {x.answered} Antworten · Rohquote {x.avg}%</small></span>
              <strong style={x.weighted>=60?s.mid:s.low}>{x.weighted}%</strong>
            </div>)}</div>:<p style={s.copy}>Noch kein Thema hat mindestens {MIN_TOPIC_ANSWERS} Antworten. Erst etwas mehr Daten sammeln, dann wird die Rangliste aussagekräftig. 📦</p>}
            <p style={s.method}>Kleine Stichproben werden vorsichtig Richtung 60% gewichtet, damit einzelne Ausreißer das Ranking nicht verzerren.</p>
          </div>
        </div>
      </div>
    </section>
  </div>;
}

function Metric({label,value,note}){return <div style={s.metric}><span style={s.muted}>{label}</span><strong style={s.metricValue}>{value}</strong><small style={s.metricNote}>{note}</small></div>}

const s={
 overlay:{position:'fixed',inset:0,zIndex:90,background:'rgba(3,7,14,.78)',backdropFilter:'blur(7px)',overflowY:'auto',padding:'72px 18px 28px'},shell:{maxWidth:'1100px',margin:'0 auto',padding:'24px',borderRadius:'22px',background:'#0b1321',border:'1px solid #2a3b58',boxShadow:'0 30px 100px rgba(0,0,0,.5)',color:'#edf4ff'},head:{display:'flex',justifyContent:'space-between',alignItems:'end',gap:'16px',marginBottom:'16px'},kicker:{fontSize:'10px',fontWeight:800,letterSpacing:'.14em',color:'#7fa8e7'},title:{fontSize:'32px',margin:'5px 0 0'},close:{border:'1px solid #344d72',background:'#17243a',color:'#edf4ff',borderRadius:'10px',padding:'10px 13px',cursor:'pointer'},info:{padding:'10px 12px',borderRadius:'10px',background:'#13243b',border:'1px solid #2b4b75',color:'#b9d5ff',fontSize:'12px',marginBottom:'12px'},error:{padding:'10px 12px',borderRadius:'10px',background:'#3a1822',border:'1px solid #d06480',color:'#fff4f6',fontSize:'12px',marginBottom:'12px'},metrics:{display:'grid',gridTemplateColumns:'repeat(4,minmax(0,1fr))',gap:'12px',marginBottom:'12px'},metric:{background:'linear-gradient(180deg,#131d2f,#0d1523)',border:'1px solid #24344f',borderRadius:'16px',padding:'17px'},metricValue:{display:'block',fontSize:'28px',margin:'5px 0'},metricNote:{color:'#93a4bf',fontSize:'11px',lineHeight:1.35},columns:{display:'grid',gridTemplateColumns:'minmax(0,1.55fr) minmax(280px,.75fr)',gap:'12px'},sideCol:{display:'grid',gap:'12px'},panel:{background:'linear-gradient(180deg,#131d2f,#0d1523)',border:'1px solid #24344f',borderRadius:'16px',padding:'18px'},panelHead:{display:'flex',justifyContent:'space-between',gap:'12px',alignItems:'center',marginBottom:'12px'},muted:{color:'#93a4bf',fontSize:'11px'},fieldList:{display:'grid',gap:'7px'},fieldRow:{display:'grid',gridTemplateColumns:'115px 1fr 64px',gap:'10px',alignItems:'center',padding:'6px 0'},fieldLabel:{fontSize:'12px',fontWeight:700},bar:{height:'8px',background:'#17243a',borderRadius:'999px',overflow:'hidden'},barFill:{display:'block',height:'100%',background:'linear-gradient(90deg,#6b9eff,#8cb7ff)',borderRadius:'999px'},rowResult:{display:'flex',alignItems:'baseline',justifyContent:'flex-end',gap:'5px'},answerCount:{fontSize:'9px',color:'#71829b'},good:{color:'#64d6a3'},mid:{color:'#ffd27a'},low:{color:'#ff8a9b'},recoTitle:{fontSize:'28px',margin:'8px 0 3px'},copy:{color:'#c6d2e5',fontSize:'13px',lineHeight:1.45,margin:'5px 0 8px'},note:{color:'#93a4bf',fontSize:'11px',lineHeight:1.45,margin:0},topicList:{display:'grid',gap:'7px'},topic:{display:'flex',alignItems:'center',justifyContent:'space-between',gap:'12px',padding:'10px 0',borderBottom:'1px solid rgba(255,255,255,.06)'},topicSmall:{display:'block',color:'#93a4bf',fontSize:'10px',marginTop:'3px'},method:{fontSize:'10px',lineHeight:1.45,color:'#71829b',margin:'12px 0 0',paddingTop:'10px',borderTop:'1px solid rgba(255,255,255,.06)'}
};
