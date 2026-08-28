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

const SCHEMA={
  type:'object',
  properties:{
    score:{type:'integer',minimum:0,maximum:100},
    reason:{type:'string'},
    confidence:{type:'number',minimum:0,maximum:1}
  },
  required:['score','reason','confidence'],
  additionalProperties:false
};

async function gradeWithModel(key,model,prompt){
  const response=await fetch('https://api.groq.com/openai/v1/chat/completions',{
    method:'POST',
    headers:{'Authorization':`Bearer ${key}`,'Content-Type':'application/json'},
    body:JSON.stringify({
      model,
      temperature:0,
      max_completion_tokens:220,
      response_format:{
        type:'json_schema',
        json_schema:{name:'grading_result',strict:true,schema:SCHEMA}
      },
      messages:[{role:'user',content:prompt}]
    })
  });

  if(!response.ok){
    let problem={};
    try{problem=await response.json()}catch{problem={message:await response.text().catch(()=> '')}}
    const message=problem?.error?.message||problem?.message||`HTTP ${response.status}`;
    const failed=problem?.error?.failed_generation;
    const detail=failed?(typeof failed==='string'?failed:JSON.stringify(failed)):'';
    return {ok:false,status:response.status,message:safeMessage(message),detail:safeMessage(detail),model};
  }

  const data=await response.json();
  const raw=data?.choices?.[0]?.message?.content||'{}';
  try{
    const parsed=JSON.parse(raw);
    const score=Number(parsed.score);
    if(!Number.isFinite(score))throw new Error('kein gültiger Score');
    return {ok:true,parsed,model};
  }catch(error){
    return {ok:false,status:500,message:`Antwort konnte nicht gelesen werden: ${safeMessage(error?.message)}`,detail:safeMessage(raw),model};
  }
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

    const prompt=`Du bist ein strenger, konsistenter IHK-naher Prüfer für die Ausbildung Fachkraft für Lagerlogistik. Bewerte nur die fachliche Qualität der konkreten Antwort.\n\nFRAGE:\n${question}\n\nMUSTERLÖSUNG:\n${solution||''}\n\nERWARTETE BEGRIFFE/ASPEKTE:\n${keywords.join(', ')}\n\nLOKALER SCORE (nur Hinweis, nicht übernehmen): ${localScore ?? 'unbekannt'}\nBEWERTUNGSMODUS: ${gradingMode}\nVERLANGTE ANZAHL, falls ausdrücklich genannt: ${explicitCount ?? 'keine feste Anzahl'}\n\nANTWORT DES LERNENDEN:\n${answer}\n\nBewertungsregeln:\n- Beurteile Bedeutung und Fachlichkeit, nicht exakte Wortwahl oder Rechtschreibung.\n- Die Musterlösung ist eine Referenz, keine Checkliste mit Pflichtformulierungen.\n- Bei offenen Warum-/Wie-/Erkläre-/Begründe-Fragen darf eine alternative fachlich vollständige Erklärung 100 Punkte erhalten.\n- Ziehe bei offenen Fragen keine Punkte nur deshalb ab, weil zusätzliche Beispiele aus der Musterlösung fehlen.\n- Bewerte den tatsächlich gestellten Arbeitsauftrag.\n- Synonyme, plausible Praxisbeispiele und richtige Ursache-Wirkungs-Ketten sind gleichwertig.\n- Wenn ausdrücklich eine Anzahl verlangt wird, bewerte proportional nach fachlich unterschiedlichen richtigen Punkten.\n- Doppelte Aussagen zählen bei Zählfragen nur einmal.\n- Fachlich falsche, ausweichende oder nur scheinbar passende Antworten erhalten wenig oder 0 Punkte.\n- Teilweise richtige Antworten erhalten Teilpunkte.\n- Eine knappe Antwort kann volle Punkte erhalten, wenn der Arbeitsauftrag damit vollständig erfüllt ist.\n- score liegt zwischen 0 und 100. Ich runde serverseitig auf Zehnerschritte.\n- reason maximal zwei kurze deutsche Sätze.\n- confidence liegt zwischen 0 und 1.`;

    const failures=[];
    for(const model of MODELS){
      const result=await gradeWithModel(key,model,prompt);
      if(result.ok){
        const parsed=result.parsed;
        return NextResponse.json({
          score:Math.max(0,Math.min(100,Math.round(Number(parsed.score)/10)*10)),
          reason:String(parsed.reason||'').slice(0,240),
          confidence:Math.max(0,Math.min(1,Number(parsed.confidence)||0)),
          model:result.model,
          gradingMode,
          requestedCount:explicitCount,
          stage:'ok'
        });
      }
      failures.push(result);
      console.error('Groq grading attempt failed',result.model,result.status,result.message,result.detail);
    }

    const last=failures[failures.length-1]||{};
    return NextResponse.json({
      error:'KI-Bewertung nach zwei Versuchen fehlgeschlagen',
      stage:'provider',
      providerStatus:last.status||502,
      providerMessage:last.message||'Unbekannter Groq-Fehler',
      providerDetail:last.detail||'',
      attemptedModels:MODELS
    },{status:502});
  }catch(error){
    console.error('AI grading error',error);
    return NextResponse.json({error:safeMessage(error?.message||'AI grading failed'),stage:'server'},{status:500});
  }
}
