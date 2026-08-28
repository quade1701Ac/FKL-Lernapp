import { scoreAnswerV07 } from './v07-utils';

function wordCount(text=''){return String(text).trim().split(/\s+/).filter(Boolean).length}
function detectRequestedCount(question=''){
  const q=String(question).toLowerCase();
  const words={eins:1,eine:1,einen:1,zwei:2,drei:3,vier:4,fünf:5,fuenf:5,sechs:6};
  const m=q.match(/\b(?:nenne|nenn|gib|beschreibe|erkläre|erklaere|erläutere|erlaeutere)?\s*(eins|eine|einen|zwei|drei|vier|fünf|fuenf|sechs|[1-6])\b/);
  if(!m)return null;
  return /^\d$/.test(m[1])?Number(m[1]):(words[m[1]]||null);
}
function diag(local,message){
  const label=`⚙️ KI: ${String(message||'unbekannt').slice(0,180)}`;
  return {...local,ai:false,aiStatus:label,hits:[...(local.hits||[]),label]};
}

export async function scoreAnswerHybrid(answer,q,fallback){
  const local=scoreAnswerV07(answer,q,fallback);
  if(q?.type!=='free')return local;

  const words=wordCount(answer);
  const explicitCount=detectRequestedCount(q?.question||'');
  // Kurze Aufzählungen sind gerade bei "Nenne drei/vier ..." völlig normal.
  // Nur extrem kurze offene Antworten ohne festen Zählauftrag bleiben lokal.
  if(words<4&&!explicitCount)return diag(local,'lokal, sehr kurze offene Antwort');

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
        requestedCount:explicitCount||q.minHits||null,
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
