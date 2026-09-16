// Explicit opt-in: seven real provider calls; uses synthetic answers, no login data.
// node --import ./tests/register.mjs scripts/check-receiving-live.mjs <preview-url>
import {scoreAnswerHybrid} from '../app/hybrid-score.js';
import {receivingQuestion,receivingCases} from '../tests/receiving-cases.mjs';
const base=process.argv[2];
if(!base||!/^https:\/\/[a-z0-9-]+\.netlify\.app$/.test(base))throw new Error('Explicit Netlify preview URL required');
const originalFetch=globalThis.fetch;
globalThis.fetch=(url,options)=>originalFetch(url==='/api/grade'?`${base}/api/grade`:url,options);
let failed=0;
for(const sample of receivingCases){
 const result=await scoreAnswerHybrid(sample.answer,sample.question||receivingQuestion);
 const passed=result.ai===true&&result.score>=sample.min&&result.score<=sample.max;
 if(!passed)failed++;
 console.log(JSON.stringify({case:sample.name,passed,score:result.score,ai:result.ai,status:result.aiStatus,reason:result.aiReason}));
}
process.exitCode=failed?1:0;
