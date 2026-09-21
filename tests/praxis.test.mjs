import test from 'node:test';
import assert from 'node:assert/strict';
import {CASES,evaluateDocument} from '../app/document-data.js';
import {EVENTS,decisionScore} from '../app/shift-data.js';
import {actionsFor,advanceJobs,cloneInitial} from '../app/warehouse-engine.js';
test('either identical duplicate is accepted, marking both is penalized; partial and clean cases score correctly',()=>{
 const c=CASES.find(c=>c.title==='Doppelte Position');
 for(const marks of [[0,3],[2,3]])assert.deepEqual(evaluateDocument(c,marks),{right:2,wrong:0,exact:true,percent:100});
 assert.equal(evaluateDocument(c,[0,2,3]).percent,50);
 assert.equal(evaluateDocument(c,[0]).percent,50);
 const clean=CASES.find(c=>!c.cells.some(cell=>cell[2]));
 assert.equal(evaluateDocument(clean,[]).percent,100);assert.equal(evaluateDocument(clean,[0]).percent,0);
 for(const c of CASES)assert.equal(evaluateDocument(c,c.cells.flatMap((cell,i)=>cell[2]?[i]:[])).percent,100);
});
test('every careful shift combination earns full credit; harmful choices cannot gain credit from speed',()=>{
 for(const e of EVENTS){assert.equal(e.choices[0][2].points,100);assert.ok(e.choices.every(c=>c[2].reason.length>10));}
 assert.equal(decisionScore(EVENTS.slice(0,8).map(e=>e.choices[0][2])),100);
 assert.equal(decisionScore(EVENTS.slice(0,8).map(e=>e.choices[2][2])),0);
 for(const index of [1,3,8,12,13])assert.equal(EVENTS[index].choices[1][2].points,100);
});
test('quarantine leaves documentation open; express priority saves time; dangerous mismatch is a real finding',()=>{
 let jobs=cloneInitial();jobs=advanceJobs(jobs,1,'Direkt ins Sperrlager').nextJobs;
 assert.equal(jobs.find(j=>j.id===1).stage,'secured');
 jobs=advanceJobs(jobs,1,'Schaden dokumentieren & prüfen').nextJobs;
 assert.equal(jobs.find(j=>j.id===1).stage,'inspection');
 const express=cloneInitial();assert.ok(advanceJobs(express,3,'Normal weiterbearbeiten').time>advanceJobs(express,3,'Priorisieren & Kommissionierung abschließen').time);
 jobs=advanceJobs(cloneInitial(),2,'Dokumente & Kennzeichnung prüfen').nextJobs;
 const job=jobs.find(j=>j.id===2);assert.match(job.text,/nicht überein/);
 assert.ok(actionsFor(job).find(a=>a.label==='Trotz Abweichung einlagern').safety<0);
});
