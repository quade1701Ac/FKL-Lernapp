import {shuffledSigns} from './safety-sign-data';
export const shapeQuestions=[
 {id:'mandatory',name:'Gebotszeichen',shape:'Kreis',background:'Blau',explanation:'Blauer Kreis mit weißem Bildzeichen.'},
 {id:'prohibited',name:'Verbotszeichen',shape:'Kreis',background:'Weiß',explanation:'Weiße Grundfläche, schwarzes Bildzeichen, roter Rand und roter Schrägbalken. Die Sicherheitsfarbe ist Rot.'},
 {id:'warning',name:'Warnzeichen',shape:'Dreieck',background:'Gelb',explanation:'Gelbes Dreieck mit schwarzem Rand und schwarzem Bildzeichen.'},
 {id:'rescue',name:'Rettungszeichen',shape:'Quadrat oder Rechteck',background:'Grün',explanation:'Grüne Grundfläche mit weißem Bildzeichen.'},
 {id:'fire',name:'Brandschutzzeichen',shape:'Quadrat oder Rechteck',background:'Rot',explanation:'Rote Grundfläche mit weißem Bildzeichen.'}
];
export const pictureKey=code=>`picture:${code}`;
export const shapeKey=id=>`shape:${id}`;
export function uncertainSignPool(pool,reviews={}){return pool.filter(s=>Number.isFinite(reviews[pictureKey(s.code)]?.score)&&reviews[pictureKey(s.code)].score<80)}
export function signRound(pool,reviews={},onlyUncertain=false,random=Math.random){const weak=shuffledSigns(uncertainSignPool(pool,reviews),random);if(onlyUncertain)return weak.slice(0,10);const weakCodes=new Set(weak.map(s=>s.code));return [...weak,...shuffledSigns(pool.filter(s=>!weakCodes.has(s.code)),random)].slice(0,10)}
export function recordSignReview(reviews,key,score,now=Date.now()){if(!Number.isFinite(score)||score<0||score>100)return reviews;return {...reviews,[key]:{score:Math.round(score),attempts:(reviews[key]?.attempts||0)+1,updatedAt:now}}}
export function signReviewStorageKey(userId){return `lagerlogik-sign-training-v1:${encodeURIComponent(userId||'guest')}`}
export function readSignReviews(storage,userId){try{const parsed=JSON.parse(storage?.getItem(signReviewStorageKey(userId))||'{}');if(!parsed||typeof parsed!=='object'||Array.isArray(parsed))return {};return Object.fromEntries(Object.entries(parsed).filter(([k,v])=>/^(picture:|shape:)/.test(k)&&v&&Number.isFinite(v.score)&&v.score>=0&&v.score<=100))}catch{return {}}}
export function shapeGrade(q,shape,background){const shapeCorrect=shape===q.shape,colorCorrect=background===q.background;return {score:(Number(shapeCorrect)+Number(colorCorrect))*50,shapeCorrect,colorCorrect}}
export function signQuestion(sign){return {id:pictureKey(sign.code),field:4,topic:'Sicherheit',type:'free',difficulty:2,question:'Welche Bedeutung hat dieses abgebildete Zeichen? Nenne die Bedeutung; eine zusätzliche Beschreibung der Form oder Farbe ist nicht erforderlich.',solution:sign.label,keywords:sign.label.split(/[\s·;\/]+/).filter(w=>w.length>3),minHits:1}}
