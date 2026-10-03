import {practicalQuestions} from './questions-practical-2026';
import {checkedPool} from './smart-selection';
const ids=n=>n.map(i=>`practice26-${String(i).padStart(2,'0')}`);
export const practicalAreas=[
 {id:'receiving',title:'Warenannahme',description:'Lieferung prüfen, Mengen erfassen und Abweichungen klären',icon:'📥',ids:ids([1,2,3,4,5,6,7,42])},
 {id:'storage',title:'Einlagern & Bestände',description:'Lagerplatz wählen, Lastgrenzen beachten und Buchungen prüfen',icon:'🏬',ids:ids([8,9,10,11,12,13,14,18,41])},
 {id:'equipment',title:'Arbeitsmittel kontrollieren',description:'Stapler, Hubwagen, Anschlag- und Verpackungsmittel',icon:'🚜',ids:ids(Array.from({length:12},(_,i)=>i+29))},
 {id:'safety',title:'Sicherheit & Gefahrstoffe',description:'Sicherheitszeichen, Brandschutz und Stoffkennzeichnung',icon:'🛡️',ids:ids([15,16,17,19,20,21,22,23,24,25,26,27,28])}
];
export function practicalTrainingPool(area='all'){const allowed=new Set(practicalAreas.filter(a=>area==='all'||a.id===area).flatMap(a=>a.ids));return checkedPool(practicalQuestions).filter(q=>allowed.has(q.id))}
