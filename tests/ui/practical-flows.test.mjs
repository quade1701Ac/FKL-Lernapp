import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import {create,act} from 'react-test-renderer';
import Home from '../../app/page.js';
import Signs from '../../app/SafetySigns.js';
import Drill from '../../app/PracticalTraining.js';
import Task from '../../app/PracticalTask.js';
import {safetySigns} from '../../app/safety-sign-data.js';
import {shapeQuestions,signReviewStorageKey,pictureKey,recordSignReview} from '../../app/sign-training.js';
import {practicalTrainingPool} from '../../app/practical-training-data.js';
import {practicalTaskCases} from '../../app/practical-task-data.js';
import {stockCardSolution} from '../../app/stock-card-data.js';
globalThis.IS_REACT_ACT_ENVIRONMENT=true;
const text=n=>typeof n==='string'?n:(n.children||[]).map(text).join('');
function env(){const map=new Map([['lagerlogik-active-user','test-user']]);globalThis.localStorage={getItem:k=>map.get(k)||null,setItem:(k,v)=>map.set(k,v),removeItem:k=>map.delete(k)};globalThis.window=new EventTarget();return map}
async function click(ui,label){const b=ui.root.findAllByType('button').find(b=>text(b)===label);assert.ok(b,label);assert.ok(!b.props.disabled,label);await act(async()=>b.props.onClick());}
async function setInput(ui,label,value){const input=ui.root.findAllByType('input').find(n=>n.props['aria-label']===label);assert.ok(input,label);await act(async()=>input.props.onChange({target:{value}}));}
test('home opens practical areas directly and linked task returns to the same hub',async()=>{
 env();let ui;await act(async()=>{ui=create(React.createElement(Home))});await click(ui,'Praktisches Training öffnen');assert.match(text(ui.root),/42 Aufgaben/);
 await click(ui,'Zusammenhängende Praxisaufgabe');assert.match(text(ui.root),/EIN AUFTRAG/);await click(ui,'← Praktische Abläufe');assert.match(text(ui.root),/20 gemischte Fragen/);await act(async()=>ui.unmount());
});
test('free sign grading records errors, repeats only uncertain signs and survives a remount',async()=>{
 const map=env();map.set(signReviewStorageKey('test-user'),JSON.stringify(recordSignReview({},pictureKey('M003'),0)));
 let ui;await act(async()=>{ui=create(React.createElement(Signs))});await click(ui,'Unsichere Zeichen wiederholen');assert.equal(ui.root.findByType('img').props.alt,'Sicherheitszeichen M003');
 assert.equal(ui.root.findAll(n=>n.props.className==='signsRule').length,0,'catalog cannot reveal quiz answers');
 const oldFetch=globalThis.fetch;let request;
 globalThis.fetch=async(_,opts)=>{request=JSON.parse(opts.body);return {ok:true,json:async()=>({score:100,reason:'Schutz des Gehörs erkannt'})}};
 try{await act(async()=>ui.root.findByType('textarea').props.onChange({target:{value:'Gehör vor Lärm schützen, Ohrschutz tragen'}}));await click(ui,'Antwort prüfen');assert.equal(request.solution,'Gehörschutz benutzen');await click(ui,'Ergebnis ansehen');assert.match(text(ui.root),/1 von 1 richtig/);
 assert.equal(JSON.parse(map.get(signReviewStorageKey('test-user')))[pictureKey('M003')].score,100);
 await act(async()=>ui.unmount());await act(async()=>{ui=create(React.createElement(Signs))});assert.match(text(ui.root),/0 unsichere Zeichen/);await act(async()=>ui.unmount());
 }finally{globalThis.fetch=oldFetch}
});
test('provider failure requires explicit self-assessment and stale sign grading cannot record after navigation',async()=>{
 const map=env();let ui;await act(async()=>{ui=create(React.createElement(Signs))});await click(ui,'Bedeutung selbst eingeben');
 await act(async()=>ui.root.findByType('textarea').props.onChange({target:{value:'eine eigene Antwort'}}));const oldFetch=globalThis.fetch;globalThis.fetch=async()=>({ok:false,json:async()=>({error:'offline'})});
 try{await click(ui,'Antwort prüfen');assert.match(text(ui.root),/nicht erreichbar/);assert.equal(map.has(signReviewStorageKey('test-user')),false);await click(ui,'Noch unsicher');assert.equal(Object.keys(JSON.parse(map.get(signReviewStorageKey('test-user')))).length,1);
 await click(ui,'Übersicht');await click(ui,'Bedeutung selbst eingeben');await act(async()=>ui.root.findByType('textarea').props.onChange({target:{value:'Noch eine eigene Antwort'}}));let resolve;globalThis.fetch=()=>new Promise(r=>{resolve=r});const button=ui.root.findAllByType('button').find(b=>text(b)==='Antwort prüfen');let pending;await act(async()=>{pending=button.props.onClick()});await click(ui,'Übersicht');
 await act(async()=>{resolve({ok:true,json:async()=>({score:100,reason:'spät'})});await pending});assert.equal(Object.keys(JSON.parse(map.get(signReviewStorageKey('test-user')))).length,1);assert.match(text(ui.root),/Karte antippen/);await act(async()=>ui.unmount());
 }finally{globalThis.fetch=oldFetch}
});
test('missing quiz image is skipped without turning it into a wrong answer',async()=>{
 const map=env();let ui;await act(async()=>{ui=create(React.createElement(Signs))});await click(ui,'Bedeutung selbst eingeben');await act(async()=>ui.root.findByType('img').props.onError());assert.match(text(ui.root),/nicht bewertet/);await click(ui,'Zeichen überspringen');assert.match(text(ui.root),/Frage 2 von 10/);assert.equal(map.has(signReviewStorageKey('test-user')),false);await act(async()=>ui.unmount());
});
test('all five form and background-color answers complete a round with separate scoring',async()=>{
 env();let ui;await act(async()=>{ui=create(React.createElement(Signs))});await click(ui,'Form & Farbe');
 for(let i=0;i<5;i++){
  const heading=text(ui.root.findAllByType('h2')[0]),q=shapeQuestions.find(q=>heading.startsWith(q.name));assert.ok(q,heading);
  const selects=ui.root.findAllByType('select');await act(async()=>selects[0].props.onChange({target:{value:q.shape}}));await act(async()=>selects[1].props.onChange({target:{value:q.background}}));await click(ui,'Antwort prüfen');await click(ui,i===4?'Ergebnis ansehen':'Nächste Zeichenart');
 }
 assert.match(text(ui.root),/5 von 5 richtig/);await act(async()=>ui.unmount());
});
test('targeted drill completes with exact model answers and returns to area selection',async()=>{
 env();let ui;await act(async()=>{ui=create(React.createElement(Drill))});
 const b=ui.root.findAllByType('button').find(b=>text(b).includes('Warenannahme'));await act(async()=>b.props.onClick());
 for(let i=0;i<8;i++){const heading=text(ui.root.findAllByType('h2')[0]),q=practicalTrainingPool('receiving').find(q=>q.question===heading);assert.ok(q);await act(async()=>ui.root.findByType('textarea').props.onChange({target:{value:q.type==='number'?String(q.answer):q.solution}}));await click(ui,'Antwort prüfen');await click(ui,i===7?'Training auswerten':'Nächste Frage')}
 assert.match(text(ui.root),/100% im Training/);await act(async()=>ui.unmount());
});
test('all three continuous tasks finish at 100 with reconciled stock; case reset clears previous entries',async()=>{
 env();let ui;await act(async()=>{ui=create(React.createElement(Task))});
 for(const c of practicalTaskCases){
  await act(async()=>ui.root.findByType('select').props.onChange({target:{value:c.id}}));await click(ui,'Praxisaufgabe starten');
  for(const id of c.findings){const labels={article:'Artikelabweichung',quantity:'Mengenabweichung',damage:'Beschädigung'};const label=ui.root.findAllByType('label').find(n=>text(n)===labels[id]);await act(async()=>label.findByType('input').props.onChange())}
  await click(ui,'Schritt prüfen');await click(ui,'Nächster Schritt');await act(async()=>ui.root.findByType('textarea').props.onChange({target:{value:c.handling.solution}}));await click(ui,'Schritt prüfen');await click(ui,'Nächster Schritt');
  const device=ui.root.findAllByType('label').find(n=>text(n).startsWith('Frontgabelstapler'));await act(async()=>device.findByType('input').props.onChange());
  for(const fragment of ['Sicht- und Funktionskontrolle','Freier, geeigneter','Last, Schwerpunkt']){const l=ui.root.findAllByType('label').find(n=>text(n).startsWith(fragment));await act(async()=>l.findByType('input').props.onChange())}
  await click(ui,'Schritt prüfen');await click(ui,'Nächster Schritt');const place=ui.root.findAllByType('label').find(n=>text(n).startsWith('A-02-03'));await act(async()=>place.findByType('input').props.onChange());await click(ui,'Schritt prüfen');await click(ui,'Nächster Schritt');
  assert.ok(ui.root.findAllByType('input').every(n=>n.props.value===''));
  const solution=stockCardSolution(c.card);for(let i=0;i<2;i++)for(const [key,label] of [['incoming','Zugang'],['outgoing','Abgang'],['balance','Bestand']])await setInput(ui,`${label} Bewegung ${i+1}`,String(solution[i][key]));
  await click(ui,'Schritt prüfen');await click(ui,'Aufgabe auswerten');assert.match(text(ui.root),/100% Trainingsstand/);assert.equal(ui.root.findAll(n=>n.props.className==='taskSafety').length,0);await click(ui,'Anderen Fall auswählen');
 }
 await act(async()=>ui.unmount());
});
