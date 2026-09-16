import { readFile } from 'node:fs/promises';
import { transform } from 'next/dist/build/swc/index.js';
import { resolve as resolveJs } from './resolve.mjs';
export async function resolve(specifier,context,nextResolve){
 if(specifier.endsWith('supabase-client')||specifier.endsWith('supabase-client.js'))return {url:new URL('./ui/supabase-mock.mjs',import.meta.url).href,shortCircuit:true};
 if(specifier.endsWith('.css'))return {url:'data:text/javascript,export default {}',shortCircuit:true};
 return resolveJs(specifier,context,nextResolve);
}
export async function load(url,context,nextLoad){
 if(url.includes('/app/')&&url.endsWith('.js')){
  const source=await readFile(new URL(url),'utf8');
  const result=await transform(source,{filename:new URL(url).pathname,jsc:{parser:{syntax:'ecmascript',jsx:true},target:'es2022',transform:{react:{runtime:'automatic'}}},module:{type:'es6'}});
  return {format:'module',source:result.code,shortCircuit:true};
 }
 return nextLoad(url,context);
}
