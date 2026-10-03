import {evaluateStockCard} from './stock-card-data';
const makeCase=(id,title,ordered,delivered,damage,wrongArticle,opening,outgoing,mass)=>({
 id,title,article:'LT-240',receivedArticle:wrongArticle?'LT-241':'LT-240',unit:'Stück',ordered,delivered,perBox:12,damage,mass,
 document:{supplier:'Nordteile GmbH',recipient:'LagerLogik · Halle 1',order:`BE-${id}`,ref:`LS-${id}`,date:'05.10.2026'},
 physical:`${delivered} Kartons mit je 12 Stück, Artikel ${wrongArticle?'LT-241':'LT-240'}. ${damage?'Ein Karton ist eingedrückt; der Inhalt ist beschädigt.':'Keine sichtbaren Beschädigungen.'} Empfänger und Bestellung sind richtig zugeordnet.`,
 findings:[...(ordered!==delivered?['quantity']:[]),...(damage?['damage']:[]),...(wrongArticle?['article']:[])],
 handling:{type:'free',difficulty:3,field:1,topic:'Mängel',question:'Welche unmittelbaren Maßnahmen veranlasst du für die festgestellte Abweichung und die betroffene Ware? Die äußere Kontrolle ist abgeschlossen; beschreibe Dokumentation, Klärung und Umgang mit der Ware bis zur Freigabe.',solution:wrongArticle?'Falschen Artikel dokumentieren, zuständige Stelle beziehungsweise Lieferant zur Klärung informieren und die falsch gelieferte Ware getrennt sperren. Keine Freigabe oder normale Einlagerung, bis die richtige Lieferung beziehungsweise Zuordnung geklärt ist.':damage?'Schaden konkret dokumentieren, möglichst fotografieren, bei Übernahme vermerken und zuständige Stelle beziehungsweise Frachtführer zur Klärung informieren. Beschädigte Ware getrennt sperren; nur geprüfte und freigegebene Ware regulär einlagern.':'Tatsächliche Menge und Fehlmenge dokumentieren, Abweichung auf dem Übernahmebeleg vermerken und die zuständige Stelle beziehungsweise Lieferant informieren. Nur die tatsächlich erhaltene und geprüfte Menge buchen; die fehlenden Kartons nicht als Bestand erfassen.',keywords:['dokumentieren','vermerken','klären','melden','sperren','menge'],minHits:1},
 resolution:wrongArticle?'Die ursprüngliche Falschlieferung bleibt gesperrt und wird zurückgegeben. Inzwischen ist eine Ersatzlieferung mit 8 Kartons des richtigen Artikels angekommen, geprüft und vollständig freigegeben.':'Die Abweichung ist dokumentiert und gemeldet. '+(damage?'Neun unbeschädigte Kartons sind geprüft und freigegeben; der beschädigte Karton bleibt im getrennten Sperrbestand.':'Alle acht tatsächlich erhaltenen Kartons sind geprüft und freigegeben; die Fehlmenge bleibt offen.'),
 card:{article:'LT-240 · Lagerrolle',place:'A-02-03',unit:'Stück',opening,movements:[
  {date:'05.10.2026',ref:`WE-${id}`,text:'Freigegebene Ware laut Klärung auf Lagerplatz A-02-03 einlagern.',incoming:wrongArticle?96:(delivered-damage)*12,outgoing:0},
  {date:'05.10.2026',ref:`KA-${id}`,text:`Anschließend werden ${outgoing} Stück für einen Kundenauftrag entnommen.`,incoming:0,outgoing}]}
});
export const practicalTaskCases=[makeCase('301','Beschädigte Lieferung',10,10,1,false,120,35,280),makeCase('302','Fehlmenge klären',9,8,0,false,40,50,245),makeCase('303','Falschen Artikel erkennen',8,8,0,true,80,20,260)];
export const findingOptions=[['article','Artikelabweichung'],['quantity','Mengenabweichung'],['damage','Beschädigung'],['recipient','Falscher Empfänger']];
export const equipmentOptions=[
 {id:'forklift',label:'Frontgabelstapler: bei 3 m Hubhöhe und tatsächlichem Lastschwerpunkt 900 kg zulässig; Prüfung ohne Mängel.'},
 {id:'pallet',label:'Handhubwagen: 2.500 kg Tragfähigkeit, Hub nur zum bodennahen Verfahren.'},
 {id:'small',label:'Kleinstapler: bei 3 m Hubhöhe und tatsächlichem Lastschwerpunkt nur 200 kg zulässig.'}
];
export const equipmentChecks=[['condition','Sicht- und Funktionskontrolle einschließlich Bremsen, Gabeln und Hydraulik'],['route','Freier, geeigneter Transportweg; Personenbereich abgesichert'],['load','Last, Schwerpunkt, Hubhöhe und Tragfähigkeit anhand der Vorgaben prüfen'],['postpone','Tägliche Kontrolle wegen Zeitdruck bis nach der Einlagerung verschieben']];
export const taskStages=['Lieferung prüfen','Abweichung klären','Arbeitsmittel wählen','Lagerplatz wählen','Fachkarte buchen'];
export function selectionGrade(selected,expected){const unique=[...new Set(selected)],right=unique.filter(x=>expected.includes(x)).length,wrong=unique.filter(x=>!expected.includes(x)).length;return Math.round(Math.max(0,(right-wrong)/expected.length)*100)}
export function evaluateTaskStep(c,step,answers){
 if(step===0)return {score:selectionGrade(answers.findings||[],c.findings),critical:false,reason:`Festgestellt: ${c.findings.map(id=>findingOptions.find(o=>o[0]===id)[1]).join(', ')}. Prüfe Lieferschein und tatsächliche Ware getrennt.`};
 if(step===2){const checks=answers.checks||[],critical=answers.device!=='forklift'||checks.includes('postpone');const raw=Number(answers.device==='forklift')*50+selectionGrade(checks,['condition','route','load'])/2;return {score:critical?Math.min(20,raw):Math.round(raw),critical,reason:`Für ${c.mass} kg bei 3 m Hubhöhe ist hier der Frontgabelstapler geeignet. Der Handhubwagen erreicht die Höhe nicht; der Kleinstapler ist überlastet. Kontrollen und sicherer Transportweg müssen vor dem Einsatz geklärt sein.`}}
 if(step===3){const correct=answers.place==='A';return {score:correct?100:0,critical:!correct,reason:`A-02-03 ist geeignet: Fachlast nach Einlagerung ${250+c.mass} kg ≤ 600 kg; Feldlast ${1000+c.mass} kg ≤ 1.500 kg. B-01-01 überschreitet mit ${400+c.mass} kg die Fachlast. Ein Fluchtweg ist kein Lagerplatz.`}}
 if(step===4){const stock=evaluateStockCard(c.card,answers.entries||[]);return {score:stock.percent,critical:false,stock,reason:'Je ein Punkt für Zugang, Abgang und Bestand. Ein korrekt fortgeführter Übertragsfehler wird nicht erneut abgezogen.'}}
 throw new Error('Dieser Schritt verwendet die freie Antwortprüfung.');
}
export function summarizeTask(results){return {percent:Math.round(results.reduce((n,r)=>n+r.score,0)/5),critical:results.some(r=>r.critical)}}
