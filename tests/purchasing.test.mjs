import test from 'node:test';
import assert from 'node:assert/strict';
import { ROUNDS, calc } from '../app/purchasing-data.js';
test('all purchasing cases select the cheapest qualifying offer or explicit quality priority',()=>{
 const requirements={1:{days:3},4:{quality:96,days:6},6:{quality:95,days:7},8:{days:10},9:{quality:90,days:3},10:{quality:93},11:{quality:98,days:8},13:{quality:94,days:4},15:{quality:97,days:12},16:{quality:95,days:7}};
 for(const [i,r] of ROUNDS.entries()){
   const min=requirements[i]||{},qualified=r.offers.map((o,index)=>({...o,index})).filter(o=>o.quality>=(min.quality||0)&&o.days<=(min.days||Infinity));
   qualified.sort(i===2?(a,b)=>b.quality-a.quality:(a,b)=>calc(a).total-calc(b).total);
   assert.equal(r.best,qualified[0].index,r.need);
 }
});
