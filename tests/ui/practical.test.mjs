import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import {create,act} from 'react-test-renderer';
import Stock from '../../app/StockCardWorkshop.js';
import Signs from '../../app/SafetySigns.js';
import Praxis from '../../app/Praxiswelt.js';
import {stockCardCases,stockCardSolution} from '../../app/stock-card-data.js';
import {safetySigns} from '../../app/safety-sign-data.js';
globalThis.IS_REACT_ACT_ENVIRONMENT=true;
const text=n=>typeof n==='string'?n:(n.children||[]).map(text).join('');
async function click(ui,label){const b=ui.root.findAllByType('button').find(b=>text(b)===label);assert.ok(b,label);await act(async()=>b.props.onClick());}
test('stock card can be reached from the hub, filled, graded and reset without leaking case entries',async()=>{
 let ui;await act(async()=>{ui=create(React.createElement(Praxis))});
 const hub=ui.root.findAllByType('button').find(b=>text(b).includes('Lagerfachkarte'));await act(async()=>hub.props.onClick());
 assert.equal(ui.root.findAllByType('input').length,9);
 assert.equal(ui.root.findAllByType('button').find(b=>text(b)==='Fachkarte prüfen').props.disabled,true);
 const solution=stockCardSolution(stockCardCases[0]);
 for(let i=0;i<3;i++)for(const [key,label] of [['incoming','Zugang'],['outgoing','Abgang'],['balance','Bestand']]){
  const input=ui.root.findAllByType('input').find(n=>n.props['aria-label']===`${label} Bewegung ${i+1}`);
  await act(async()=>input.props.onChange({target:{value:String(solution[i][key])}}));
 }
 await click(ui,'Fachkarte prüfen');assert.match(text(ui.root),/100% · 9 von 9 Punkten/);assert.ok(ui.root.findAllByType('input').every(n=>n.props.disabled));
 await act(async()=>ui.root.findByType('select').props.onChange({target:{value:stockCardCases[2].id}}));
 assert.ok(ui.root.findAllByType('input').every(n=>n.props.value===''&&!n.props.disabled));
 await click(ui,'← Praxiswelt');assert.match(text(ui.root),/Training & Simulationen/);await act(async()=>ui.unmount());
});
test('all six sign groups filter correctly and ten-image quiz gives an exact score',async()=>{
 let ui;await act(async()=>{ui=create(React.createElement(Signs))});
 for(const [kind,label] of [['mandatory','Gebote'],['prohibited','Verbote'],['warning','Warnung'],['rescue','Rettung'],['fire','Brandschutz'],['ghs','Gefahrstoffe']]){
  await click(ui,label);assert.equal(ui.root.findAllByType('img').length,safetySigns.filter(s=>s.kind===kind).length);
 }
 await click(ui,'Alle');await click(ui,'10 Zeichen abfragen');
 for(let i=0;i<10;i++){
  const code=ui.root.findByType('img').props.alt.split(' ').at(-1);await click(ui,safetySigns.find(s=>s.code===code).label);
  await click(ui,i===9?'Ergebnis ansehen':'Nächstes Zeichen');
 }
 assert.match(text(ui.root),/10 von 10 richtig/);await act(async()=>ui.unmount());
});
