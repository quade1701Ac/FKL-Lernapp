'use client';
import {useState} from 'react';
import ShiftSimulator from './ShiftSimulator';
import WarehouseTycoon from './WarehouseTycoon';
import DocumentWorkshop from './DocumentWorkshop';
import PurchasingDuel from './PurchasingDuel';
export default function Praxiswelt({onClose}) {
const [sub,setSub]=useState('menu');
if(sub==='shift')return <ShiftSimulator onClose={()=>setSub('menu')}/>;if(sub==='tycoon')return <WarehouseTycoon onClose={()=>setSub('menu')}/>;if(sub==='docs')return <DocumentWorkshop onClose={()=>setSub('menu')}/>;if(sub==='buy')return <PurchasingDuel onClose={()=>setSub('menu')}/>;
return <section className="activityHub"><div className="activityHead"><div><span className="kicker">PRAXISWELT</span><h1>Training & Simulationen</h1><p>Logistik anwenden statt nur Fragen beantworten.</p></div><button className="secondary" onClick={onClose}>Zurück</button></div><div className="activityGrid"><button className="activityCard" onClick={()=>setSub('shift')}><span className="activityIcon">🏭</span><div><strong>Schicht-Simulator</strong><small>Entscheidungen treffen · Folgen erleben · Schicht auswerten</small></div><b>Starten →</b></button><button className="activityCard" onClick={()=>setSub('tycoon')}><span className="activityIcon">🔥</span><div><strong>Lager unter Druck</strong><small>Vorgänge steuern · Fristen · Qualität · Sicherheit</small></div><b>Übernehmen →</b></button><button className="activityCard" onClick={()=>setSub('docs')}><span className="activityIcon">🧾</span><div><strong>Dokumenten-Werkstatt</strong><small>Situationen prüfen · Abweichungen selbst entdecken</small></div><b>Prüfen →</b></button><button className="activityCard" onClick={()=>setSub('buy')}><span className="activityIcon">🤝</span><div><strong>Einkaufs-Duell</strong><small>Angebote vergleichen · Bezugspreis · Termin · Qualität</small></div><b>Vergeben →</b></button></div></section>;

}
