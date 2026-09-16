import test from 'node:test';
import assert from 'node:assert/strict';
import { POST } from '../app/api/grade/route.js';
const request = (body) => new Request('http://localhost/api/grade',{method:'POST',body:JSON.stringify(body)});
const answer = {question:'Warum hilft eine Testbestellung?',answer:'Die Qualität vor einem Großauftrag prüfen.',solution:'Qualität erproben',keywords:['Qualität']};
const provider = content => Response.json({choices:[{message:{content}}]});
test('provider network failure tries fallback; client count cannot invent an assignment',async t=>{
  const key=process.env.GROQ_API_KEY;process.env.GROQ_API_KEY='test-only';t.after(()=>{if(key===undefined)delete process.env.GROQ_API_KEY;else process.env.GROQ_API_KEY=key;});
  const calls=[];t.mock.method(globalThis,'fetch',async(url,options)=>{calls.push(JSON.parse(options.body));if(calls.length===1)throw new TypeError('network');return provider('VERDICT: FULL\nREASON: Richtige Begründung.\nCONFIDENCE: 0');});
  const response=await POST(request({...answer,requestedCount:3})),data=await response.json();
  assert.equal(response.status,200);assert.equal(data.score,100);assert.equal(data.confidence,0);assert.equal(data.requestedCount,null);assert.equal(calls.length,2);assert.notEqual(calls[0].model,calls[1].model);
});
test('malformed count and verdict never become valid scores',async t=>{
  const key=process.env.GROQ_API_KEY;process.env.GROQ_API_KEY='test-only';t.after(()=>{if(key===undefined)delete process.env.GROQ_API_KEY;else process.env.GROQ_API_KEY=key;});
  t.mock.method(globalThis,'fetch',async()=>provider('VERDICT: FULL nonsense\nREASON: unzulässig'));
  assert.equal((await POST(request(answer))).status,502);
  assert.equal((await POST(request({...answer,question:'Nenne drei Vorteile.'}))).status,502);
});
test('invalid request types are rejected before contacting provider',async t=>{
  const key=process.env.GROQ_API_KEY;process.env.GROQ_API_KEY='test-only';t.after(()=>{if(key===undefined)delete process.env.GROQ_API_KEY;else process.env.GROQ_API_KEY=key;});
  t.mock.method(globalThis,'fetch',()=>{throw new Error('must not be called')});
  assert.equal((await POST(request({...answer,keywords:{bad:true}}))).status,400);
  assert.equal((await POST(request({...answer,answer:'x'.repeat(6001)}))).status,400);
});
