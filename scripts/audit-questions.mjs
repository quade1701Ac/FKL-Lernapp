import { raw, active } from './question-pool.mjs';
import { scoreAnswerV07 } from '../app/v07-utils.js';
import { scoreAnswer } from '../app/data.js';
const summary = {raw:raw.length,active:active.length,fields:{},types:{},modelAnswersBelow80:[]};
for (const q of active) {
  summary.fields[q.field]=(summary.fields[q.field]||0)+1;
  summary.types[q.type]=(summary.types[q.type]||0)+1;
  if(q.type==='free') {
    const score=scoreAnswerV07(q.solution,q,scoreAnswer).score;
    if(score<80) summary.modelAnswersBelow80.push({id:q.id,score});
  }
}
console.log(JSON.stringify(summary,null,2));
if(process.argv.includes('--questions')) console.log(JSON.stringify(active,null,2));
