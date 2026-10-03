import test from 'node:test';
import assert from 'node:assert/strict';
import {active} from '../scripts/question-pool.mjs';
import {practicalAreas,practicalTrainingPool} from '../app/practical-training-data.js';
import {safetySigns} from '../app/safety-sign-data.js';
import {shapeQuestions,shapeGrade,pictureKey,shapeKey,signRound,recordSignReview,signReviewStorageKey,readSignReviews} from '../app/sign-training.js';
import {practicalTaskCases,evaluateTaskStep,summarizeTask} from '../app/practical-task-data.js';
import {stockCardSolution} from '../app/stock-card-data.js';
test('practical entry covers all four areas without duplicate or inaccessible questions',()=>{
 const pool=practicalTrainingPool();assert.equal(pool.length,42);assert.equal(new Set(pool.map(q=>q.id)).size,42);
 assert.deepEqual(practicalAreas.map(a=>practicalTrainingPool(a.id).length),[8,9,12,13]);
 for(const q of pool)assert.ok(active.some(a=>a.id===q.id),q.id);
});
test('wrong signs are repeated first and mastery removes them from uncertain-only rounds',()=>{
 let reviews=recordSignReview({},pictureKey('M003'),0,1000);reviews=recordSignReview(reviews,pictureKey('P006'),50,1001);
 const normal=signRound(safetySigns,reviews,false,()=>.25);assert.equal(normal.length,10);assert.deepEqual(new Set(normal.slice(0,2).map(s=>s.code)),new Set(['M003','P006']));
 assert.equal(signRound(safetySigns,reviews,true).length,2);
 reviews=recordSignReview(reviews,pictureKey('M003'),100,1002);assert.deepEqual(signRound(safetySigns,reviews,true).map(s=>s.code),['P006']);
 assert.equal(reviews[pictureKey('M003')].attempts,2);assert.equal(recordSignReview(reviews,'invalid',NaN),reviews);
});
test('device storage isolates accounts, accepts safe records and handles damaged storage',()=>{
 const map=new Map(),storage={getItem:k=>map.get(k)||null};
 map.set(signReviewStorageKey('a'),JSON.stringify(recordSignReview({},pictureKey('P002'),0)));
 assert.equal(readSignReviews(storage,'a')[pictureKey('P002')].score,0);assert.deepEqual(readSignReviews(storage,'b'),{});
 map.set(signReviewStorageKey('a'),'not-json');assert.deepEqual(readSignReviews(storage,'a'),{});
 map.set(signReviewStorageKey('a'),JSON.stringify({bad:{score:2},'picture:M003':{score:'100'},'shape:warning':{score:50}}));assert.deepEqual(Object.keys(readSignReviews(storage,'a')),[shapeKey('warning')]);
});
test('prohibition background is white and differs from its red safety color; shape and color earn separate points',()=>{
 assert.equal(shapeQuestions.length,5);const q=shapeQuestions.find(q=>q.id==='prohibited');assert.equal(q.background,'Weiß');
 assert.equal(shapeGrade(q,'Kreis','Rot').score,50);assert.equal(shapeGrade(q,'Kreis','Weiß').score,100);assert.equal(shapeGrade(q,'Dreieck','Blau').score,0);
});
test('complete practical cases reconcile delivery, quarantine, equipment, shelf limits and stock',()=>{
 assert.deepEqual(practicalTaskCases.map(c=>c.card.movements[0].incoming),[108,96,96]);
 assert.deepEqual(practicalTaskCases.map(c=>stockCardSolution(c.card).at(-1).balance),[193,86,156]);
 for(const c of practicalTaskCases){
  const entries=stockCardSolution(c.card).map(row=>Object.fromEntries(Object.entries(row).map(([k,v])=>[k,String(v)])));
  const results=[evaluateTaskStep(c,0,{findings:c.findings}),{score:100,critical:false},evaluateTaskStep(c,2,{device:'forklift',checks:['condition','route','load']}),evaluateTaskStep(c,3,{place:'A'}),evaluateTaskStep(c,4,{entries})];
  assert.deepEqual(summarizeTask(results),{percent:100,critical:false});
  assert.equal(evaluateTaskStep(c,0,{findings:[...c.findings,'recipient']}).score,0);
  const wrong=evaluateTaskStep(c,2,{device:'small',checks:['condition','route','load']});assert.ok(wrong.critical);assert.ok(wrong.score<=20);
  assert.ok(evaluateTaskStep(c,2,{device:'forklift',checks:['condition','route','load','postpone']}).critical);
  assert.ok(evaluateTaskStep(c,3,{place:'B'}).critical);assert.ok(evaluateTaskStep(c,3,{place:'C'}).critical);
  assert.equal(summarizeTask([results[0],results[1],wrong,results[3],results[4]]).critical,true);
 }
});
