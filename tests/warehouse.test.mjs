import test from 'node:test';
import assert from 'node:assert/strict';
import { cloneInitial, actionsFor, advanceJobs, shiftPerformance } from '../app/warehouse-engine.js';
test('express follows pick, pack, dispatch and cannot repeat an obsolete action',()=>{
 let jobs=cloneInitial();const label=actionsFor(jobs.find(j=>j.id===3))[0].label;
 jobs=advanceJobs(jobs,3,label).nextJobs;
 assert.equal(jobs.find(j=>j.id===3).stage,'packing');assert.equal(advanceJobs(jobs,3,label),null);
 jobs=advanceJobs(jobs,3,actionsFor(jobs.find(j=>j.id===3))[0].label).nextJobs;
 assert.equal(jobs.find(j=>j.id===3).area,'out');
 jobs=advanceJobs(jobs,3,actionsFor(jobs.find(j=>j.id===3))[0].label).nextJobs;
 assert.ok(!jobs.some(j=>j.id===3));
});
test('completion consumes time before deadline judgement, exactly at deadline is on time',()=>{
 const job={...cloneInitial().find(j=>j.id===3),stage:'ready',area:'out',due:1};
 assert.equal(advanceJobs([job],3,actionsFor(job)[0].label).late,1);
 assert.equal(advanceJobs([{...job,due:2}],3,actionsFor(job)[0].label).late,0);
});
test('all reachable process states have a continuation and initial early finish earns zero',()=>{
 const pending=cloneInitial(),seen=new Set();while(pending.length){const job=pending.pop(),key=job.kind+job.stage;if(seen.has(key))continue;seen.add(key);const actions=actionsFor(job);assert.ok(actions.length,key);for(const a of actions){assert.ok(a.complete||a.next?.stage,key);if(a.next)pending.push({...job,...a.next});}}
 assert.equal(shiftPerformance(100,100,100,5),0);assert.equal(shiftPerformance(100,100,100,0),100);
});
