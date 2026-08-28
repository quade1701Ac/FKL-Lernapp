import { scoreAnswerV07 } from './v07-utils';

function wordCount(text=''){return String(text).trim().split(/\s+/).filter(Boolean).length}

export async function scoreAnswerHybrid(answer,q,fallback){
  const local=scoreAnswerV07(answer,q,fallback);
  if(q?.type!=='free')return local;

  const words=wordCount(answer);
  // Sehr kurze Antworten bleiben lokal. Substantielle Freitextantworten werden semantisch gegengeprüft.
  if(words<4)return local;

  try{
    const controller=new AbortController();
    const timeout=setTimeout(()=>controller.abort(),8000);
    const response=await fetch('/api/grade',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        question:q.question,
        solution:q.solution,
        keywords:q.keywords||[],
        requestedCount:q.minHits||null,
        answer,
        localScore:local.score
      }),
      signal:controller.signal
    });
    clearTimeout(timeout);
    if(!response.ok)return local;
    const ai=await response.json();
    if(!Number.isFinite(ai?.score))return local;
    return {
      ...local,
      score:Math.max(0,Math.min(100,Math.round(ai.score/10)*10)),
      ai:true,
      aiReason:String(ai.reason||'').slice(0,240),
      confidence:Number(ai.confidence)||0
    };
  }catch{
    return local;
  }
}
