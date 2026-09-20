import test from 'node:test';
import assert from 'node:assert/strict';
import {raw,active} from '../scripts/question-pool.mjs';
import {EXAM_AREAS,buildWrittenExam,pickExamArea} from '../app/exam-selection.js';
test('200 exams preserve 15/9/6, field balance, type quotas and MC truth',t=>{
 let seed=20260920;t.mock.method(Math,'random',()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296});
 const before=JSON.stringify(raw),variants=new Set(),extraFields=new Set();
 for(let i=0;i<200;i++){
  const exam=buildWrittenExam(raw);assert.equal(exam.length,30);assert.equal(new Set(exam.map(q=>String(q.id))).size,30);
  variants.add(exam.map(q=>q.id).join(','));
  for(const area of EXAM_AREAS){
   const picked=exam.filter(q=>q._examArea===area.name);assert.equal(picked.length,area.size);
   for(const f of area.fields){const count=picked.filter(q=>q.field===f).length;assert.ok(count>=Math.floor(area.size/area.fields.length)&&count<=Math.ceil(area.size/area.fields.length));if(area.size===15&&count===3)extraFields.add(f)}
   for(const [type,count] of Object.entries(area.types))assert.equal(picked.filter(q=>q.type===type).length,count,area.name+' '+type);
  }
  for(const q of exam.filter(q=>q.type==='mc')){const original=raw.find(x=>String(x.id)===String(q.id));assert.deepEqual(q.correct.map(i=>q.options[i]).sort(),original.correct.map(i=>original.options[i]).sort())}
 }
 assert.equal(variants.size,200);assert.equal(extraFields.size,7);assert.equal(JSON.stringify(raw),before);
});
test('unavailable types are replaced without losing field balance',()=>{
 const pool=active.filter(q=>q.type==='mc');const exam=buildWrittenExam(pool);
 assert.equal(exam.length,30);assert.ok(exam.every(q=>q.type==='mc'));
 for(const area of EXAM_AREAS)for(const f of area.fields){const n=exam.filter(q=>q.field===f).length;assert.ok(n>=Math.floor(area.size/area.fields.length)&&n<=Math.ceil(area.size/area.fields.length))}
});
test('scarce fields donate slots, short areas do not start incomplete exams',()=>{
 const area=EXAM_AREAS[0];const pool=active.filter(q=>q.field!==1);pool.push(active.find(q=>q.field===1));
 const selected=pickExamArea(pool,area);assert.equal(selected.length,15);assert.equal(selected.filter(q=>q.field===1).length,1);
 assert.deepEqual(pickExamArea([],area),[]);
 assert.throws(()=>buildWrittenExam(active.filter(q=>q.field!==13)),/nicht genügend/);
});
