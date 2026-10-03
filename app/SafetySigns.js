'use client';
import {useState} from 'react';
import {safetySigns,signKinds,signImage,shuffledSigns,signOptions} from './safety-sign-data';
import './safety-signs.css';

const sources=Object.fromEntries([['mandatory','gebotszeichen'],['prohibited','verbotszeichen'],['warning','warnzeichen'],['rescue','rettungszeichen'],['fire','brandschutzzeichen'],['ghs','kennzeichnung-von-gefahrstoffen']].map(([kind,path])=>[kind,`https://www.bghm.de/arbeitsschuetzer/praxishilfen/sicherheitszeichen/${path}`]));

function SignPicture({sign}){
 const [failed,setFailed]=useState(false);
 return <div className={`signPicture ${sign.kind}`}>
  {failed?<span className="signFallback" role="img" aria-label={`Bild für ${sign.code} nicht geladen`}>{signKinds.find(k=>k.id===sign.kind)?.mark}<small>Bild nicht geladen</small></span>:<img src={signImage(sign.code)} alt={`Sicherheitszeichen ${sign.code}`} onError={()=>setFailed(true)} loading="lazy"/>}
 </div>;
}

export default function SafetySigns({onClose}){
 const [kind,setKind]=useState('all'),[mode,setMode]=useState('catalog'),[search,setSearch]=useState('');
 const [questions,setQuestions]=useState([]),[index,setIndex]=useState(0),[options,setOptions]=useState([]),[selected,setSelected]=useState(null),[correct,setCorrect]=useState(0);
 const pool=safetySigns.filter(s=>kind==='all'||s.kind===kind);
 const visible=pool.filter(s=>`${s.code} ${s.label}`.toLocaleLowerCase('de').includes(search.toLocaleLowerCase('de').trim()));
 const current=questions[index];
 function start(){const picked=shuffledSigns(pool).slice(0,Math.min(10,pool.length));setQuestions(picked);setIndex(0);setCorrect(0);setSelected(null);setOptions(signOptions(picked[0],pool));setMode('quiz')}
 function next(){if(index+1>=questions.length){setMode('result');return}const nextSign=questions[index+1];setIndex(index+1);setOptions(signOptions(nextSign,pool));setSelected(null)}
 return <section className="signsShell">
  <header className="signsHead"><div><span className="kicker">ARBEITSSCHUTZ</span><h1>Sicherheitszeichen & Gefahrstoffe</h1><p>Zeichen erkennen, Bedeutung aufdecken und in einer Runde abfragen. Sicherheitszeichen und GHS-Kennzeichnung unterscheiden.</p></div><button className="secondary" onClick={onClose}>← Praxiswelt</button></header>
  <div className="signsRule">{signKinds.map(k=><div key={k.id}><span className={`signRuleMark ${k.id}`}>{k.mark}</span><strong>{k.name}</strong><small>{k.rule}</small></div>)}</div>
  <div className="signsControls"><div className="signsTabs" role="group" aria-label="Zeichenart">{[['all','Alle'],...signKinds.map(k=>[k.id,k.label])].map(([id,label])=><button key={id} className={kind===id?'active':''} onClick={()=>{setKind(id);setMode('catalog')}}>{label}</button>)}</div><div className="signsTabs" role="group" aria-label="Lernart"><button className={mode==='catalog'?'active':''} onClick={()=>setMode('catalog')}>Übersicht</button><button className={mode==='quiz'||mode==='result'?'active':''} onClick={start}>10 Zeichen abfragen</button></div></div>
  {mode==='catalog'&&<><label className="signsSearch">Zeichen suchen <input type="search" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Code oder Bedeutung eingeben"/></label><p className="signsCount">{visible.length} Zeichen · Karte antippen und Bedeutung aufdecken</p><div className="signsGrid">{visible.map(sign=><SignCard key={sign.code} sign={sign}/>)}</div>{!visible.length&&<p>Kein passendes Zeichen gefunden.</p>}</>}
  {mode==='quiz'&&current&&<div className="signQuiz card"><div className="signQuizTop"><span>Frage {index+1} von {questions.length}</span><strong>{correct} richtig</strong></div><SignPicture key={current.code} sign={current}/><h2>Was bedeutet dieses Zeichen?</h2><div className="signQuizOptions">{options.map(option=><button key={option.code} disabled={selected!==null} className={selected!==null?(option.code===current.code?'right':selected===option.code?'wrong':''):''} onClick={()=>{setSelected(option.code);if(option.code===current.code)setCorrect(n=>n+1)}}>{option.label}</button>)}</div>{selected!==null&&<div className="signQuizFeedback" role="status"><b>{selected===current.code?'Richtig!':'Noch nicht ganz.'}</b> {current.code} · {current.label}<button className="primary" onClick={next}>{index+1===questions.length?'Ergebnis ansehen':'Nächstes Zeichen'}</button></div>}</div>}
  {mode==='result'&&<div className="signQuiz card"><h2>{correct} von {questions.length} richtig</h2><p>{correct===questions.length?'Alle Zeichen erkannt!': 'Schau dir die Zeichen noch einmal an und starte eine neue Runde.'}</p><div className="signResultActions"><button className="primary" onClick={start}>Neue Runde</button><button className="secondary" onClick={()=>setMode('catalog')}>Alle Zeichen ansehen</button></div></div>}
  <p className="signsSources">Auswahl für das Lagertraining; kein vollständiger Normenkatalog. GHS-Piktogramme können mehrere Gefahren beschreiben: Etikett, Sicherheitsdatenblatt und Betriebsanweisung beachten. Quellen: {signKinds.map((k,i)=><span key={k.id}>{i>0?' · ':''}<a href={sources[k.id]} target="_blank" rel="noreferrer">{k.label} (BGHM)</a></span>)}. Piktogramme: Wikimedia Commons; Internetverbindung erforderlich.</p>
 </section>;
}

function SignCard({sign}){
 const [open,setOpen]=useState(false);
 return <button className={`signCard ${open?'revealed':''}`} onClick={()=>setOpen(v=>!v)} aria-expanded={open}>
  <SignPicture sign={sign}/><span className="signCode">{open?sign.code:'Was bedeutet das?'}</span><strong>{open?sign.label:'Aufdecken'}</strong>
 </button>;
}
