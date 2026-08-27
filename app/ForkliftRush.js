'use client';

import { useEffect, useRef, useState } from 'react';

const COLS=7,ROWS=7,ROUND_SECONDS=60;
const START={x:3,y:6};
const RACKS=new Set(['1,1','2,1','4,1','5,1','1,3','2,3','4,3','5,3']);
const SPAWNS=[{x:0,y:1},{x:3,y:1},{x:6,y:1},{x:0,y:3},{x:3,y:3},{x:6,y:3},{x:1,y:5},{x:5,y:5}];
const DOCKS=[{x:0,y:6,label:'A'},{x:3,y:0,label:'B'},{x:6,y:6,label:'C'}];
function key(p){return `${p.x},${p.y}`}
function randomJob(){const pickup=SPAWNS[Math.floor(Math.random()*SPAWNS.length)],dock=DOCKS[Math.floor(Math.random()*DOCKS.length)];return {pickup,dock}}
function blocked(x,y){return x<0||x>=COLS||y<0||y>=ROWS||RACKS.has(`${x},${y}`)}
export default function ForkliftRush({onClose}){
 const [pos,setPos]=useState(START),[job,setJob]=useState(()=>randomJob()),[carrying,setCarrying]=useState(false),[score,setScore]=useState(0),[time,setTime]=useState(ROUND_SECONDS),[running,setRunning]=useState(false),[message,setMessage]=useState('Hol die Palette und bring sie zum markierten Tor.'),timer=useRef(null);
 function start(){setPos(START);setJob(randomJob());setCarrying(false);setScore(0);setTime(ROUND_SECONDS);setMessage('Los geht’s! Palette aufnehmen.');setRunning(true)}
 useEffect(()=>{if(!running)return;timer.current=setInterval(()=>setTime(t=>{if(t<=1){clearInterval(timer.current);setRunning(false);setMessage('Schicht beendet! 🏁');return 0}return t-1}),1000);return()=>clearInterval(timer.current)},[running]);
 function move(dx,dy){if(!running)return;setPos(p=>{const n={x:p.x+dx,y:p.y+dy};if(blocked(n.x,n.y)){setMessage('Regal im Weg! 💥');return p}if(!carrying&&key(n)===key(job.pickup)){setCarrying(true);setMessage(`Palette drauf! Jetzt zu Tor ${job.dock.label}.`)}else if(carrying&&key(n)===key(job.dock)){setCarrying(false);setScore(s=>s+100);setTime(t=>Math.min(ROUND_SECONDS,t+3));setJob(randomJob());setMessage('+100 Punkte · +3 Sekunden! Neue Palette holen.')}return n})}
 useEffect(()=>{function down(e){const map={ArrowUp:[0,-1],ArrowDown:[0,1],ArrowLeft:[-1,0],ArrowRight:[1,0],w:[0,-1],s:[0,1],a:[-1,0],d:[1,0]};const m=map[e.key];if(m){e.preventDefault();move(...m)}}window.addEventListener('keydown',down);return()=>window.removeEventListener('keydown',down)});
 return <section className="gameShell card"><div className="gameHead"><div><span className="kicker">PAUSENMODUS</span><h1>🏗️ Stapler Rush</h1></div><button className="secondary" onClick={onClose}>Zurück</button></div><div className="gameHud"><div><span>Zeit</span><strong>{time}s</strong></div><div><span>Punkte</span><strong>{score}</strong></div><div><span>Ladung</span><strong>{carrying?'📦 Palette':'leer'}</strong></div></div><div className="gameBoard" aria-label="Stapler Rush Spielfeld">{Array.from({length:ROWS*COLS},(_,i)=>{const x=i%COLS,y=Math.floor(i/COLS),k=`${x},${y}`,dock=DOCKS.find(d=>d.x===x&&d.y===y),isPickup=!carrying&&job.pickup.x===x&&job.pickup.y===y,isTarget=carrying&&job.dock.x===x&&job.dock.y===y,isPlayer=pos.x===x&&pos.y===y;return <div key={k} className={`gameCell ${RACKS.has(k)?'rack':''} ${dock?'dock':''} ${isTarget?'target':''} ${isPickup?'pickup':''}`}>{RACKS.has(k)?'▦':dock?`TOR ${dock.label}`:''}{isPickup&&<span className="pallet">📦</span>}{isPlayer&&<span className="forklift">🏗️</span>}</div>})}</div><p className="gameMessage">{message}</p>{!running&&<button className="primary gameStart" onClick={start}>{time===0?'Nochmal fahren':'Schicht starten'}</button>}<div className="gameControls"><button onClick={()=>move(0,-1)}>▲</button><div><button onClick={()=>move(-1,0)}>◀</button><button onClick={()=>move(0,1)}>▼</button><button onClick={()=>move(1,0)}>▶</button></div></div><small className="gameTip">Handy: Pfeiltasten antippen · PC: Pfeiltasten oder WASD · 100 Punkte pro Lieferung</small></section>
}
