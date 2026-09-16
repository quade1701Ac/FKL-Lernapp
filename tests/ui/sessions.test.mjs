import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import {create,act} from 'react-test-renderer';
import Home from '../../app/page.js';
import { active } from '../../scripts/question-pool.mjs';
import { saved } from './supabase-mock.mjs';
globalThis.IS_REACT_ACT_ENVIRONMENT=true;
const text=node=>typeof node==='string'?node:(node.children||[]).map(text).join('');
const button=(ui,name)=>{const buttons=ui.root.findAllByType('button');return buttons.find(b=>b.findAllByType('strong').some(n=>text(n)===name))||buttons.find(b=>text(b)===name)||buttons.find(b=>text(b).includes(name))};
async function click(ui,name){const b=button(ui,name);assert.ok(b,name);assert.ok(!b.props.disabled,name);await act(async()=>b.props.onClick());}
function environment(){
 const values=new Map([['lagerlogik-active-user','test-user']]);
 globalThis.localStorage={getItem:k=>values.get(k)||null,setItem:(k,v)=>values.set(k,v),removeItem:k=>values.delete(k)};
 globalThis.window=new EventTarget();globalThis.alert=()=>{};saved.length=0;
}
async function answer(ui){
 const heading=ui.root.findAllByType('h1').map(text).find(t=>active.some(q=>q.question===t));
 const q=active.find(q=>q.question===heading);assert.ok(q,heading);
 if(q.type==='mc'){
  const options=ui.root.findAllByType('button').filter(b=>b.props.className?.includes('mcOption'));
  for(const correct of q.correct)await act(async()=>options.find(b=>text(b).endsWith(q.options[correct])).props.onClick());
 }else if(q.type==='order'){
  const component=ui.root.find(n=>n.props.order&&n.props.setOrder);
  await act(async()=>component.props.setOrder([...component.props.order].sort((a,b)=>a.correctIndex-b.correctIndex)));
 }else await act(async()=>ui.root.findByType('textarea').props.onChange({target:{value:q.type==='number'?String(q.answer).replace('.',','):q.solution}}));
 const b=button(ui,'Antwort prüfen')||button(ui,'Antwort speichern')||button(ui,'Prüfung abgeben');
 await act(async()=>b.props.onClick());
}
test('complete learning and exam sessions, all fields, cards, WiSo and mistakes navigation',async()=>{
 environment();let ui;await act(async()=>{ui=create(React.createElement(Home))});
 for(let field=1;field<=12;field++){
  const card=ui.root.findAllByType('button').find(b=>b.props.className==='fieldCard card'&&text(b).includes('LF '+field)&&!text(b).includes('LF '+field+'0'));
  await act(async()=>card.props.onClick());assert.match(text(ui.root),/Frage 1 von 20/);await click(ui,'Übersicht');
 }
 await click(ui,'20 adaptive Fragen mit direktem Feedback');
 for(let i=0;i<20;i++){await answer(ui);assert.ok(ui.root.findAll(n=>n.props.className==='feedback good').length);await click(ui,i===19?'Training auswerten':'Nächste Frage');}
 assert.match(text(ui.root),/Training beendet/);assert.equal(saved.length,20);
 await click(ui,'Zur Übersicht');await click(ui,'Prüfung');
 for(let i=0;i<30;i++){await answer(ui);if(i<29)assert.equal(ui.root.findAll(n=>typeof n.props.className==='string'&&n.props.className.startsWith('feedback ')).length,0);}
 assert.match(text(ui.root),/Schriftliche IHK-Simulation beendet/);assert.equal(saved.length,50);
 const areas=saved.slice(20).reduce((a,r)=>(a[r.field===13?'wiso':new Set([1,2,5,6,9,11,12]).has(r.field)?'process':'handling']++,a),{wiso:0,process:0,handling:0});assert.deepEqual(areas,{wiso:6,process:15,handling:9});
 await click(ui,'Zur Übersicht');await click(ui,'Lernkarten');await click(ui,'Lösung aufdecken');await click(ui,'Noch unsicher');assert.match(text(ui.root),/Frage 2 von 20/);
 await click(ui,'Übersicht');await click(ui,'Meine Fehler');assert.match(text(ui.root),/Frage 1 von/);
 await click(ui,'Übersicht');await click(ui,'WiSo');assert.match(text(ui.root),/Frage 1 von 20/);await answer(ui);
 await act(async()=>ui.unmount());
});
test('a delayed AI response is ignored after returning to overview',async t=>{
 environment();let finish;t.mock.method(globalThis,'fetch',()=>new Promise(resolve=>{finish=resolve}));
 let ui;await act(async()=>{ui=create(React.createElement(Home))});await click(ui,'20 adaptive Fragen mit direktem Feedback');
 // Choose a topic with free answers; advance locally until a free question appears.
 for(let i=0;!ui.root.findAll(n=>n.props.className==='typeBadge'&&text(n).includes('Freitext')).length&&i<20;i++){await answer(ui);await click(ui,'Nächste Frage');}
 const before=saved.length;await act(async()=>ui.root.findByType('textarea').props.onChange({target:{value:'Ich würde zunächst einen Testlauf vereinbaren.'}}));
 let pending;await act(async()=>{pending=button(ui,'Antwort prüfen').props.onClick();});
 assert.ok(finish);await click(ui,'Übersicht');
 await act(async()=>{finish(Response.json({score:100,model:'test'}));await pending;});
 assert.equal(saved.length,before);assert.match(text(ui.root),/Dein Lager/);await act(async()=>ui.unmount());
});
