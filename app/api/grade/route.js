import { NextResponse } from 'next/server';

const MODEL='openai/gpt-oss-120b';

function safeMessage(value=''){
  return String(value).replace(/gsk_[A-Za-z0-9_-]+/g,'[KEY]').replace(/Bearer\s+\S+/gi,'Bearer [KEY]').slice(0,220);
}

function detectRequestedCount(question=''){
  const q=String(question).toLowerCase();
  const words={eins:1,eine:1,einen:1,zwei:2,drei:3,vier:4,fünf:5,fuenf:5,sechs:6};
  const m=q.match(/\b(?:nenne|nenn|gib|beschreibe|erkläre|erklaere|erläutere|erlaeutere)?\s*(eins|eine|einen|zwei|drei|vier|fünf|fuenf|sechs|[1-6])\b/);
  if(!m)return null;
  return /^\d$/.test(m[1])?Number(m[1]):(words[m[1]]||null);
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

    const prompt=`Du bist ein strenger, konsistenter IHK-naher Prüfer für die Ausbildung Fachkraft für Lagerlogistik. Bewerte nur die fachliche Qualität der konkreten Antwort.\n\nFRAGE:\n${question}\n\nMUSTERLÖSUNG:\n${solution||''}\n\nERWARTETE BEGRIFFE/ASPEKTE:\n${keywords.join(', ')}\n\nLOKALER SCORE (nur Hinweis, nicht übernehmen): ${localScore ?? 'unbekannt'}\nBEWERTUNGSMODUS: ${gradingMode}\nVERLANGTE ANZAHL, falls ausdrücklich genannt: ${explicitCount ?? 'keine feste Anzahl'}\n\nANTWORT DES LERNENDEN:\n${answer}\n\nBewertungsregeln:\n- Beurteile Bedeutung und Fachlichkeit, nicht exakte Wortwahl oder Rechtschreibung.\n- Die Musterlösung ist eine Referenz, KEINE Checkliste mit Pflichtformulierungen.\n- Bei offenen Warum-/Wie-/Erkläre-/Begründe-Fragen darf eine alternative fachlich vollständige Erklärung 100 Punkte erhalten, auch wenn einzelne Wörter oder Beispiele der Musterlösung fehlen.\n- Ziehe bei offenen Fragen NICHT allein deshalb Punkte ab, weil zusätzliche Beispiele aus der Musterlösung fehlen, sofern die gestellte Frage fachlich vollständig beantwortet ist.\n- Bewerte den tatsächlich gestellten Arbeitsauftrag, nicht die maximale Vollständigkeit der Musterlösung.\n- Synonyme, andere plausible Praxisbeispiele und richtige Ursache-Wirkungs-Ketten sind gleichwertig.\n- Wenn die Frage ausdrücklich eine Anzahl verlangt, z. B. „Nenne vier …“, zählt die Zahl fachlich unterschiedlicher richtiger Punkte proportional. Zwei richtige von vier entsprechen ungefähr 50 Punkten, drei von vier ungefähr 70 bis 80 Punkten.\n- Bei einer Zählfrage dürfen inhaltlich doppelte Aussagen nicht mehrfach gezählt werden.\n- Fachlich falsche, ausweichende oder nur scheinbar passende Antworten erhalten wenig oder 0 Punkte.\n- Teilweise richtige Antworten erhalten echte Teilpunkte.\n- Eine knappe Antwort kann volle Punkte erhalten, wenn die Frage nur einen Vorteil, eine Ursache oder einen einfachen Zusammenhang verlangt und dieser korrekt genannt ist.\n- Verwende nur Scores in Zehnerschritten von 0 bis 100.\n- reason maximal zwei kurze deutsche Sätze und begründe die Bewertung anhand des tatsächlichen Arbeitsauftrags.\n- confidence liegt zwischen 0 und 1.`;

    const response=await fetch('https://api.groq.com/openai/v1/chat/completions',{
      method:'POST',
      headers:{'Authorization':`Bearer ${key}`,'Content-Type':'application/json'},
      body:JSON.stringify({
        model:MODEL,
        temperature:0.1,
        max_completion_tokens:220,
        reasoning_effort:'low',
        reasoning_format:'hidden',
        response_format:{
          type:'json_schema',
          json_schema:{
            name:'grading_result',
            strict:true,
            schema:{
              type:'object',
              properties:{
                score:{type:'integer',minimum:0,maximum:100,multipleOf:10},
                reason:{type:'string'},
                confidence:{type:'number',minimum:0,maximum:1}
              },
              required:['score','reason','confidence'],
              additionalProperties:false
            }
          }
        },
        messages:[{role:'user',content:prompt}]
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
      gradingMode,
      requestedCount:explicitCount,
      stage:'ok'
    });
  }catch(error){
    console.error('AI grading error',error);
    return NextResponse.json({error:safeMessage(error?.message||'AI grading failed'),stage:'server',model:MODEL},{status:500});
  }
}
