export const AREAS=[
 {id:'in',icon:'🚚',name:'Wareneingang'},{id:'check',icon:'🔎',name:'Prüfung'},{id:'store',icon:'🏬',name:'Lager'},
 {id:'pick',icon:'🛒',name:'Kommissionierung'},{id:'pack',icon:'📦',name:'Verpackung'},{id:'out',icon:'🚛',name:'Warenausgang'}
];
export const INITIAL=[
 {id:1,area:'in',kind:'damage',stage:'arrival',icon:'📦',title:'Lieferung 4711',text:'Palette sichtbar eingedrückt',due:14},
 {id:2,area:'in',kind:'danger',stage:'arrival',icon:'⚠️',title:'Gefahrgut-Lieferung',text:'UN 1263 · Dokumente liegen vor',due:18},
 {id:3,area:'pick',kind:'express',stage:'picking',icon:'🔴',title:'Express 381',text:'18 Positionen · Abfahrt in Kürze',due:9},
 {id:4,area:'store',kind:'stock',stage:'difference',icon:'❓',title:'A-Artikel X14',text:'Scanner: 124 · Fach: unklar',due:16},
 {id:5,area:'pack',kind:'normal',stage:'packing',icon:'📋',title:'Auftrag 377',text:'12 Positionen vollständig',due:13}
];
export const clamp=n=>Math.max(0,Math.min(100,n));
export const cloneInitial=()=>INITIAL.map(j=>({...j}));

