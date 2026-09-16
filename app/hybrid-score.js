import { scoreAnswerV07 } from './v07-utils';
import { parseLocalizedNumber, normalizedAnswer, detectRequestedCount } from './grading-contract';

function wordCount(text=''){return String(text).trim().split(/\s+/).filter(Boolean).length}
function normalize(text=''){return String(text).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim()}
function scoreNumber(answer,q,fallback){
  const parsed=parseLocalizedNumber(answer);
  if(parsed==null)return {score:0,hits:[],numeric:true,parsed:null};
  const expected=Number(q?.answer);if(!Number.isFinite(expected))return fallback(answer,q);
  const tolerance=Math.max(0,Number(q?.tolerance??0.01));
  const delta=Math.abs(parsed-expected);
  const score=delta<=tolerance?100:delta<=tolerance*3?60:0;
  return {score,hits:[],numeric:true,parsed};
}
const NON_ANSWER=/^(keine ahnung|keine idee|weiss ich nicht|weiß ich nicht|kp|ka|nichts|egal|keine antwort|keinen plan|keine plan|keine ahnung leider)$/;
const HOSTILE_NONSENSE=/^(hallo|test|bla|blabla|lol|haha|keine lust|pizza|banane|kartoffel|weissbrot|asdf|qwertz|1234)$/;
const CONTRADICTION=/\b(ignorieren|egal|einfach weiter|trotzdem einlagern|trotzdem verladen|ohne pruefung|ohne kontrolle|muss nicht pruefen|braucht man nicht)\b/;
function hardZero(answer,local){
  const text=normalize(answer);if(!text)return true;
  if(NON_ANSWER.test(text)||HOSTILE_NONSENSE.test(text))return true;
  return false;
}
function shouldUseAi(local,answer,question){
  const score=Number(local?.score)||0;
  const procedure=/\b(wie|vorgehen|schritte|massnahmen|ablauf)\b/.test(normalize(question));
  // Keyword coverage cannot establish whether a process answer is complete,
  // correctly sequenced or contradictory. Partial local scores also need review.
  if(score===100&&!procedure&&!/\b(nicht|kein|keine|ohne|ignorieren)\b/i.test(answer))return false;
  return true;
}
function diag(local,message){
  const label=`⚙️ KI: ${String(message||'unbekannt').slice(0,180)}`;
  return {...local,ai:false,aiStatus:label,hits:[...(local.hits||[])]};
}

export async function scoreAnswerHybrid(answer,q,fallback){
  if(q?.type==='number')return scoreNumber(answer,q,fallback);
  const local=scoreAnswerV07(answer,q,fallback);
  if(q?.type!=='free')return local;

  if(normalizedAnswer(answer)&&normalizedAnswer(answer)===normalizedAnswer(q.solution))return {...local,score:100,ai:false,aiStatus:'⚙️ KI: nicht nötig · Referenzantwort'};
  const explicitCount=detectRequestedCount(q?.question||'');
  if(hardZero(answer,local))return {...local,score:0,ai:false,aiStatus:'⚙️ KI: nicht nötig · klare Nullantwort'};
  if(!shouldUseAi(local,answer,q.question))return diag(local,'lokal eindeutig richtig');

  let timeout;
  try{
    const controller=new AbortController();
    timeout=setTimeout(()=>controller.abort(),16000);
    const response=await fetch('/api/grade',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        question:q.question,
        solution:q.solution,
        keywords:q.keywords||[],
        // Nur eine von der Frage ausdrücklich verlangte Anzahl an die KI geben.
        // minHits ist eine interne Hilfe für den lokalen Keyword-Scorer und darf
        // aus einer offenen „Wie könntest du ...?“-Frage keinen Zählauftrag machen.
        requestedCount:explicitCount,
        answer,
        localScore:local.score
      }),
      signal:controller.signal
    });
    let data={};
    try{data=await response.json()}catch{}
    clearTimeout(timeout);
    if(!response.ok){
      const detail=data?.providerMessage||data?.error||`HTTP ${response.status}`;
      return diag(local,`fehlgeschlagen: ${detail}`);
    }
    if(typeof data?.score!=='number'||!Number.isFinite(data.score)||data.score<0||data.score>100)return diag(local,'fehlgeschlagen: ungültiger KI-Score');

    const model=String(data.model||'Groq');
    const aiScore=Math.max(0,Math.min(100,Math.round(Number(data.score)/10)*10));
    const finalScore=aiScore;
    return {
      ...local,
      score:Math.max(0,Math.min(100,finalScore)),
      ai:true,
      aiStatus:`⚙️ KI: aktiv · ${model}`,
      aiReason:String(data.reason||'').slice(0,240),
      confidence:Number(data.confidence)||0,
      hits:[...(local.hits||[])]
    };
  }catch(error){
    if(timeout)clearTimeout(timeout);
    const message=error?.name==='AbortError'?'Zeitüberschreitung nach 16 s':(error?.message||'Netzwerkfehler');
    return diag(local,`fehlgeschlagen: ${message}`);
  }
}
