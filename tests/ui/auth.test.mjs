import test from 'node:test';
import assert from 'node:assert/strict';
import React,{useEffect} from 'react';
import {create,act} from 'react-test-renderer';
import AuthGate from '../../app/AuthGate.js';
import {supabase,user} from './supabase-mock.mjs';
globalThis.IS_REACT_ACT_ENVIRONMENT=true;
function environment(){
 const data=new Map();
 globalThis.localStorage={getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,String(v)),removeItem:k=>data.delete(k)};
 globalThis.window=new EventTarget();
}
test('cloud hydration restores progress, refresh preserves child, account switch isolates state',async()=>{
 environment();let callback,mounts=0;const queries=[];
 supabase.auth.getSession=async()=>({data:{session:{user}}});
 supabase.auth.onAuthStateChange=fn=>{callback=fn;return{data:{subscription:{unsubscribe(){}}}}};
 supabase.from=()=>{let owner;return{select(){return this},eq(k,v){owner=v;return this},order(){return this},async range(){queries.push(owner);return{data:owner===user.id?[{question_id:'x',field:1,topic:'Test',score:100,created_at:'2026-01-01T12:00:00Z'}]:[]}}}};
 function Child(){useEffect(()=>{mounts++},[]);return React.createElement('p',null,'Session aktiv')}
 let root;await act(async()=>{root=create(React.createElement(AuthGate,null,React.createElement(Child)))});
 assert.equal(JSON.parse(localStorage.getItem('lagerlogik-v07-stats'))[1].answered,1);
 assert.equal(mounts,1);
 await act(async()=>callback('TOKEN_REFRESHED',{user}));assert.equal(mounts,1);
 localStorage.setItem('lagerlogik-v05-stats','old');
 await act(async()=>{callback('SIGNED_IN',{user:{...user,id:'second'}});await new Promise(resolve=>setTimeout(resolve,10))});
 assert.equal(mounts,2);assert.equal(localStorage.getItem('lagerlogik-v05-stats'),null);
 assert.deepEqual(JSON.parse(localStorage.getItem('lagerlogik-v07-stats')),{});
 assert.deepEqual(queries,[user.id,'second']);
 await act(async()=>root.unmount());
});
test('session network failure releases loading screen and displays error',async()=>{
 environment();supabase.auth.getSession=async()=>{throw new Error('Netzwerkfehler')};
 supabase.auth.onAuthStateChange=()=>({data:{subscription:{unsubscribe(){}}}});
 let root;await act(async()=>{root=create(React.createElement(AuthGate,null,'App'))});
 const rendered=JSON.stringify(root.toJSON());assert.match(rendered,/Netzwerkfehler/);assert.doesNotMatch(rendered,/wird synchronisiert/);
 await act(async()=>root.unmount());
});
