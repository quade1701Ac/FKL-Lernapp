import test from 'node:test';
import assert from 'node:assert/strict';
import { scoreAnswerHybrid } from '../app/hybrid-score.js';
import { scoreAnswerV07 } from '../app/v07-utils.js';
import { parseLocalizedNumber } from '../app/grading-contract.js';
import { active } from '../scripts/question-pool.mjs';

test('every selectable reference answer receives full credit',()=>{
  for(const q of active.filter(q=>q.type==='free')) assert.equal(scoreAnswerV07(q.solution,q).score,100,q.id);
});
test('numeric answers accept German formatting but reject expressions and unrelated prose',()=>{
  for(const [input,value] of [['7.200',7200],['1.234,50 €',1234.5],['12,5 %',12.5],['-2,5',-2.5],['12.5',12.5]]) assert.equal(parseLocalizedNumber(input),value,input);
  for(const input of ['12+3','12 3','abc123','1,2,3','1.2.3','', 'Infinity']) assert.equal(parseLocalizedNumber(input),null,input);
});
test('short plausible answers and low local scores reach AI; corrections are not averaged away',async t=>{
  let calls=0;t.mock.method(globalThis,'fetch',async()=>{calls++;return Response.json({score:100,model:'test',reason:'Gültige Risikobegrenzung'});});
  const q={type:'free',question:'Wie könntest du das Risiko begrenzen?',solution:'Einen Probelauf vereinbaren und die Lieferqualität prüfen.',keywords:['Probelauf','Lieferqualität','prüfen'],minHits:3};
  const result=await scoreAnswerHybrid('Testweise kleinere Mengen bestellen',q);
  assert.equal(calls,1);assert.equal(result.score,100);assert.equal(result.ai,true);
});
test('clear nonanswers stay local and malformed AI scores fall back',async t=>{
  let calls=0;t.mock.method(globalThis,'fetch',async()=>{calls++;return Response.json({score:null});});
  const q={type:'free',question:'Wie begrenzt du das Risiko?',solution:'Kleine Testbestellung',keywords:['Testbestellung']};
  assert.equal((await scoreAnswerHybrid('keine Ahnung',q)).score,0);assert.equal(calls,0);
  const result=await scoreAnswerHybrid('Zunächst die Qualität erproben',q);
  assert.equal(result.ai,false);assert.match(result.aiStatus,/ungültiger KI-Score/);
});
