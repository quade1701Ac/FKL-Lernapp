'use client';
import {useMemo,useState} from 'react';

const EVENTS=[
 {time:'06:10',title:'Frühstart am Wareneingang',text:'Zwei LKW stehen am Tor, ein dritter kommt in 35 Minuten. Gleichzeitig braucht die Kommissionierung Nachschub.',choices:[
  {label:'Tore neu takten und einen Mitarbeiter zum Nachschub abstellen',cash:-40,delivery:5,team:1,safety:1,quality:2,next:'rush'},
  {label:'Alle Kräfte zuerst an den Wareneingang schicken',cash:0,delivery:7,team:-2,safety:0,quality:-3,next:'picking'},
  {label:'Fahrer warten lassen und normalen Ablauf beibehalten',cash:0,delivery:-7,team:-2,safety:0,quality:0,next:'delay'}]},
 {time:'07:25',title:'Beschädigte Palette',text:'Bei der Entladung fällt eine eingedrückte Palette auf. Der Fahrer drängt auf eine schnelle Unterschrift.',choices:[
  {label:'Schaden dokumentieren, Vorbehalt vermerken und Ware separat prüfen',cash:-30,delivery:-1,team:1,safety:5,quality:8,next:'clean'},
  {label:'Annehmen und später im Lager genauer ansehen',cash:0,delivery:3,team:0,safety:-3,quality:-6,next:'damage'},
  {label:'Komplette Lieferung ungeprüft zurückweisen',cash:-90,delivery:-6,team:-1,safety:2,quality:2,next:'supplier'}]},
 {time:'08:40',title:'Stapler auffällig',text:'Der meistgenutzte Stapler macht beim Heben ungewöhnliche Geräusche. Die Auftragslage ist angespannt.',choices:[
  {label:'Stapler sperren, Reservegerät einsetzen und Prüfung veranlassen',cash:-180,delivery:-2,team:3,safety:10,quality:2,next:'safe'},
  {label:'Nur leichte Paletten fahren und nach der Schicht prüfen',cash:0,delivery:3,team:-1,safety:-10,quality:0,next:'incident'},
  {label:'Bis zur Pause normal weiterfahren',cash:0,delivery:5,team:-4,safety:-14,quality:-2,next:'incident'}]},
 {time:'10:15',title:'Expressauftrag',text:'Ein wichtiger Kunde benötigt 18 Positionen bis 12 Uhr. Im normalen Auftragsbestand gibt es bereits Rückstand.',choices:[
  {label:'Expressauftrag priorisieren und übrige Aufträge neu takten',cash:-60,delivery:7,team:-1,safety:0,quality:3,next:'express'},
  {label:'Team zu maximalem Tempo antreiben',cash:40,delivery:9,team:-8,safety:-5,quality:-7,next:'errors'},
  {label:'Expressauftrag ablehnen',cash:-120,delivery:-6,team:1,safety:0,quality:1,next:'customer'}]},
 {time:'11:30',title:'Bestandsabweichung',text:'Bei einem A-Artikel fehlen laut Scanner 24 Stück. Zwei offene Aufträge benötigen genau diesen Artikel.',choices:[
  {label:'Buchungen und Lagerplätze sofort gezielt prüfen',cash:-50,delivery:-2,team:0,safety:0,quality:9,next:'stock'},
  {label:'Bestand korrigieren und Aufträge weiterlaufen lassen',cash:0,delivery:3,team:0,safety:0,quality:-9,next:'stockbad'},
  {label:'Große Inventur im gesamten Bereich starten',cash:-180,delivery:-8,team:-5,safety:0,quality:5,next:'inventory'}]},
 {time:'13:05',title:'Beinaheunfall',text:'An einer Kreuzung wäre fast ein Fußgänger mit einem Flurförderzeug zusammengestoßen. Verletzt wurde niemand.',choices:[
  {label:'Bereich sichern, Ursache prüfen und Verkehrsführung verbessern',cash:-140,delivery:-2,team:4,safety:12,quality:2,next:'safe'},
  {label:'Kurze Ansage an das Team und weiterarbeiten',cash:0,delivery:1,team:-1,safety:-5,quality:0,next:'incident'},
  {label:'Nichts unternehmen, es ist schließlich nichts passiert',cash:0,delivery:3,team:-7,safety:-15,quality:-2,next:'incident'}]},
 {time:'14:10',title:'Schichtendspurt',text:'Noch 70 Minuten. Im Warenausgang warten Sendungen, gleichzeitig muss der Arbeitsplatz sauber übergeben werden.',choices:[
  {label:'Aufträge nach Abfahrt priorisieren und Übergabe fest einplanen',cash:-20,delivery:6,team:3,safety:2,quality:5,next:'finish'},
  {label:'Alles auf Versand setzen, Übergabe macht die Spätschicht',cash:20,delivery:8,team:-5,safety:-3,quality:-4,next:'mess'},
  {label:'Pünktlich Routineabschluss machen, Rest bleibt liegen',cash:0,delivery:-8,team:2,safety:2,quality:1,next:'delay'}]}
];
const CONSEQUENCES={
 damage:{title:'Folge: verdeckter Schaden',text:'Bei der Einlagerung werden weitere beschädigte Kartons entdeckt. Die fehlende saubere Dokumentation kostet Zeit und Geld.',cash:-180,quality:-5,delivery:-2},
 incident:{title:'Folge: Sicherheitsproblem',text:'Die riskante Entscheidung spricht sich herum. Der Bereich muss später doch kurzfristig gesichert werden.',cash:-100,team:-4,safety:-5,delivery:-2},
 errors:{title:'Folge: Tempo erzeugt Fehler',text:'Zwei Positionen des Expressauftrags wurden falsch gepickt und müssen nachbearbeitet werden.',cash:-90,quality:-6,delivery:-3},
 stockbad:{title:'Folge: Buchungsfehler bleibt',text:'Die schnelle Bestandskorrektur war falsch. Ein Folgeauftrag läuft jetzt in eine Fehlmenge.',cash:-60,quality:-6,delivery:-5},
 mess:{title:'Folge: schlechte Übergabe',text:'Die Spätschicht verliert Zeit, weil Arbeitsplätze und offene Vorgänge nicht sauber übergeben wurden.',team:-4,quality:-3,delivery:-2},
 delay:{title:'Folge: Rückstau',text:'Der aufgeschobene Rückstand wächst. Spätere Aufträge geraten ebenfalls unter Zeitdruck.',delivery:-5,team:-2},
 supplier:{title:'Folge: Lieferant reklamiert',text:'Die vollständige Zurückweisung war unnötig. Einkauf und Wareneingang müssen den Vorgang nacharbeiten.',cash:-70,delivery:-3},
 inventory:{title:'Folge: unnötige Vollbremsung',text:'Die großflächige Zählung findet keine weiteren Abweichungen, hat aber viel Kapazität gebunden.',delivery:-4,team:-2},
 customer:{title:'Folge: Kunde unzufrieden',text:'Der Kunde akzeptiert die Absage, stuft eure Lieferfähigkeit aber schlechter ein.',delivery:-4,quality:-2}
};
const clamp=n=>Math.max(0,Math.min(100,n));
const rank=s=>s>=90?'Logistikprofi 🏆':s>=80?'Lagerleiter ⭐':s>=68?'Schichtführer 👍':s>=55?'Fachkraft 📦':'Azubi im Krisenmodus 🚨';
export default function WarehouseTycoon({onClose}){
 const [step,setStep]=useState(0),[cash,setCash]=useState(4200),[delivery,setDelivery]=useState(76),[team,setTeam]=useState(72),[safety,setSafety]=useState(82),[quality,setQuality]=useState(75),[history,setHistory]=useState([]),[pending,setPending]=useState(null),[notice,setNotice]=useState(null),[done,setDone]=useState(false),[run,setRun]=useState(1);
 const event=EVENTS[step];
 const company=useMemo(()=>Math.round(delivery*.3+quality*.25+safety*.25+team*.2),[delivery,quality,safety,team]);
 function apply(x={}){setCash(v=>v+(x.cash||0));setDelivery(v=>clamp(v+(x.delivery||0)));setTeam(v=>clamp(v+(x.team||0)));setSafety(v=>clamp(v+(x.safety||0)));setQuality(v=>clamp(v+(x.quality||0)))}
 function choose(c){apply(c);setHistory(h=>[...h,{time:event.time,title:event.title,choice:c.label}]);const consequence=CONSEQUENCES[pending];if(consequence){apply(consequence);setNotice(consequence)}else setNotice(null);setPending(CONSEQUENCES[c.next]?c.next:null);if(step===EVENTS.length-1){const last=CONSEQUENCES[c.next];if(last){apply(last);setNotice(last)}setDone(true)}else setStep(s=>s+1)}
 function restart(){setStep(0);setCash(4200);setDelivery(76);setTeam(72);setSafety(82);setQuality(75);setHistory([]);setPending(null);setNotice(null);setDone(false);setRun(r=>r+1)}
 const finalScore=Math.round(company*.9+Math.min(100,Math.max(0,cash)/42)*.1);
 return <section className="tycoon"><header className="tycoonHead"><div><span>LAGERLEITER-SIMULATION</span><h1>🏢 Frühschicht</h1><p>06:00–15:30 · Entscheidungen wirken auf den weiteren Schichtverlauf.</p></div><button onClick={onClose}>← Aktivitäten</button></header>
 <div className="tycoonStats five"><div><small>💰 BUDGET</small><strong>{cash.toLocaleString('de-DE')} €</strong></div><div><small>📦 LIEFERUNG</small><strong>{delivery}%</strong></div><div><small>👷 TEAM</small><strong>{team}%</strong></div><div><small>⚠️ SICHERHEIT</small><strong>{safety}%</strong></div><div><small>⭐ QUALITÄT</small><strong>{quality}%</strong></div></div>
 {!done?<><div className="shiftStrip"><span>06:00</span><div><i style={{width:`${((step+1)/EVENTS.length)*100}%`}}/></div><span>15:30</span></div>{notice&&<aside className="tycoonConsequence"><b>↪ {notice.title}</b><p>{notice.text}</p></aside>}<article className="tycoonEvent"><span>{event.time} UHR · EREIGNIS {step+1}/{EVENTS.length}</span><h2>{event.title}</h2><p>{event.text}</p><div>{event.choices.map(c=><button key={c.label} onClick={()=>choose(c)}><b>{c.label}</b><small>{c.cash===0?'Keine direkten Kosten':`${c.cash>0?'+':''}${c.cash.toLocaleString('de-DE')} €`} · Auswirkungen teils verzögert</small></button>)}</div></article></>:
 <article className="tycoonEnd"><span>SCHICHTBERICHT</span><h2>{finalScore}% · {rank(finalScore)}</h2><p>{finalScore>=82?'Starke Schicht. Du hast Zielkonflikte aus Leistung, Qualität und Sicherheit gut ausbalanciert.':finalScore>=65?'Das Lager bleibt arbeitsfähig, aber einige Entscheidungen erzeugen vermeidbare Folgekosten oder Risiken.':'Die Schicht endet mit deutlichen operativen Problemen. Schau im Verlauf, welche Entscheidungen später zurückgeschlagen haben.'}</p><div className="tycoonKpis"><div><small>Lieferfähigkeit</small><b>{delivery}%</b></div><div><small>Qualität</small><b>{quality}%</b></div><div><small>Sicherheit</small><b>{safety}%</b></div><div><small>Team</small><b>{team}%</b></div><div><small>Restbudget</small><b>{cash.toLocaleString('de-DE')} €</b></div></div><div className="tycoonHistory">{history.map((h,i)=><div key={i}><span>{h.time}</span><p><b>{h.title}</b><small>{h.choice}</small></p></div>)}</div><button className="tycoonAgain" onClick={restart}>↻ Neue Schicht</button></article>}
 </section>
}
