import { scoreAnswerV07 } from './v07-utils';

function wordCount(text=''){return String(text).trim().split(/\s+/).filter(Boolean).length}
function normalize(text=''){return String(text).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim()}
function parseLocalizedNumber(value=''){
  let s=String(value).trim().replace(/\s/g,'').replace(/[^0-9,\.\-]/g,'');
  if(!s)return null;
  const comma=s.lastIndexOf(','),dot=s.lastIndexOf('.');
  if(comma>=0&&dot>=0){
    // Das zuletzt vorkommende Trennzeichen ist das Dezimalzeichen.
    if(comma>dot)s=s.replace(/\./g,'').replace(',','.');
    else s=s.replace(/,/g,'');
  }else if(comma>=0){
    s=s.replace(/\./g,'').replace(',','.');
  }else if(dot>=0){
    const parts=s.split('.');
    // Deutsche Tausenderpunkte wie 7.200 oder 12.000 akzeptieren.
    if(parts.length>1&&parts.slice(1).every(p=>p.length===3))s=parts.join('');
  }
  const n=Number(s);return Number.isFinite(n)?n:null;
}
function scoreNumber(answer,q,fallback){
  const parsed=parseLocalizedNumber(answer);
  if(parsed==null)return {score:0,hits:[],numeric:true,parsed:null};
  const expected=Number(q?.answer);if(!Number.isFinite(expected))return fallback(answer,q);
  const tolerance=Math.max(0,Number(q?.tolerance??0.01));
  const delta=Math.abs(parsed-expected);
  const score=delta<=tolerance?100:delta<=tolerance*3?60:0;
  return {score,hits:[],numeric:true,parsed};
}
function detectRequestedCount(question=''){
  const q=String(question).toLowerCase();
  const words={eins:1,eine:1,einen:1,zwei:2,drei:3,vier:4,fünf:5,fuenf:5,sechs:6};
  const m=q.match(/\b(?:nenne|nenn|gib|beschreibe|erkläre|erklaere|erläutere|erlaeutere)?\s*(eins|eine|einen|zwei|drei|vier|fünf|fuenf|sechs|[1-6])\b/);
  if(!m)return null;
  return /^\d$/.test(m[1])?Number(m[1]):(words[m[1]]||null);
}
const NON_ANSWER=/^(keine ahnung|keine idee|weiss ich nicht|weiß ich nicht|kp|ka|nichts|egal|keine antwort|keinen plan|keine plan|keine ahnung leider)$/;
const HOSTILE_NONSENSE=/^(hallo|test|bla|blabla|lol|haha|keine lust|pizza|banane|kartoffel|weissbrot|asdf|qwertz|1234)$/;
const CONTRADICTION=/\b(ignorieren|egal|einfach weiter|trotzdem einlagern|trotzdem verladen|ohne pruefung|ohne kontrolle|muss nicht pruefen|braucht man nicht)\b/;
function hardZero(answer,local){
  const text=normalize(answer);if(!text)return true;
  if(NON_ANSWER.test(text)||HOSTILE_NONSENSE.test(text))return true;
  if(CONTRADICTION.test(text)&&(local?.score||0)<=20)return true;
  if(wordCount(answer)<=2&&(local?.score||0)===0)return true;
  return false;
}
function shouldUseAi(local,answer,explicitCount){
  const score=Number(local?.score)||0,words=wordCount(answer);
  if(score<=20||score>=80)return false;
  if(words<4&&!explicitCount)return false;
  return true;
}
function diag(local,message){
  const label=`⚙️ KI: ${String(message||'unbekannt').slice(0,180)}`;
  return {...local,ai:false,aiStatus:label,hits:[...(local.hits||[]),label]};
}

export async function scoreAnswerHybrid(answer,q,fallback){
  if(q?.type==='number')return scoreNumber(answer,q,fallback);
  const local=scoreAnswerV07(answer,q,fallback);
  if(q?.type!=='free')return local;

  const explicitCount=detectRequestedCount(q?.question||'');
  if(hardZero(answer,local))return {...local,score:0,ai:false,aiStatus:'⚙️ KI: nicht nötig · klare Nullantwort'};
  if(!shouldUseAi(local,answer,explicitCount))return diag(local,local.score>=80?'lokal eindeutig richtig':local.score<=20?'lokal eindeutig falsch':'lokal, sehr kurze offene Antwort');

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
    const aiScore=Math.max(0,Math.min(100,Math.round(Number(data.score)/10)*10));
    const gap=Math.abs(aiScore-local.score);
    const finalScore=gap>=50?Math.round(((aiScore+local.score)/2)/10)*10:aiScore;
    return {
      ...local,
      score:Math.max(0,Math.min(100,finalScore)),
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
