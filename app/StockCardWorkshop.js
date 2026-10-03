'use client';
import {useState} from 'react';
import {stockCardCases,evaluateStockCard} from './stock-card-data';
import './stock-card.css';
export default function StockCardWorkshop({onClose}){
 const [caseId,setCaseId]=useState(stockCardCases[0].id),[entries,setEntries]=useState([]),[checked,setChecked]=useState(false);
 const c=stockCardCases.find(x=>x.id===caseId),evaluation=evaluateStockCard(c,entries);
 function update(i,key,value){setEntries(old=>{const next=[...old];next[i]={...next[i],[key]:value};return next})}
 function reset(id=caseId){setCaseId(id);setEntries([]);setChecked(false)}
 const complete=c.movements.every((_,i)=>['incoming','outgoing','balance'].every(k=>entries[i]?.[k]?.trim()));
 return <section className="stockShell"><header className="stockHead"><div><span className="kicker">DOKUMENTE ÜBEN</span><h1>Lagerfachkarte ausfüllen</h1><p>Belege lesen, Mengen buchen und den Bestand nach jeder Bewegung fortschreiben.</p></div><button className="secondary" onClick={onClose}>← Praxiswelt</button></header>
 <label className="stockCaseLabel">Übung auswählen<select value={caseId} onChange={e=>reset(e.target.value)}>{stockCardCases.map(x=><option key={x.id} value={x.id}>{x.title}</option>)}</select></label>
 <div className="stockMeta"><strong>{c.article}</strong><span>Lagerplatz {c.place} · Einheit: {c.unit}</span><span>Anfangsbestand: <b>{c.opening} {c.unit}</b></span></div>
 <p className="stockInstruction">Trage Zugang, Abgang und den neuen Bestand in {c.unit} ein. In ein Mengenfeld ohne Bewegung gehört 0. Bestand = vorheriger Bestand + Zugang − Abgang.</p>
 <div className="stockRows">{c.movements.map((m,i)=>{const row=evaluation.rows[i];return <article className="stockRow" key={m.ref}><div className="stockDocument"><span>{m.date} · {m.ref}</span><h2>Bewegung {i+1}</h2><p>{m.text}</p></div><div className="stockInputs">{[['incoming','Zugang'],['outgoing','Abgang'],['balance','Bestand']].map(([key,label])=><label key={key}>{label}<input aria-label={`${label} Bewegung ${i+1}`} inputMode="decimal" value={entries[i]?.[key]||''} disabled={checked} onChange={e=>update(i,key,e.target.value)} className={checked?(row.correct[key]?'stockRight':key==='balance'&&row.followThrough?'stockTransfer':'stockWrong'):''}/>{checked&&<small>{row.correct[key]?'✓ Richtig':key==='balance'&&row.followThrough?'Übertrag richtig gerechnet':`Richtig: ${row.expected[key]}`}</small>}</label>)}</div>{checked&&row.followThrough&&<p className="stockNote">Der vorherige Bestand war falsch. Diese Bewegung hast du korrekt fortgeschrieben; der Übertragsfehler wird hier nicht erneut abgezogen. Tatsächlicher Bestand: {row.expected.balance} {c.unit}.</p>}</article>})}</div>
 {checked?<div className="stockResult" role="status"><h2>{evaluation.percent}% · {evaluation.points} von {evaluation.max} Punkten</h2><p>{evaluation.exact?'Alle Bewegungen und Bestände sind richtig.':'Vergleiche deine Einträge mit den eingeblendeten Werten. Jede richtige Mengenbuchung und jeder richtige Bestand zählt einen Punkt; korrekt fortgeführte Übertragsfehler erhalten Bestandspunkte.'}</p><button className="primary" onClick={()=>reset()}>Noch einmal ausfüllen</button></div>:<button className="primary" disabled={!complete} onClick={()=>setChecked(true)}>Fachkarte prüfen</button>}
 </section>;
}
