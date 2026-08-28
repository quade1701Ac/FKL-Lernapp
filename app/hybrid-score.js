import { scoreAnswerV07 } from './v07-utils';

function wordCount(text=''){return String(text).trim().split(/\s+/).filter(Boolean).length}
function diag(local,message){
  const label=`⚙️ KI: ${String(message||'unbekannt').slice(0,180)}`;
  return {...local,ai:false,aiStatus:label,hits:[...(local.hits||[]),label]};
}

export async function scoreAnswerHybrid(answer,q,fallback){
  const local=scoreAnswerV07(answer,q,fallback);
  if(q?.type!=='free')return local;

  const words=wordCount(answer);
  // Sehr kurze Antworten bleiben absichtlich lokal. Das wird sichtbar markiert,
  // damit beim Testen klar ist, warum keine API-Anfrage stattgefunden hat.
  if(words<4)return diag(local,'lokal, Antwort unter 4 Wörtern');

  let timeout;
  try{
    const controller=new AbortController();
    timeout=setTimeout(()=>controller.abort(),10000);
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

    let data={};
    try{data=await response.json()}catch{}
    if(!response.ok){
      const detail=data?.providerMessage||data?.error||`HTTP ${response.status}`;
      return diag(local,`fehlgeschlagen: ${detail}`);
    }
    if(!Number.isFinite(Number(data?.score)))return diag(local,'fehlgeschlagen: ungültiger KI-Score');

    const model=String(data.model||'Groq');
    return {
      ...local,
      score:Math.max(0,Math.min(100,Math.round(Number(data.score)/10)*10)),
      ai:true,
      aiStatus:`⚙️ KI: aktiv · ${model}`,
      aiReason:String(data.reason||'').slice(0,240),
      confidence:Number(data.confidence)||0,
      hits:[...(local.hits||[]),`⚙️ KI: aktiv · ${model}`]
    };
  }catch(error){
    if(timeout)clearTimeout(timeout);
    const message=error?.name==='AbortError'?'Zeitüberschreitung nach 10 s':(error?.message||'Netzwerkfehler');
    return diag(local,`fehlgeschlagen: ${message}`);
  }
}
