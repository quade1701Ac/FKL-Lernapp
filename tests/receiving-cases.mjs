import { active } from '../scripts/question-pool.mjs';
export const receivingQuestion=active.find(q=>q.id==='sit1-1-01');
export const receivingCases=[
 {name:'original',answer:'Ich dokumentiere den Schaden auf dem Frachtbrief mache Fotos und lasse den Fahrer unterzeichnen. Die 2 Kartons kommen erstmal ins sperrlager',min:100,max:100},
 {name:'gleichwertig',answer:'Die eingedrückten Kartons und den Schaden auf dem Lieferschein festhalten und vom Fahrer bestätigen lassen. Betroffene Packstücke separat in Quarantäne stellen, keine Freigabe bis zur Klärung.',min:100,max:100},
 {name:'nur-sperren',answer:'Die beiden Kartons kommen ins Sperrlager.',min:20,max:80},
 {name:'nur-dokumentieren',answer:'Ich dokumentiere den Schaden auf dem Frachtbrief und lasse den Fahrer unterschreiben.',min:20,max:80},
 {name:'ignorieren',answer:'Ich ignoriere die Dellen, quittiere die Lieferung ohne Beanstandung und gebe alle Kartons sofort frei.',min:0,max:20},
 {name:'widerspruch',answer:'Schaden dokumentieren, Fotos machen und Fahrer unterschreiben lassen. Trotz Schaden gebe ich die beiden Kartons ohne weitere Kontrolle sofort für den Versand frei.',min:0,max:80},
 {name:'spaetere-kontrolle-explizit',question:{type:'free',question:'Die unmittelbare Warenannahme ist abgeschlossen. Was prüfst du nun bei der Feinkontrolle des Inhalts der beschädigten Kartons?',solution:'Inhalt auf Art, Menge und Beschädigungen beziehungsweise Zustand prüfen und Abweichungen dokumentieren.',keywords:['inhalt','menge','zustand']},answer:'Den Fahrer den Frachtbrief unterschreiben lassen und die Kartons ins Sperrlager stellen.',min:0,max:20}
];
