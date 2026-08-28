'use client';

export function shuffleOrder(items=[]){
 const a=items.map((text,correctIndex)=>({text,correctIndex}));
 for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}
 if(a.every((x,i)=>x.correctIndex===i)&&a.length>1)[a[0],a[1]]=[a[1],a[0]];
 return a;
}
export function scoreOrder(order=[]){
 if(order.length<2)return 0;
 const pairs=[];for(let i=0;i<order.length;i++)for(let j=i+1;j<order.length;j++)pairs.push([order[i],order[j]]);
 const right=pairs.filter(([a,b])=>a.correctIndex<b.correctIndex).length;
 return Math.round(right/pairs.length*100);
}
export default function OrderQuestion({order,setOrder,disabled=false}){
 function move(i,dir){if(disabled)return;const j=i+dir;if(j<0||j>=order.length)return;const n=[...order];[n[i],n[j]]=[n[j],n[i]];setOrder(n)}
 return <div className="orderList">{order.map((item,i)=><div className="orderItem" key={item.correctIndex}><span className="orderNo">{i+1}</span><strong>{item.text}</strong><div className="orderButtons"><button disabled={disabled||i===0} onClick={()=>move(i,-1)} aria-label="Schritt nach oben">▲</button><button disabled={disabled||i===order.length-1} onClick={()=>move(i,1)} aria-label="Schritt nach unten">▼</button></div></div>)}<small className="orderHint">Sortiere die Schritte mit ▲ und ▼. Teilweise richtige Reihenfolgen erhalten Teilpunkte.</small></div>
}
