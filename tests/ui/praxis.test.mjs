import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import {create,act} from 'react-test-renderer';
import Docs from '../../app/DocumentWorkshop.js';
import Shift from '../../app/ShiftSimulator.js';
import Warehouse from '../../app/WarehouseTycoon.js';
import {CASES} from '../../app/document-data.js';
import {EVENTS} from '../../app/shift-data.js';
globalThis.IS_REACT_ACT_ENVIRONMENT=true;
const text=n=>typeof n==='string'?n:(n.children||[]).map(text).join('');
async function click(ui,label){const b=ui.root.findAllByType('button').find(b=>text(b).includes(label));assert.ok(b,label);await act(async()=>b.props.onClick());}
test('document round accepts correct marks through final partial-credit summary',async()=>{
 let ui;await act(async()=>{ui=create(React.createElement(Docs))});
 for(let i=0;i<6;i++){const title=ui.root.findAllByType('h2').map(text).find(t=>CASES.some(c=>c.title===t));const c=CASES.find(c=>c.title===title);const rows=ui.root.findAllByType('button').filter(b=>b.findAllByType('strong').length);for(let j=0;j<c.cells.length;j++)if(c.cells[j][2])await act(async()=>rows[j].props.onClick());await click(ui,'Prüfung abschließen');assert.match(text(ui.root),/✓ Vollständig richtig/);await click(ui,i===5?'Auswertung':'Nächster Fall');}
 assert.match(text(ui.root),/100% mit Teilpunkten/);await act(async()=>ui.unmount());
});
test('careful shift ends at 100 percent with reasons',async()=>{
 let ui;await act(async()=>{ui=create(React.createElement(Shift))});
 for(let i=0;i<8;i++){const title=text(ui.root.findByType('h1'));const e=EVENTS.find(e=>e.title===title);await click(ui,e.choices[0][0]);}
 assert.match(text(ui.root),/100% Entscheidungsqualität/);assert.equal(ui.root.findAll(n=>n.props.className==='shiftLog')[0].children.length,8);await act(async()=>ui.unmount());
});
test('warehouse retains complete history and shows action duration',async()=>{
 let ui;await act(async()=>{ui=create(React.createElement(Warehouse))});
 const steps=[['Express 381','Priorisieren'],['Express 381','Express verpacken'],['Express 381','Verladen'],['Auftrag 377','Verpacken'],['Auftrag 377','Verladen'],['Lieferung 4711','Schaden dokumentieren'],['Lieferung 4711','Restware freigeben'],['A-Artikel X14','Bestand gezielt'],['A-Artikel X14','Differenz klären'],['Gefahrgut-Lieferung','Dokumente &'],['Gefahrgut-Lieferung','Abweichung feststellen']];
 for(const [job,action] of steps){await click(ui,job);assert.match(text(ui.root.find(n=>n.props.className==='jobActions')),/2 min/);await click(ui,action);}
 assert.match(text(ui.root),/SCHICHT BEENDET/);assert.ok(ui.root.find(n=>n.props.className==='pressureLog').findAllByType('p').length>10);assert.match(text(ui.root),/Expressauftrag priorisiert/);await act(async()=>ui.unmount());
});
