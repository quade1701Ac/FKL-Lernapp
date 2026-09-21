import test from 'node:test';
import assert from 'node:assert/strict';
import {createShift,assignTask,tickShift,shiftResult,SHIFTS} from '../app/warehouse-shifts.js';
import {actionsFor} from '../app/warehouse-engine.js';
const assign=(s,w,j)=>assignTask(s,w,j.id,actionsFor(j).find(a=>!a.bad).label);
test('two workers complete tasks simultaneously; busy workers and duplicate job assignments are rejected',()=>{
 let s=createShift();const original=JSON.stringify(s);let next=assign(s,1,s.jobs[0]);assert.equal(JSON.stringify(s),original);
 assert.equal(assign(next,2,s.jobs[0]),next);assert.equal(assign(next,1,s.jobs[1]),next);
 next=assign(next,2,s.jobs[1]);next=tickShift(next);assert.ok(next.workers.every(w=>w.task));
 next=tickShift(next);assert.ok(next.workers.every(w=>!w.task));assert.equal(next.minute,2);assert.equal(next.log.filter(e=>e.kind==='complete').length,2);
});
test('future arrivals happen exactly once and prevent premature finish; early finish never awards full credit',()=>{
 let s=createShift();const pending=s.pending.length;s={...s,jobs:[]};s=tickShift(s);assert.equal(s.done,false);
 while(s.minute<6)s=tickShift(s);assert.equal(s.pending.length,pending-1);assert.equal(s.jobs.length,1);
 s=tickShift(s);assert.equal(s.jobs.length,1);assert.equal(shiftResult(s).performance,0);
});
test('deadline completion is on time; waiting is explained; frozen end does not complete tasks',()=>{
 let s=createShift();s={...s,jobs:[{...s.jobs[2],stage:'ready',deadline:2}],pending:[],total:1};s=assign(s,1,s.jobs[0]);s=tickShift(tickShift(s));assert.equal(s.late,0);assert.equal(s.completed,1);assert.equal(s.done,true);assert.equal(tickShift(s),s);
 s=createShift();s={...s,jobs:[{...s.jobs[0],deadline:0}]};s=tickShift(s);assert.equal(s.late,1);assert.match(s.log[0].text,/wartete/);s=tickShift(s);assert.equal(s.late,1);
 s={...createShift(),minute:39};s=assign(s,1,s.jobs[0]);s=tickShift(s);assert.equal(s.done,true);assert.ok(s.workers[0].task);assert.equal(s.completed,0);
});
test('all three shifts are solvable safely and on time using two workers',()=>{
 for(const scenario of SHIFTS){let s=createShift(scenario.id);assert.equal(new Set([...s.jobs,...s.pending].map(j=>j.id)).size,s.total);
  while(!s.done){for(const w of s.workers){if(w.task)continue;const job=s.jobs.filter(j=>!s.workers.some(w=>w.task?.jobId===j.id)).sort((a,b)=>a.deadline-b.deadline)[0];if(job)s=assign(s,w.id,job);}s=tickShift(s);}
  assert.equal(s.completed,s.total,scenario.id);assert.equal(s.late,0,scenario.id);assert.equal(shiftResult(s).performance,100,scenario.id);
 }
});
