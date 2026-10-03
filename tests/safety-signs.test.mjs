import test from 'node:test';
import assert from 'node:assert/strict';
import {safetySigns,signOptions,signImage} from '../app/safety-sign-data.js';

test('safety sign catalog covers BGHM codes, including the requested exam focus',()=>{
 assert.equal(safetySigns.length,46);
 assert.equal(new Set(safetySigns.map(s=>s.code)).size,safetySigns.length);
 for(const code of ['M003','M004','M013','M017','M023','P006','D-P006'])assert.ok(safetySigns.some(s=>s.code===code),code);
 for(const kind of ['mandatory','prohibited']){
  const pool=safetySigns.filter(s=>s.kind===kind);
  for(const sign of pool){
   const choices=signOptions(sign,pool);
   assert.equal(choices.length,4);
   assert.equal(choices.filter(choice=>choice.code===sign.code).length,1);
   assert.equal(new Set(choices.map(choice=>choice.label)).size,4);
   assert.ok(signImage(sign.code).startsWith('https://commons.wikimedia.org/wiki/Special:FilePath/'));
  }
 }
});
