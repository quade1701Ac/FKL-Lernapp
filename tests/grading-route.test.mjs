import test from 'node:test';
import assert from 'node:assert/strict';
import { POST } from '../app/api/grade/route.js';
const request = (body) => new Request('http://localhost/api/grade',{method:'POST',body:JSON.stringify(body)});
const answer = {question:'Erkläre den Nutzen einer Testbestellung.',answer:'Die Qualität vor einem Großauftrag prüfen.',solution:'Qualität erproben',keywords:['Qualität']};
const provider = content => Response.json({choices:[{message:{content}}]});
test('provider network failure tries fallback; client count cannot invent an assignment',async t=>{
  const key=process.env.GROQ_API_KEY;process.env.GROQ_API_KEY='test-only';t.after(()=>{if(key===undefined)delete process.env.GROQ_API_KEY;else process.env.GROQ_API_KEY=key;});
  const calls=[];t.mock.method(globalThis,'fetch',async(url,options)=>{calls.push(JSON.parse(options.body));if(calls.length===1)throw new TypeError('network');return provider(JSON.stringify({criteria:[{label:'Eine fachlich richtige und ausreichende Ursache oder Wirkung erklären',kind:'core',weight:100,credit:1,evidence:'Qualität vor einem Großauftrag prüfen',reason:'Qualitätsprüfung beschrieben.'}],criticalError:null,confidence:0}));});
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
test('deductions receive a separate scope audit before being returned',async t=>{
 const key=process.env.GROQ_API_KEY;process.env.GROQ_API_KEY='test-only';t.after(()=>{if(key===undefined)delete process.env.GROQ_API_KEY;else process.env.GROQ_API_KEY=key;});
 let calls=0;t.mock.method(globalThis,'fetch',async(url,options)=>{
  calls++;const body=JSON.parse(options.body);
  if(calls===2)assert.match(body.messages[1].content,/Zulässigkeit der Abzüge/);
  const criteria=calls===1?[
   {label:'Qualität prüfen',kind:'core',weight:80,credit:1,evidence:'Qualität',reason:'Richtig.'},
   {label:'Dokumentieren',kind:'detail',weight:20,credit:0,evidence:'',reason:'Dokumentation fehlt.'}
  ]:[{label:'Qualität prüfen',kind:'core',weight:100,credit:1,evidence:'Qualität',reason:'Richtige Begründung.'}];
  return provider(JSON.stringify({criteria,criticalError:null,confidence:0.9}));
 });
 const result=await POST(request(answer));assert.equal(result.status,200);assert.equal((await result.json()).score,100);assert.equal(calls,2);
});
test('wrong sign meaning is rejected within fixed scope without a duplicate deduction audit',async t=>{
 const key=process.env.GROQ_API_KEY;process.env.GROQ_API_KEY='test-only';t.after(()=>{if(key===undefined)delete process.env.GROQ_API_KEY;else process.env.GROQ_API_KEY=key;});
 let calls=0;t.mock.method(globalThis,'fetch',async()=>{calls++;return provider(JSON.stringify({criteria:[{label:'Bedeutung des Zeichens sinngemäß richtig nennen',kind:'core',weight:100,credit:0,evidence:'',reason:'Rauchverbot wird als Erlaubnis umgekehrt.'}],criticalError:null,confidence:.99}))});
 const response=await POST(request({question:'Welche Bedeutung hat dieses abgebildete Zeichen? Nenne die Bedeutung; eine zusätzliche Beschreibung der Form oder Farbe ist nicht erforderlich.',solution:'Rauchen verboten',answer:'Hier ist Rauchen erlaubt.',keywords:['Rauchen','verboten']}));
 assert.equal(response.status,200);const data=await response.json();assert.equal(data.score,0);assert.equal(calls,1);assert.equal(data.criteria[0].weight,100);
});
