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
 function select(i){if(disabled)return;setOrder(prev=>prev.map((x,idx)=>({...x,_selected:idx===i?!x._selected:false})))}
 function moveSelected(target){if(disabled)return;const from=order.findIndex(x=>x._selected);if(from<0||from===target)return;const n=order.map(x=>({...x,_selected:false}));const [item]=n.splice(from,1);n.splice(target,0,item);setOrder(n)}
 return <div className="orderList">{order.map((item,i)=><div className={`orderItem ${item._selected?'orderSelected':''}`} key={item.correctIndex} onClick={()=>select(i)}><button type="button" className="orderNo" disabled={disabled} aria-label={`Schritt ${i+1} auswählen`}>{i+1}</button><strong>{item.text}</strong><div className="orderButtons"><button type="button" disabled={disabled||i===0} onClick={e=>{e.stopPropagation();move(i,-1)}} aria-label="Schritt nach oben">▲</button><button type="button" disabled={disabled||i===order.length-1} onClick={e=>{e.stopPropagation();move(i,1)}} aria-label="Schritt nach unten">▼</button></div>{item._selected&&<div className="orderJump">{order.map((_,target)=>target!==i&&<button type="button" key={target} onClick={e=>{e.stopPropagation();moveSelected(target)}}>auf {target+1}</button>)}</div>}</div>)}<small className="orderHint">Tippe einen Schritt an und verschiebe ihn direkt auf eine Position oder nutze ▲ ▼. Teilweise richtige Reihenfolgen erhalten Teilpunkte.</small></div>
}
