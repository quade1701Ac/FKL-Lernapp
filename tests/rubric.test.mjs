import test from 'node:test';
import assert from 'node:assert/strict';
import {evaluateRubric} from '../app/grading-contract.js';
const answer='Ich nehme die Ware nicht an und informiere den Lieferanten das er am falschen ort ist.';
const rubric=()=>({criteria:[
 {label:'Ungeklärte Lieferung nicht regulär annehmen',kind:'core',weight:60,credit:1,evidence:'nehme die Ware nicht an',reason:'Annahme bis zur Klärung gestoppt.'},
 {label:'Klärung mit Lieferanten anstoßen',kind:'core',weight:20,credit:1,evidence:'informiere den Lieferanten',reason:'Lieferant informiert.'},
 {label:'Papierfehler oder Fehlzustellung unterscheiden',kind:'detail',weight:20,credit:0,evidence:'',reason:'Prüfen, ob die Ware oder nur die Empfängerangabe falsch ist.'}
],criticalError:null,confidence:0.9});
const grade=(data= rubric(),text=answer)=>evaluateRubric(JSON.stringify(data),text);
test('correct core with one missing detail earns 80 with explicit deduction',()=>{
 const r=grade();assert.equal(r.score,80);assert.match(r.reason,/−20 Punkte/);assert.equal(r.criteria[0].points,60);
});
test('complete, partial and wrong answers receive criterion credit instead of fixed buckets',()=>{
 let r=rubric();r.criteria[2].credit=1;r.criteria[2].evidence='falschen ort';assert.equal(grade(r).score,100);
 r=rubric();r.criteria[1].credit=0.5;assert.equal(grade(r).score,70);
 r=rubric();r.criteria.forEach(c=>c.credit=0);assert.equal(grade(r).score,0);
});
test('dangerous explicit contradiction caps credit; invented evidence is rejected',()=>{
 const r=rubric();r.criticalError={evidence:'trotzdem einlagern',reason:'Ungeklärte Ware freigeben.'};
 assert.equal(grade(r),null);
 assert.equal(grade(r,answer+' Trotzdem einlagern.').score,20);
 r.criteria[0].evidence='Prüfung durchgeführt';assert.equal(grade(r,answer+' Trotzdem einlagern.'),null);
});
test('malformed weights, unsupported credits and excessive detail weighting fail closed',()=>{
 for(const mutate of [r=>r.criteria[0].weight=70,r=>r.criteria[0].credit=0.9,r=>r.criteria[0].kind='detail',r=>r.criteria[0].evidence='',r=>r.criteria[0].reason='',r=>{r.criteria[0].weight=40;r.criteria[2].weight=40}]){
  const r=rubric();mutate(r);assert.equal(grade(r),null);
 }
 assert.equal(evaluateRubric('not json',answer),null);
});

import {fixedRubric} from '../app/grading-contract.js';
test('teacher criteria prevent invented process requirements and alternative causes',()=>{
 const q='Eine Lieferung trifft mit korrekter Packstückzahl ein, aber der Empfänger auf den Papieren ist eine andere Niederlassung. Wie gehst du vor?';
 const fixed=fixedRubric(q,'procedure');assert.deepEqual(fixed.map(c=>c.weight),[50,30,20]);
 const r=rubric();r.criteria.forEach((c,i)=>Object.assign(c,fixed[i]));assert.equal(evaluateRubric(JSON.stringify(r),answer,fixed).score,80);
 r.criteria[0].label='Lieferunterlagen ausdrücklich erneut prüfen';assert.equal(evaluateRubric(JSON.stringify(r),answer,fixed),null);
 assert.equal(fixedRubric('Warum ist ein Sicherheitsbestand sinnvoll?','explanation').length,1);
 assert.equal(fixedRubric('Warum ist ein Sicherheitsbestand sinnvoll und welche Kosten entstehen?','explanation'),null);
});
test('sign meaning uses one teacher criterion and cannot require additional shape or color details',()=>{
 const question='Welche Bedeutung hat dieses abgebildete Zeichen? Nenne die Bedeutung; eine zusätzliche Beschreibung der Form oder Farbe ist nicht erforderlich.';
 const fixed=fixedRubric(question,'open');assert.equal(fixed.length,1);assert.equal(fixed[0].weight,100);
 const r={criteria:[{...fixed[0],credit:1,evidence:'Schutzbrille tragen',reason:'Augenschutz erkannt.'}],criticalError:null,confidence:.99};
 assert.equal(evaluateRubric(JSON.stringify(r),'Schutzbrille tragen',fixed).score,100);
 r.criteria[0].credit=0;r.criteria[0].evidence='';r.criteria[0].reason='Rauchverbot wird als Erlaubnis umgekehrt.';
 assert.equal(evaluateRubric(JSON.stringify(r),'Hier ist Rauchen erlaubt.',fixed).score,0);
});
