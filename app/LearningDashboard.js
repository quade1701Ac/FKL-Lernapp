'use client';

export default function LearningDashboard({learningFields,stats,reviews,onStartField,onStartWeakness}){
 const fieldAverage=id=>{const s=stats[id];return s?.answered?Math.round(s.points/s.answered):0};
 const fields=learningFields.map(field=>({field,answered:stats[field.id]?.answered||0,avg:fieldAverage(field.id)}));
 const practiced=fields.filter(x=>x.answered>0);
 const strongest=practiced.length?[...practiced].sort((a,b)=>b.avg-a.avg)[0]:null;
 const weakest=practiced.length?[...practiced].sort((a,b)=>a.avg-b.avg)[0]:null;
 const topics=[];
 for(const f of learningFields){
  for(const [topic,data] of Object.entries(stats[f.id]?.topics||{})){
   if(data?.answered)topics.push({field:f,topic,answered:data.answered,avg:Math.round(data.points/data.answered)});
  }
 }
 const weakTopics=[...topics].sort((a,b)=>a.avg-b.avg||b.answered-a.answered).slice(0,3);
 const due=Object.values(reviews||{}).filter(r=>!r.next||r.next<=Date.now()).length;
 const recommendation=weakest||fields.find(x=>!x.answered)||fields[0];
 return <section className="learningDashboard card">
  <div className="dashHead"><div><span className="kicker">Persönliches Dashboard</span><h2>Dein Lernstand auf einen Blick</h2></div><button className="primary" onClick={onStartWeakness}>🎯 Jetzt gezielt üben</button></div>
  <div className="dashHighlights">
   <div><span>🏆 Stärkstes Lernfeld</span><strong>{strongest?`LF ${strongest.field.id} · ${strongest.avg}%`:'Noch offen'}</strong><small>{strongest?.field.title||'Beantworte ein paar Fragen, dann wird es spannend.'}</small></div>
   <div><span>🧱 Größte Baustelle</span><strong>{weakest?`LF ${weakest.field.id} · ${weakest.avg}%`:'Noch offen'}</strong><small>{weakest?.field.title||'Noch keine Schwachstelle erkannt.'}</small></div>
   <div><span>🔁 Wiederholen</span><strong>{due} fällig</strong><small>{due?'Diese Fragen stehen wieder auf dem Lernzettel.':'Aktuell ist nichts überfällig.'}</small></div>
  </div>
  <div className="dashGrid">
   <div className="dashPanel"><h3>Fortschritt nach Lernfeld</h3><div className="fieldProgressList">{fields.map(x=><button key={x.field.id} onClick={()=>onStartField(x.field.id)}><span className="fpLabel"><b>LF {x.field.id}</b><small>{x.field.title}</small></span><span className="fpBar"><i style={{width:`${x.answered?Math.max(4,x.avg):0}%`}}/></span><strong>{x.answered?`${x.avg}%`:'–'}</strong></button>)}</div></div>
   <div className="dashPanel side"><h3>Empfehlung</h3><div className="recommendation"><span>{recommendation?.field.icon||'📦'}</span><div><small>Als Nächstes</small><strong>{recommendation?`Lernfeld ${recommendation.field.id}`:'Lernfeld 1'}</strong><p>{recommendation?.field.title}</p></div></div><button className="secondary full" onClick={()=>onStartField(recommendation?.field.id||1)}>Training starten →</button><h3 className="topicTitle">Schwächste Themen</h3>{weakTopics.length?<div className="topicWeak">{weakTopics.map((x,i)=><button key={`${x.field.id}-${x.topic}`} onClick={()=>onStartField(x.field.id)}><span>{i+1}. LF {x.field.id} · {x.topic}</span><b>{x.avg}%</b></button>)}</div>:<p className="emptyDash">Noch zu wenig Daten. Nach ein paar Antworten tauchen hier deine Themen auf.</p>}</div>
  </div>
 </section>;
}
