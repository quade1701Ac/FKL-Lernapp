import test from 'node:test';
import assert from 'node:assert/strict';
import { active } from '../scripts/question-pool.mjs';
import { smartPick, randomPick, examPick, examComposition } from '../app/smart-selection.js';
test('every active question has valid structure and unique identity',()=>{
 assert.equal(new Set(active.map(q=>String(q.id))).size,active.length);
 for(const q of active){assert.ok(q.solution,q.id);assert.ok(q.question,q.id);if(q.type==='mc'){assert.ok(q.correct.every(i=>Number.isInteger(i)&&i>=0&&i<q.options.length),q.id);assert.equal(new Set(q.correct).size,q.correct.length,q.id)}if(q.type==='number'){assert.ok(Number.isFinite(q.answer),q.id);assert.ok(q.tolerance>=0,q.id)}}
});
test('all twelve fields and WiSo can provide twenty questions',()=>{for(let field=1;field<=13;field++)assert.equal(randomPick(active.filter(q=>q.field===field),20).length,20,`field ${field}`)});
test('selection preserves MC truth when shuffling and never mutates pool',()=>{
 const before=JSON.stringify(active);
 for(let round=0;round<10;round++)for(const q of smartPick(active,20)){if(q.type==='mc'){const orig=active.find(x=>x.id===q.id);assert.deepEqual(q.correct.map(i=>q.options[i]).sort(),orig.correct.map(i=>orig.options[i]).sort())}}
 assert.equal(JSON.stringify(active),before);
});
test('30-question balancing and diagnostic minimum',()=>{
 const result=examPick(active.filter(q=>q.field<=12),30),composition=examComposition(result);
 assert.equal(result.length,30);assert.equal(composition.minField,2);assert.equal(Object.keys(composition.fields).length,12);
});
