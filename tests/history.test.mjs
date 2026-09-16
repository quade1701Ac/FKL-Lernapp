import test from 'node:test';
import assert from 'node:assert/strict';
import { buildReviews, buildStats, loadAnswerHistory } from '../app/history.js';
test('reviews replay actual answer dates, not login date',()=>{
 const rows=[{question_id:'x',field:1,score:100,created_at:'2026-01-01T00:00:00Z'},{question_id:'x',field:1,score:100,created_at:'2026-01-02T00:00:00Z'}];
 const r=buildReviews(rows.reverse()).x;
 assert.equal(r.box,2);assert.equal(r.next,Date.parse('2026-01-05T00:00:00Z'));
 assert.equal(buildStats(rows)[1].answered,2);
});
test('wrong answer resets the box',()=>{
 assert.equal(buildReviews([{question_id:'x',score:100,answered_at:'2026-01-01'},{question_id:'x',score:0,answered_at:'2026-01-02'}]).x.box,0);
});
test('history is user-filtered and paginated',async()=>{
 const calls=[];const client={from(){return {select(){return this},eq(k,v){assert.equal(k,'user_id');assert.equal(v,'alice');return this},order(){return this},range(a,b){calls.push([a,b]);return Promise.resolve({data:Array.from({length:a===0?500:2},()=>({question_id:'x',created_at:'2026-01-01'}))})}}}};
 assert.equal((await loadAnswerHistory(client,'alice')).length,502);assert.equal(calls.length,2);
});
test('missing created_at falls back, network errors do not',async()=>{
 let column;const client={from(){return {select(s){column=s;return this},eq(){return this},order(){return this},range(){return Promise.resolve(column.includes('created_at')?{error:{code:'42703',message:'missing'}}:{data:[{question_id:'x',answered_at:'2026-01-01'}]})}}}};
 assert.equal((await loadAnswerHistory(client,'alice'))[0].created_at,'2026-01-01');
 const broken={from(){return {select(){return this},eq(){return this},order(){return this},range(){return Promise.resolve({error:{message:'network'}})}}}};
 await assert.rejects(loadAnswerHistory(broken,'alice'),/network/);
});