export function actionsFor(job){
 if(!job)return[];
 if(job.kind==='damage'){
  if(job.stage==='arrival')return[
   {label:'Schaden dokumentieren & prüfen',next:{area:'check',stage:'inspection',text:'Schaden dokumentiert · Ware wird geprüft'},msg:'Schaden dokumentiert und Ware zur Prüfung gegeben.'},
   {label:'Direkt ins Sperrlager',complete:true,msg:'Beschädigte Ware gesichert und Vorgang dokumentiert.',score:2},
   {label:'Trotz Schaden einlagern',next:{area:'store',stage:'stored-bad',text:'Beschädigte Ware ungeprüft eingelagert'},msg:'Beschädigte Ware ungeprüft eingelagert.',bad:true,quality:-18,time:4}
  ];
  if(job.stage==='inspection')return[
   {label:'Restware freigeben & einlagern',complete:true,msg:'Schaden erfasst, verwendbare Ware freigegeben und sauber eingebucht.',quality:3},
   {label:'Gesamte Lieferung sperren',complete:true,msg:'Lieferung nach Prüfung vollständig gesperrt.',quality:2}
  ];
  if(job.stage==='stored-bad')return[{label:'Fehler korrigieren & Ware sperren',complete:true,msg:'Falsche Einlagerung korrigiert. Ware nachträglich gesperrt.',quality:4,time:4}];
 }
 if(job.kind==='danger'){
  if(job.stage==='arrival')return[
   {label:'Dokumente & Kennzeichnung prüfen',next:{area:'check',stage:'inspection',text:'Gefahrgut-Dokumente werden geprüft'},msg:'Gefahrgut-Unterlagen und Kennzeichnung werden geprüft.',safety:2},
   {label:'Ohne Prüfung einlagern',next:{area:'store',stage:'stored-bad',text:'Gefahrgut ungeprüft im Lager'},msg:'Gefahrgut ohne Prüfung eingelagert.',bad:true,safety:-22,time:4},
   {label:'Lieferung sofort zurückweisen',complete:true,msg:'Lieferung ohne sachlichen Grund zurückgewiesen.',bad:true,score:-8,time:4}
  ];
  if(job.stage==='inspection')return[
   {label:'Prüfung okay → vorschriftsmäßig einlagern',complete:true,msg:'Gefahrgut geprüft und vorschriftsmäßig eingelagert.',safety:3},
   {label:'Abweichung feststellen → Annahme klären',complete:true,msg:'Abweichung erkannt und Lieferung bis zur Klärung gesichert.',safety:4,quality:2}
  ];
  if(job.stage==='stored-bad')return[{label:'Einlagerung stoppen & Prüfung nachholen',next:{area:'check',stage:'inspection',text:'Nachträgliche Gefahrgutprüfung läuft'},msg:'Unsichere Einlagerung gestoppt. Prüfung wird nachgeholt.',safety:5,time:4}];
 }
 if(job.kind==='express'){
  if(job.stage==='picking')return[
   {label:'Priorisieren & Kommissionierung abschließen',next:{area:'pack',stage:'packing',text:'18 Positionen kommissioniert · Express'},msg:'Expressauftrag priorisiert und zur Verpackung gegeben.',score:3},
   {label:'Normal weiterbearbeiten',next:{area:'pack',stage:'packing',text:'18 Positionen kommissioniert'},msg:'Expressauftrag ohne Sonderpriorität zur Verpackung gegeben.'},
   {label:'Zurückstellen',next:{area:'pick',stage:'picking-wait',text:'Expressauftrag wartet weiter'},msg:'Expressauftrag zurückgestellt.',bad:true,score:-8,time:4}
  ];
  if(job.stage==='picking-wait')return[
   {label:'Jetzt priorisieren',next:{area:'pack',stage:'packing',text:'18 Positionen kommissioniert · Express'},msg:'Expressauftrag verspätet priorisiert und zur Verpackung gegeben.',score:1},
   {label:'Noch einmal warten lassen',next:{area:'pick',stage:'picking-wait',text:'Expressauftrag wartet weiter'},msg:'Expressauftrag erneut zurückgestellt.',bad:true,score:-8,time:4}
  ];
  if(job.stage==='packing')return[
   {label:'Express verpacken & kennzeichnen',next:{area:'out',stage:'ready',text:'Versandbereit · Expresskennzeichnung gesetzt'},msg:'Expressauftrag verpackt und für den Warenausgang bereitgestellt.',quality:2},
   {label:'Ohne Abschlusskontrolle weitergeben',next:{area:'out',stage:'ready-risk',text:'Versandbereit · Kontrolle übersprungen'},msg:'Expressauftrag ohne Abschlusskontrolle weitergegeben.',bad:true,quality:-8}
  ];
  if(job.stage==='ready'||job.stage==='ready-risk')return[
   {label:'Verladen & Versand abschließen',complete:true,delivered:1,msg:'Expressauftrag verladen und abgeschlossen.',score:5}
  ];
 }
 if(job.kind==='normal'){
  if(job.stage==='packing')return[
   {label:'Verpacken & zum Warenausgang',next:{area:'out',stage:'ready',text:'12 Positionen · versandbereit'},msg:'Auftrag verpackt und für den Warenausgang bereit.'},
   {label:'Zurückstellen',next:{area:'pack',stage:'packing-wait',text:'Fertiger Auftrag wartet'},msg:'Fertiger Auftrag unnötig zurückgestellt.',bad:true,score:-5,time:4}
  ];
  if(job.stage==='packing-wait')return[{label:'Jetzt verpacken',next:{area:'out',stage:'ready',text:'12 Positionen · versandbereit'},msg:'Auftrag nach Wartezeit verpackt und bereitgestellt.'}];
  if(job.stage==='ready')return[{label:'Verladen & Versand abschließen',complete:true,delivered:1,msg:'Auftrag 377 verladen und abgeschlossen.',score:4}];
 }
 if(job.kind==='stock'){
  if(job.stage==='difference')return[
   {label:'Bestand gezielt prüfen',next:{area:'check',stage:'inspection',text:'Soll/Ist-Abgleich läuft'},msg:'Bestandsabweichung wird gezielt geprüft.',quality:2},
   {label:'Bestand einfach korrigieren',complete:true,msg:'Bestand ohne Ursachenprüfung korrigiert.',bad:true,quality:-15},
   {label:'Abweichung ignorieren',next:{area:'store',stage:'ignored',text:'Bestandsabweichung weiterhin offen'},msg:'Bestandsabweichung ignoriert.',bad:true,quality:-10,time:4}
  ];
  if(job.stage==='inspection')return[
   {label:'Differenz klären & Bestand berichtigen',complete:true,msg:'Ursache gefunden, Bestand sauber berichtigt und Vorgang abgeschlossen.',quality:5},
   {label:'Keine Ursache gefunden → Nachzählung',next:{area:'check',stage:'recount',text:'Kontrollzählung läuft'},msg:'Kontrollzählung für den A-Artikel gestartet.',time:3}
  ];
  if(job.stage==='recount')return[{label:'Zählung abschließen & buchen',complete:true,msg:'Kontrollzählung abgeschlossen und Bestand korrekt gebucht.',quality:4,time:3}];
  if(job.stage==='ignored')return[{label:'Abweichung doch prüfen',next:{area:'check',stage:'inspection',text:'Verspäteter Soll/Ist-Abgleich läuft'},msg:'Bestandsabweichung wird verspätet geprüft.',quality:1,time:3}];
 }
 return[];
}

export function advanceJobs(jobs,id,label) {
 const job=jobs.find(j=>j.id===id),action=actionsFor(job).find(a=>a.label===label);
 if(!action)return null;
 const time=action.time||2;
 const late=jobs.filter(j=>j.due>=0&&j.due-time<0).length;
 const nextJobs=jobs.filter(j=>!(j.id===id&&action.complete)).map(j=>({...j,...(j.id===id?action.next:{}),due:j.due-time}));
 return {action,time,late,nextJobs};
}
export function shiftPerformance(score,quality,safety,open) {
 return Math.round(clamp(score*.45+quality*.3+safety*.25)*(INITIAL.length-open)/INITIAL.length);
}
