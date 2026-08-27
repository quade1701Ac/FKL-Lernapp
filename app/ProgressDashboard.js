'use client';

export default function ProgressDashboard({ learningFields, stats, dueCount, onTrainField, onTrainWeak }) {
  const fieldRows = learningFields.map(field => {
    const s = stats[field.id];
    const avg = s?.answered ? Math.round(s.points / s.answered) : 0;
    return { field, avg, answered: s?.answered || 0 };
  });

  const practiced = fieldRows.filter(x => x.answered > 0);
  const strongest = practiced.length ? [...practiced].sort((a,b)=>b.avg-a.avg)[0] : null;
  const weakest = practiced.length ? [...practiced].sort((a,b)=>a.avg-b.avg)[0] : null;

  const topics = [];
  for (const field of learningFields) {
    const topicStats = stats[field.id]?.topics || {};
    for (const [topic, s] of Object.entries(topicStats)) {
      if (!s?.answered) continue;
      topics.push({
        field,
        topic,
        answered: s.answered,
        avg: Math.round(s.points / s.answered)
      });
    }
  }
  const weakTopics = [...topics].sort((a,b)=>a.avg-b.avg || b.answered-a.answered).slice(0,3);
  const totalAnswered = fieldRows.reduce((n,x)=>n+x.answered,0);
  const totalPoints = Object.values(stats).reduce((n,s)=>n+(s?.points||0),0);
  const overall = totalAnswered ? Math.round(totalPoints/totalAnswered) : 0;
  const recommendation = weakest || fieldRows.find(x=>x.answered===0) || fieldRows[0];

  return (
    <section style={s.wrap}>
      <div style={s.head}>
        <div>
          <span className="kicker">Persönliches Dashboard</span>
          <h2 style={s.title}>Dein Lernstand</h2>
        </div>
        <button className="primary" onClick={onTrainWeak}>🎯 Gezielt üben</button>
      </div>

      <div style={s.metrics}>
        <Metric label="Gesamtleistung" value={`${overall}%`} note={`${totalAnswered} Antworten`} />
        <Metric label="Stärkstes Lernfeld" value={strongest ? `LF ${strongest.field.id}` : '–'} note={strongest ? `${strongest.avg}% · ${strongest.field.title}` : 'Noch keine Daten'} />
        <Metric label="Schwächstes Lernfeld" value={weakest ? `LF ${weakest.field.id}` : '–'} note={weakest ? `${weakest.avg}% · ${weakest.field.title}` : 'Noch keine Daten'} />
        <Metric label="Wiederholungen" value={String(dueCount)} note="aktuell fällig" />
      </div>

      <div style={s.columns}>
        <div style={s.panel}>
          <div style={s.panelHead}><strong>Fortschritt je Lernfeld</strong><span style={s.muted}>12 Lernfelder</span></div>
          <div style={s.fieldList}>
            {fieldRows.map(x => <button key={x.field.id} style={s.fieldRow} onClick={()=>onTrainField(x.field.id)}>
              <span style={s.fieldLabel}>{x.field.icon} LF {x.field.id}</span>
              <span style={s.bar}><i style={{...s.barFill,width:`${x.answered?Math.max(4,x.avg):0}%`}} /></span>
              <b style={x.avg>=80?s.good:x.avg>=60?s.mid:x.answered?s.low:s.muted}>{x.answered?`${x.avg}%`:'Neu'}</b>
            </button>)}
          </div>
        </div>

        <div style={s.sideCol}>
          <div style={s.panel}>
            <span className="kicker">Empfehlung</span>
            <h3 style={s.recoTitle}>{recommendation ? `${recommendation.field.icon} LF ${recommendation.field.id}` : 'Weiterlernen'}</h3>
            <p style={s.copy}>{recommendation ? recommendation.field.title : 'Starte mit einem Lernfeld.'}</p>
            <button className="primary" onClick={()=>recommendation&&onTrainField(recommendation.field.id)}>Jetzt trainieren</button>
          </div>

          <div style={s.panel}>
            <div style={s.panelHead}><strong>Schwächste Themen</strong><span style={s.muted}>nach Quote</span></div>
            {weakTopics.length ? <div style={s.topicList}>{weakTopics.map((x,i)=><button key={`${x.field.id}-${x.topic}`} style={s.topic} onClick={()=>onTrainField(x.field.id)}>
              <span><b>{i+1}. {x.topic}</b><small style={s.topicSmall}>LF {x.field.id} · {x.answered} Antworten</small></span>
              <strong style={x.avg>=60?s.mid:s.low}>{x.avg}%</strong>
            </button>)}</div> : <p style={s.copy}>Noch keine Themen ausgewertet. Ein paar Fragen beantworten, dann wird es hier interessant. 📦</p>}
          </div>
        </div>
      </div>
    </section>
  );
}

function Metric({label,value,note}){
  return <div style={s.metric}><span style={s.muted}>{label}</span><strong style={s.metricValue}>{value}</strong><small style={s.metricNote}>{note}</small></div>;
}

const s={
 wrap:{margin:'0 0 42px'},head:{display:'flex',justifyContent:'space-between',alignItems:'end',gap:'16px',margin:'8px 0 16px'},title:{fontSize:'30px',margin:'5px 0 0'},metrics:{display:'grid',gridTemplateColumns:'repeat(4,minmax(0,1fr))',gap:'12px',marginBottom:'12px'},metric:{background:'linear-gradient(180deg,rgba(19,29,47,.98),rgba(13,21,35,.98))',border:'1px solid #24344f',borderRadius:'16px',padding:'17px'},metricValue:{display:'block',fontSize:'28px',margin:'5px 0'},metricNote:{color:'#93a4bf',fontSize:'11px',lineHeight:1.35},columns:{display:'grid',gridTemplateColumns:'minmax(0,1.55fr) minmax(280px,.75fr)',gap:'12px'},sideCol:{display:'grid',gap:'12px'},panel:{background:'linear-gradient(180deg,rgba(19,29,47,.98),rgba(13,21,35,.98))',border:'1px solid #24344f',borderRadius:'16px',padding:'18px'},panelHead:{display:'flex',justifyContent:'space-between',gap:'12px',alignItems:'center',marginBottom:'12px'},muted:{color:'#93a4bf',fontSize:'11px'},fieldList:{display:'grid',gap:'7px'},fieldRow:{display:'grid',gridTemplateColumns:'115px 1fr 48px',gap:'10px',alignItems:'center',width:'100%',border:0,background:'transparent',color:'#edf4ff',padding:'6px 0',cursor:'pointer',textAlign:'left'},fieldLabel:{fontSize:'12px',fontWeight:700},bar:{height:'8px',background:'#17243a',borderRadius:'999px',overflow:'hidden'},barFill:{display:'block',height:'100%',background:'linear-gradient(90deg,#6b9eff,#8cb7ff)',borderRadius:'999px'},good:{color:'#64d6a3'},mid:{color:'#ffd27a'},low:{color:'#ff8a9b'},recoTitle:{fontSize:'28px',margin:'8px 0 3px'},copy:{color:'#93a4bf',fontSize:'12px',lineHeight:1.5,margin:'5px 0 16px'},topicList:{display:'grid',gap:'7px'},topic:{display:'flex',alignItems:'center',justifyContent:'space-between',gap:'12px',width:'100%',padding:'10px 0',background:'transparent',border:0,borderBottom:'1px solid rgba(255,255,255,.06)',color:'#edf4ff',textAlign:'left',cursor:'pointer'},topicSmall:{display:'block',color:'#93a4bf',fontSize:'10px',marginTop:'3px'}
};
