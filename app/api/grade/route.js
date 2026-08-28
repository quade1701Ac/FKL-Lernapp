import { NextResponse } from 'next/server';

const MODELS=['openai/gpt-oss-20b','openai/gpt-oss-120b'];

function safeMessage(value=''){
  return String(value).replace(/gsk_[A-Za-z0-9_-]+/g,'[KEY]').replace(/Bearer\s+\S+/gi,'Bearer [KEY]').slice(0,260);
}

function detectRequestedCount(question=''){
  const q=String(question).toLowerCase();
  const words={eins:1,eine:1,einen:1,zwei:2,drei:3,vier:4,fünf:5,fuenf:5,sechs:6};
  const m=q.match(/\b(?:nenne|nenn|gib|beschreibe|erkläre|erklaere|erläutere|erlaeutere)?\s*(eins|eine|einen|zwei|drei|vier|fünf|fuenf|sechs|[1-6])\b/);
  if(!m)return null;
  return /^\d$/.test(m[1])?Number(m[1]):(words[m[1]]||null);
}

function parseGrade(raw=''){
  const text=String(raw).trim();
  try{return JSON.parse(text)}catch{}
  const block=text.match(/\{[\s\S]*?\}/);
  if(block){try{return JSON.parse(block[0])}catch{}}
  const score=text.match(/(?:score|punkte?)\s*[:=]\s*(\d{1,3})/i)?.[1] ?? text.match(/^\s*(\d{1,3})\b/)?.[1];
  if(score==null)return null;
  const reason=text.match(/(?:reason|begründung|begruendung)\s*[:=]\s*["']?([^\n}"']+)/i)?.[1]||'KI-Bewertung erfolgreich.';
  const confidence=text.match(/confidence\s*[:=]\s*(0(?:\.\d+)?|1(?:\.0+)?)/i)?.[1];
  return {score:Number(score),reason,confidence:confidence==null?.75:Number(confidence)};
}

async function gradeWithModel(key,model,prompt){
  const response=await fetch('https://api.groq.com/openai/v1/chat/completions',{
    method:'POST',
    headers:{'Authorization':`Bearer ${key}`,'Content-Type':'application/json'},
    body:JSON.stringify({
      model,
      temperature:0,
      max_completion_tokens:300,
      messages:[
        {role:'system',content:'Du bewertest Antworten. Antworte ausschließlich mit einem kompakten JSON-Objekt ohne Markdown: {"score":0,"reason":"kurze Begründung","confidence":0.9}. score 0-100, confidence 0-1.'},
        {role:'user',content:prompt}
      ]
    })
  });

  if(!response.ok){
    let problem={};
    try{problem=await response.json()}catch{problem={message:await response.text().catch(()=> '')}}
    const message=problem?.error?.message||problem?.message||`HTTP ${response.status}`;
    return {ok:false,status:response.status,message:safeMessage(message),model};
  }

  const data=await response.json();
  const raw=data?.choices?.[0]?.message?.content||'';
  const parsed=parseGrade(raw);
  const score=Number(parsed?.score);
  if(!parsed||!Number.isFinite(score))return {ok:false,status:500,message:'KI-Antwort enthielt keinen lesbaren Score',detail:safeMessage(raw),model};
  return {ok:true,parsed,model};
}

export async function POST(request){
  const key=process.env.GROQ_API_KEY;
  if(!key)return NextResponse.json({error:'GROQ_API_KEY fehlt auf dem Server',stage:'config'},{status:503});

  try{
    const body=await request.json();
    const {question,solution,keywords=[],answer,localScore,requestedCount}=body||{};
    if(!question||!answer)return NextResponse.json({error:'Frage oder Antwort fehlt',stage:'input'},{status:400});

    const explicitCount=Number(requestedCount)||detectRequestedCount(question)||null;
    const gradingMode=explicitCount?'zählfrage':'offene_fachantwort';

    const prompt=`FRAGE:\n${question}\n\nMUSTERLÖSUNG:\n${solution||''}\n\nERWARTETE BEGRIFFE/ASPEKTE:\n${keywords.join(', ')}\n\nLOKALER SCORE (nur Hinweis, nicht übernehmen): ${localScore ?? 'unbekannt'}\nBEWERTUNGSMODUS: ${gradingMode}\nVERLANGTE ANZAHL: ${explicitCount ?? 'keine feste Anzahl'}\n\nANTWORT:\n${answer}\n\nBewerte als strenger, konsistenter IHK-naher Prüfer für Fachkraft für Lagerlogistik. Regeln:\n- Bedeutung und Fachlichkeit zählen, nicht Wortlaut, Rechtschreibung oder Stil.\n- Musterlösung ist Referenz, keine Pflicht-Checkliste.\n- Offene Warum-/Wie-/Erkläre-/Begründe-Fragen können mit alternativer vollständiger Erklärung 100 Punkte erhalten.\n- Keine Abzüge nur wegen fehlender zusätzlicher Beispiele aus der Musterlösung, wenn der Arbeitsauftrag erfüllt ist.\n- Synonyme, plausible Praxisbeispiele und korrekte Ursache-Wirkungs-Ketten gelten.\n- Bei ausdrücklich verlangter Anzahl proportional nach fachlich unterschiedlichen richtigen Punkten bewerten.\n- Doppelte Punkte nur einmal zählen.\n- Falsche oder ausweichende Antworten 0 oder wenig Punkte. Teilrichtiges erhält echte Teilpunkte.\n- Eine knappe Antwort darf volle Punkte erhalten, wenn sie den Arbeitsauftrag vollständig erfüllt.\n- Gib einen Score 0-100. reason maximal zwei kurze deutsche Sätze. confidence 0-1.`;

    const failures=[];
    for(const model of MODELS){
      const result=await gradeWithModel(key,model,prompt);
      if(result.ok){
        const parsed=result.parsed;
        return NextResponse.json({
          score:Math.max(0,Math.min(100,Math.round(Number(parsed.score)/10)*10)),
          reason:String(parsed.reason||'KI-Bewertung erfolgreich.').slice(0,240),
          confidence:Math.max(0,Math.min(1,Number(parsed.confidence)||.75)),
          model:result.model,
          gradingMode,
          requestedCount:explicitCount,
          stage:'ok'
        });
      }
      failures.push(result);
      console.error('Groq grading attempt failed',result.model,result.status,result.message,result.detail||'');
    }

    const last=failures[failures.length-1]||{};
    return NextResponse.json({error:'KI-Bewertung nach zwei Versuchen fehlgeschlagen',stage:'provider',providerStatus:last.status||502,providerMessage:last.message||'Unbekannter Groq-Fehler',attemptedModels:MODELS},{status:502});
  }catch(error){
    console.error('AI grading error',error);
    return NextResponse.json({error:safeMessage(error?.message||'AI grading failed'),stage:'server'},{status:500});
  }
}
