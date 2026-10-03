import test from 'node:test';
import assert from 'node:assert/strict';
import {active,raw} from '../scripts/question-pool.mjs';
import {practicalQuestions} from '../app/questions-practical-2026.js';
import {learningFields} from '../app/data.js';
import {checkedPool} from '../app/smart-selection.js';
import {stockCardCases,stockCardSolution,evaluateStockCard,stockValue} from '../app/stock-card-data.js';
test('all 48 practical additions survive the real runtime filters',()=>{
 assert.equal(practicalQuestions.length,48);
 for(const q of practicalQuestions)assert.ok(active.some(a=>a.id===q.id),q.id);
});
test('normalizing before topic selection preserves aliased questions and matches field totals',()=>{
 const pool=checkedPool(raw);
 for(const id of ['q10-4-01','sit1-2-02','qb14-8-03','qb14-9-09']){
  const q=pool.find(q=>q.id===id);assert.ok(q,id);
  const f=learningFields.find(f=>f.id===q.field);assert.ok(f.topics.includes(q.topic),id);
  assert.ok(pool.filter(x=>x.field===f.id&&x.topic===q.topic).some(x=>x.id===id),id);
 }
 for(const f of learningFields){const field=pool.filter(q=>q.field===f.id);assert.equal(f.topics.reduce((n,t)=>n+field.filter(q=>q.topic===t).length,0),field.length)}
 assert.deepEqual(checkedPool(pool),pool,'filters remain stable on the canonical pool');
});
const entries=c=>stockCardSolution(c).map(r=>Object.fromEntries(Object.entries(r).map(([k,v])=>[k,String(v)])));
test('stock cards validate units, zero movement, quarantine and final arithmetic',()=>{
 assert.deepEqual(stockCardCases.map(c=>stockCardSolution(c).at(-1).balance),[141,214,69]);
 for(const c of stockCardCases){assert.equal(evaluateStockCard(c,entries(c)).percent,100);assert.equal(evaluateStockCard(c,[]).percent,0)}
 const c=stockCardCases[2],e=entries(c);e[0].incoming='24';assert.equal(evaluateStockCard(c,e).rows[0].correct.incoming,false);
 for(const value of ['', ' ', '1e2','Infinity','12abc','-1'])assert.equal(stockValue(value),null,value);
 assert.equal(stockValue(' 12,0 '),12);assert.equal(stockValue('0'),0);
});
test('correct continuation of an earlier balance error is not repeatedly penalized',()=>{
 const c=stockCardCases[0],e=entries(c);for(const row of e)row.balance=String(Number(row.balance)+1);
 const result=evaluateStockCard(c,e);assert.equal(result.points,8);assert.equal(result.percent,89);assert.equal(result.exact,false);
 assert.deepEqual(result.rows.map(r=>r.followThrough),[false,true,true]);
 e[1].outgoing='46';assert.equal(evaluateStockCard(c,e).rows[1].followThrough,false);
});
