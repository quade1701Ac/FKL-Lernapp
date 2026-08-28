import { NextResponse } from 'next/server';

// Dieses Modell ist im aktuellen Groq-Free-Plan mit eigenen Limits gelistet.
const MODEL='openai/gpt-oss-120b';

function safeMessage(value=''){
  return String(value).replace(/gsk_[A-Za-z0-9_-]+/g,'[KEY]').replace(/Bearer\s+\S+/gi,'Bearer [KEY]').slice(0,220);
}

export async function POST(request){
  const key=process.env.GROQ_API_KEY;
  if(!key)return NextResponse.json({error:'GROQ_API_KEY fehlt auf dem Server',stage:'config'},{status:503});

  try{
    const body=await request.json();
    const {question,solution,keywords=[],answer,localScore,requestedCount}=body||{};
    if(!question||!answer)return NextResponse.json({error:'Frage oder Antwort fehlt',stage:'input'},{status:400});

    const prompt=`Bewerte die Antwort eines Auszubildenden Fachkraft für Lagerlogistik fachlich und fair.\n\nFRAGE:\n${question}\n\nMUSTERLÖSUNG:\n${solution||''}\n\nERWARTETE BEGRIFFE/ASPEKTE:\n${keywords.join(', ')}\n\nLOKALER SCORE (nur Hinweis, nicht übernehmen): ${localScore ?? 'unbekannt'}\nVERLANGTE ANZAHL, falls relevant: ${requestedCount ?? 'nicht angegeben'}\n\nANTWORT DES LERNENDEN:\n${answer}\n\nRegeln:\n- Beurteile Bedeutung und Fachlichkeit, nicht exakte Wortwahl oder Rechtschreibung.\n- Eine sinngemäß richtige Ursache-Wirkungs-Erklärung darf volle Punkte erhalten, auch ohne Wörter aus der Musterlösung.\n- Fachlich falsche, ausweichende oder nur scheinbar passende Antworten erhalten wenig oder 0 Punkte.\n- Wenn mehrere Punkte verlangt werden, bewerte proportional zur Zahl fachlich unterschiedlicher richtiger Punkte.\n- Teilweise richtige Antworten erhalten echte Teilpunkte.\n- Verwende nur Scores in Zehnerschritten von 0 bis 100.\n- Antworte ausschließlich als JSON mit score, reason und confidence. confidence ist 0 bis 1. reason maximal zwei kurze deutsche Sätze.`;

    const response=await fetch('https://api.groq.com/openai/v1/chat/completions',{
      method:'POST',
      headers:{'Authorization':`Bearer ${key}`,'Content-Type':'application/json'},
      body:JSON.stringify({
        model:MODEL,
        temperature:0,
        max_completion_tokens:220,
        response_format:{type:'json_object'},
        messages:[
          {role:'system',content:'Du bist ein strenger, konsistenter IHK-naher Prüfer für die Ausbildung Fachkraft für Lagerlogistik. Bewerte nur die fachliche Qualität der konkreten Antwort.'},
          {role:'user',content:prompt}
        ]
      })
    });

    if(!response.ok){
      let provider='';
      try{const problem=await response.json();provider=problem?.error?.message||problem?.message||''}catch{provider=await response.text().catch(()=> '')}
      console.error('Groq grading failed',response.status,safeMessage(provider));
      return NextResponse.json({error:`Groq HTTP ${response.status}`,stage:'provider',providerStatus:response.status,providerMessage:safeMessage(provider),model:MODEL},{status:502});
    }

    const data=await response.json();
    const raw=data?.choices?.[0]?.message?.content||'{}';
    let parsed;
    try{parsed=JSON.parse(raw)}catch{throw new Error(`Ungültiges JSON vom Modell: ${safeMessage(raw)}`)}
    const score=Number(parsed.score);
    if(!Number.isFinite(score))throw new Error('Modell lieferte keinen gültigen Score');

    return NextResponse.json({
      score:Math.max(0,Math.min(100,Math.round(score/10)*10)),
      reason:String(parsed.reason||'').slice(0,240),
      confidence:Math.max(0,Math.min(1,Number(parsed.confidence)||0)),
      model:MODEL,
      stage:'ok'
    });
  }catch(error){
    console.error('AI grading error',error);
    return NextResponse.json({error:safeMessage(error?.message||'AI grading failed'),stage:'server',model:MODEL},{status:500});
  }
}
