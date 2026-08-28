import { NextResponse } from 'next/server';

const MODEL='llama-3.3-70b-versatile';

export async function POST(request){
  const key=process.env.GROQ_API_KEY;
  if(!key)return NextResponse.json({error:'AI grading not configured'},{status:503});

  try{
    const body=await request.json();
    const {question,solution,keywords=[],answer,localScore,requestedCount}=body||{};
    if(!question||!answer)return NextResponse.json({error:'Missing input'},{status:400});

    const prompt=`Bewerte die Antwort eines Auszubildenden Fachkraft für Lagerlogistik fachlich und fair.\n\nFRAGE:\n${question}\n\nMUSTERLÖSUNG:\n${solution||''}\n\nERWARTETE BEGRIFFE/ASPEKTE:\n${keywords.join(', ')}\n\nLOKALER SCORE (nur Hinweis, nicht übernehmen): ${localScore ?? 'unbekannt'}\nVERLANGTE ANZAHL, falls relevant: ${requestedCount ?? 'nicht angegeben'}\n\nANTWORT DES LERNENDEN:\n${answer}\n\nRegeln:\n- Beurteile Bedeutung und Fachlichkeit, nicht exakte Wortwahl oder Rechtschreibung.\n- Eine sinngemäß richtige Ursache-Wirkungs-Erklärung darf volle Punkte erhalten, auch ohne Wörter aus der Musterlösung.\n- Fachlich falsche, ausweichende oder nur scheinbar passende Antworten erhalten wenig oder 0 Punkte.\n- Wenn mehrere Punkte verlangt werden, bewerte proportional zur Zahl fachlich unterschiedlicher richtiger Punkte.\n- Teilweise richtige Antworten erhalten echte Teilpunkte.\n- Verwende nur Scores in Zehnerschritten von 0 bis 100.\n- Antworte ausschließlich als JSON mit score, reason und confidence. confidence ist 0 bis 1. reason maximal zwei kurze deutsche Sätze.`;

    const response=await fetch('https://api.groq.com/openai/v1/chat/completions',{
      method:'POST',
      headers:{'Authorization':`Bearer ${key}`,'Content-Type':'application/json'},
      body:JSON.stringify({
        model:MODEL,
        temperature:0,
        max_completion_tokens:180,
        response_format:{type:'json_object'},
        messages:[
          {role:'system',content:'Du bist ein strenger, konsistenter IHK-naher Prüfer für die Ausbildung Fachkraft für Lagerlogistik. Bewerte nur die fachliche Qualität der konkreten Antwort.'},
          {role:'user',content:prompt}
        ]
      })
    });
    if(!response.ok)return NextResponse.json({error:'AI provider unavailable'},{status:502});
    const data=await response.json();
    const raw=data?.choices?.[0]?.message?.content||'{}';
    const parsed=JSON.parse(raw);
    const score=Number(parsed.score);
    if(!Number.isFinite(score))throw new Error('Invalid score');
    return NextResponse.json({
      score:Math.max(0,Math.min(100,Math.round(score/10)*10)),
      reason:String(parsed.reason||'').slice(0,240),
      confidence:Math.max(0,Math.min(1,Number(parsed.confidence)||0)),
      model:MODEL
    });
  }catch(error){
    console.error('AI grading error',error);
    return NextResponse.json({error:'AI grading failed'},{status:500});
  }
}
