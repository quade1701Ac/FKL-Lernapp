// Synthetic release checks against the public grading endpoint; no credentials.
const base='https://fkl-06-25.netlify.app';
const question='Eine Lieferung trifft mit korrekter Packstückzahl ein, aber der Empfänger auf den Papieren ist eine andere Niederlassung. Wie gehst du vor?';
const solution='Empfängerangaben und Lieferunterlagen prüfen und die Zuordnung klären, bevor die Ware regulär angenommen oder eingelagert wird. Eine Fehlzustellung darf nicht einfach in den normalen Bestand gelangen.';
const cases=[
 {name:'Richtiger Kern, fehlende Unterscheidung',question,solution,answer:'Ich nehme die Ware nicht an und informiere den Lieferanten das er am falschen ort ist.',min:70,max:90},
 {name:'Vollständige Klärung',question,solution,answer:'Ich stoppe die reguläre Annahme, gleiche die Lieferunterlagen ab und kläre mit dem Lieferanten, ob die Sendung fehlgeleitet wurde oder nur die Papiere falsch sind. Bis dahin kommt sie nicht in den normalen Bestand.',min:90,max:100},
 {name:'Falsche Freigabe',question,solution,answer:'Die Menge stimmt, deshalb lagere ich die Ware trotzdem direkt in den normalen Bestand ein und ignoriere den falschen Empfänger.',min:0,max:20},
 {name:'Sinngemäße Kurzantwort',question:'Warum ist ein Sicherheitsbestand sinnvoll?',solution:'Er puffert unerwartete Lieferverzögerungen oder Bedarfsschwankungen ab.',answer:'Damit bei einer verspäteten Lieferung die Ware nicht gleich ausgeht.',min:90,max:100},
 {name:'Zwei von drei Aufzählungspunkten',question:'Nenne drei verschiedene persönliche Schutzausrüstungen.',solution:'Schutzhelm, Sicherheitsschuhe und Schutzhandschuhe.',answer:'Schutzhelm und Sicherheitsschuhe',min:67,max:67}
];
async function grade(sample){
 const response=await fetch(`${base}/api/grade`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(sample),signal:AbortSignal.timeout(22000)});
 if(!response.ok)throw new Error(`Grading HTTP ${response.status}: ${JSON.stringify(await response.json())}`);
 return response.json();
}
let first;
for(let attempt=0;attempt<12;attempt++){
 try{const result=await grade(cases[0]);if(result.gradingVersion==='weighted-v3'){first=result;break;}}catch(error){console.log(`Deployment noch nicht erreichbar: ${error.message}`);}
 await new Promise(resolve=>setTimeout(resolve,15000));
}
if(!first)throw new Error('Aktuelle Bewertungsversion wurde nicht rechtzeitig veröffentlicht.');
let failures=0;
for(let i=0;i<cases.length;i++){
 const sample=cases[i],result=i===0?first:await grade(sample);
 const passed=result.score>=sample.min&&result.score<=sample.max;
 console.log(JSON.stringify({case:sample.name,passed,score:result.score,reason:result.reason,model:result.model}));
 if(!passed)failures++;
}
if(failures)throw new Error(`${failures} echte KI-Bewertungen außerhalb des erwarteten Bereichs.`);
