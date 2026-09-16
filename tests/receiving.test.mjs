import test from 'node:test';
import assert from 'node:assert/strict';
import {scoreAnswerHybrid} from '../app/hybrid-score.js';
import {POST} from '../app/api/grade/route.js';
import {receivingQuestion,receivingCases} from './receiving-cases.mjs';
test('receiving process variants reach second review instead of trusting keyword coverage',async t=>{
 assert.ok(receivingQuestion);
 let calls=0;t.mock.method(globalThis,'fetch',async()=>{calls++;return Response.json({score:50,reason:'Controlled provider response',model:'test'})});
 for(const sample of receivingCases){
  const result=await scoreAnswerHybrid(sample.answer,sample.question||receivingQuestion);
  assert.equal(result.ai,true,sample.name);assert.equal(result.score,50,sample.name);
 }
 assert.equal(calls,receivingCases.length);
});
test('provider receives process scope as system rule and unchanged learner answer',async t=>{
 const key=process.env.GROQ_API_KEY;process.env.GROQ_API_KEY='test-only';
 t.after(()=>{if(key===undefined)delete process.env.GROQ_API_KEY;else process.env.GROQ_API_KEY=key});
 t.mock.method(globalThis,'fetch',async(url,options)=>{
  const {messages}=JSON.parse(options.body);
  assert.match(messages[0].content,/Prozessabschnitt/);
  assert.match(messages[0].content,/Wesentliche Auslassungen/);
  assert.ok(messages[1].content.includes(receivingCases[0].answer));
  return Response.json({choices:[{message:{content:'VERDICT: FULL\nREASON: Gefragter Abschnitt erfüllt.\nCONFIDENCE: 0.95'}}]});
 });
 const response=await POST(new Request('http://localhost/api/grade',{method:'POST',body:JSON.stringify({...receivingQuestion,answer:receivingCases[0].answer})}));
 assert.equal(response.status,200);assert.equal((await response.json()).score,100);
});
