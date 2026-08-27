'use client';

import { useEffect, useState } from 'react';
import { supabase } from './supabase-client';
import ProgressDashboard from './ProgressDashboard';

const STATS_KEY='lagerlogik-v07-stats';
const REVIEW_KEY='lagerlogik-v07-review';
const ACTIVE_USER_KEY='lagerlogik-active-user';

function safeLoad(key,fallback={}){
  if(typeof window==='undefined') return fallback;
  try{return JSON.parse(localStorage.getItem(key))??fallback}catch{return fallback}
}

function answeredCount(stats){
  return Object.values(stats||{}).reduce((n,s)=>n+(s?.answered||0),0);
}

function buildStats(rows){
  const stats={};
  for(const row of rows){
    const field=Number(row.field);
    if(!field) continue;
    const topic=row.topic||'Sonstiges';
    const score=Number(row.score)||0;
    const current=stats[field]||{answered:0,points:0,correct:0,topics:{}};
    const tp=current.topics[topic]||{answered:0,points:0};
    stats[field]={...current,answered:current.answered+1,points:current.points+score,correct:current.correct+(score>=60?1:0),topics:{...current.topics,[topic]:{answered:tp.answered+1,points:tp.points+score}}};
  }
  return stats;
}

function buildReviews(rows){
  const latest={};
  for(const row of rows){
    if(!row.question_id) continue;
    const old=latest[row.question_id];
    if(!old||new Date(row.answered_at)>new Date(old.answered_at)) latest[row.question_id]=row;
  }
  const now=Date.now(), reviews={};
  for(const [id,row] of Object.entries(latest)){
    const score=Number(row.score)||0;
    const box=score>=60?1:0;
    const delay=score>=80?86400000:score>=60?43200000:0;
    reviews[id]={box,lastScore:score,next:now+delay};
  }
  return reviews;
}

export default function AuthGate({ children }) {
  const [session,setSession]=useState(null);
  const [loading,setLoading]=useState(true);
  const [authMode,setAuthMode]=useState('login');
  const [name,setName]=useState('');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [password2,setPassword2]=useState('');
  const [error,setError]=useState('');
  const [message,setMessage]=useState('');
  const [busy,setBusy]=useState(false);
  const [cloudCount,setCloudCount]=useState(0);
  const [profileOpen,setProfileOpen]=useState(false);
  const [profileName,setProfileName]=useState('');
  const [profileMessage,setProfileMessage]=useState('');
  const [profileError,setProfileError]=useState('');
  const [profileBusy,setProfileBusy]=useState(false);
  const [dashboardOpen,setDashboardOpen]=useState(false);

  function prepareLocalForUser(userId){
    if(typeof window==='undefined'||!userId)return;
    const previous=localStorage.getItem(ACTIVE_USER_KEY);
    if(previous&&previous!==userId){
      localStorage.removeItem(STATS_KEY);
      localStorage.removeItem(REVIEW_KEY);
    }
    localStorage.setItem(ACTIVE_USER_KEY,userId);
  }

  async function hydrateFromCloud(nextSession){
    if(!nextSession?.user){setLoading(false);return}
    setLoading(true);
    prepareLocalForUser(nextSession.user.id);
    const {data:rows,error:cloudError}=await supabase.from('answer_history').select('question_id,field,topic,score,answered_at').order('answered_at',{ascending:true});
    if(!cloudError&&rows){
      setCloudCount(rows.length);
      const cloudStats=buildStats(rows),localStats=safeLoad(STATS_KEY,{});
      if(answeredCount(cloudStats)>=answeredCount(localStats)) localStorage.setItem(STATS_KEY,JSON.stringify(cloudStats));
      const cloudReviews=buildReviews(rows),localReviews=safeLoad(REVIEW_KEY,{});
      if(Object.keys(cloudReviews).length>=Object.keys(localReviews).length) localStorage.setItem(REVIEW_KEY,JSON.stringify(cloudReviews));
    }
    setLoading(false);
  }

  useEffect(()=>{
    let active=true;
    supabase.auth.getSession().then(async({data})=>{
      if(!active)return;
      const next=data.session??null;
      setSession(next);
      setProfileName(next?.user?.user_metadata?.display_name||'');
      await hydrateFromCloud(next);
    });
    const {data:listener}=supabase.auth.onAuthStateChange((_event,nextSession)=>{
      if(!active)return;
      setSession(nextSession??null);
      setProfileName(nextSession?.user?.user_metadata?.display_name||'');
      if(nextSession)setTimeout(()=>hydrateFromCloud(nextSession),0);else setLoading(false);
    });
    return()=>{active=false;listener.subscription.unsubscribe();};
  },[]);

  function switchMode(mode){
    setAuthMode(mode);setError('');setMessage('');setPassword('');setPassword2('');
  }

  async function submit(e){
    e.preventDefault();setBusy(true);setError('');setMessage('');
    if(authMode==='register'){
      if(password.length<6){setError('Das Passwort muss mindestens 6 Zeichen lang sein.');setBusy(false);return}
      if(password!==password2){setError('Die beiden Passwörter stimmen nicht überein.');setBusy(false);return}
      const {data,error:signUpError}=await supabase.auth.signUp({email,password,options:{data:{display_name:name.trim()}}});
      if(signUpError){
        setError(signUpError.message.includes('already registered')?'Für diese E-Mail-Adresse gibt es bereits ein Konto.':signUpError.message);
      }else if(data.session){
        await hydrateFromCloud(data.session);
      }else{
        setMessage('Konto erstellt. Bitte prüfe gegebenenfalls dein E-Mail-Postfach und melde dich danach an.');setAuthMode('login');
      }
    }else{
      const {data,error:loginError}=await supabase.auth.signInWithPassword({email,password});
      if(loginError)setError(loginError.message==='Invalid login credentials'?'E-Mail oder Passwort ist falsch.':loginError.message);else if(data.session)await hydrateFromCloud(data.session);
    }
    setBusy(false);
  }

  async function saveProfile(e){
    e.preventDefault();
    const clean=profileName.trim();
    if(clean.length<2){setProfileError('Bitte gib mindestens 2 Zeichen ein.');return}
    setProfileBusy(true);setProfileError('');setProfileMessage('');
    const {data,error:updateError}=await supabase.auth.updateUser({data:{display_name:clean}});
    if(updateError){setProfileError(updateError.message)}else{
      setSession(s=>s?{...s,user:data.user}:s);
      setProfileName(data.user?.user_metadata?.display_name||clean);
      setProfileMessage('Name gespeichert.');
    }
    setProfileBusy(false);
  }

  async function logout(){await supabase.auth.signOut();setCloudCount(0);setProfileOpen(false);setDashboardOpen(false);}

  if(loading)return <div style={styles.center}><div style={styles.loader}>☁️ Lernstand wird synchronisiert …</div></div>;

  if(!session){
    const registering=authMode==='register';
    return <main style={styles.center}><section style={styles.card}>
      <div style={styles.logo}>▣ <strong>LagerLogik</strong> <span style={styles.version}>online</span></div>
      <div style={styles.tabs}><button type="button" style={{...styles.tab,...(!registering?styles.tabActive:{})}} onClick={()=>switchMode('login')}>Anmelden</button><button type="button" style={{...styles.tab,...(registering?styles.tabActive:{})}} onClick={()=>switchMode('register')}>Registrieren</button></div>
      <p style={styles.kicker}>FACHKRAFT FÜR LAGERLOGISTIK</p>
      <h1 style={styles.title}>{registering?'Konto erstellen':'Anmelden'}</h1>
      <p style={styles.text}>{registering?'Erstelle dein eigenes Konto. Dein Lernstand wird anschließend sicher deinem Benutzer zugeordnet.':'Melde dich an, damit dein Lernstand auf deinen Geräten synchronisiert wird.'}</p>
      <form onSubmit={submit} style={styles.form}>
        {registering&&<><label style={styles.label}>Name</label><input style={styles.input} type="text" value={name} onChange={e=>setName(e.target.value)} autoComplete="name" placeholder="z. B. Pascal" required /></>}
        <label style={styles.label}>E-Mail</label><input style={styles.input} type="email" value={email} onChange={e=>setEmail(e.target.value)} autoComplete="email" required />
        <label style={styles.label}>Passwort</label><input style={styles.input} type="password" value={password} onChange={e=>setPassword(e.target.value)} autoComplete={registering?'new-password':'current-password'} required />
        {registering&&<><label style={styles.label}>Passwort wiederholen</label><input style={styles.input} type="password" value={password2} onChange={e=>setPassword2(e.target.value)} autoComplete="new-password" required /><small style={styles.hint}>Mindestens 6 Zeichen.</small></>}
        {error&&<div style={styles.error}>{error}</div>}{message&&<div style={styles.success}>{message}</div>}
        <button style={{...styles.button,opacity:busy?.65:1}} disabled={busy}>{busy?(registering?'Konto wird erstellt …':'Anmeldung läuft …'):(registering?'Kostenlos registrieren':'Anmelden')}</button>
      </form>
      <p style={styles.note}>{registering?'Bereits registriert? Oben auf „Anmelden“ wechseln.':'Noch kein Konto? Oben auf „Registrieren“ wechseln.'}</p>
    </section></main>;
  }

  const shownName=session.user.user_metadata?.display_name||session.user.email?.split('@')[0]||'Profil';
  return <>
    <div style={styles.accountBar}>
      <span><b>☁️ Synchronisiert</b> · {cloudCount} Antworten</span>
      <button onClick={()=>{setDashboardOpen(true);setProfileOpen(false)}} style={styles.profileButton}>📊 Dashboard</button>
      <button onClick={()=>{setProfileOpen(v=>!v);setDashboardOpen(false);setProfileMessage('');setProfileError('')}} style={styles.profileButton}>👤 {shownName}</button>
      <button onClick={logout} style={styles.logout}>Abmelden</button>
    </div>
    {dashboardOpen&&<ProgressDashboard onClose={()=>setDashboardOpen(false)} />}
    {profileOpen&&<div style={styles.profileCard}>
      <div style={styles.profileHead}><div><b>Dein Profil</b><small style={styles.profileEmail}>{session.user.email}</small></div><button onClick={()=>setProfileOpen(false)} style={styles.close}>×</button></div>
      <form onSubmit={saveProfile} style={styles.form}>
        <label style={styles.label}>Anzeigename</label>
        <input style={styles.input} type="text" value={profileName} onChange={e=>setProfileName(e.target.value)} placeholder="Dein Name" required />
        {profileError&&<div style={styles.error}>{profileError}</div>}
        {profileMessage&&<div style={styles.success}>{profileMessage}</div>}
        <button style={{...styles.button,opacity:profileBusy?.65:1}} disabled={profileBusy}>{profileBusy?'Speichert …':'Profil speichern'}</button>
      </form>
      <p style={styles.note}>Der Name wird in deinem Supabase-Benutzerprofil gespeichert und bei neuen Lernantworten verwendet.</p>
    </div>}
    {children}
  </>;
}

const styles={
  center:{minHeight:'100vh',display:'grid',placeItems:'center',padding:'24px',background:'radial-gradient(circle at 15% 0,#14213b 0,transparent 34%),#080d18',color:'#edf4ff'},loader:{color:'#93a4bf'},card:{width:'100%',maxWidth:'460px',padding:'34px',borderRadius:'22px',background:'linear-gradient(180deg,#131d2f,#0d1523)',border:'1px solid #24344f',boxShadow:'0 28px 80px rgba(0,0,0,.28)'},logo:{fontSize:'21px',marginBottom:'22px'},version:{fontSize:'11px',marginLeft:'8px',padding:'4px 8px',borderRadius:'999px',background:'#20345b',color:'#a8c7ff'},tabs:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'6px',padding:'5px',border:'1px solid #24344f',borderRadius:'12px',background:'#0a1220',marginBottom:'26px'},tab:{border:0,borderRadius:'8px',padding:'10px',background:'transparent',color:'#93a4bf',fontWeight:800,cursor:'pointer'},tabActive:{background:'#1c3154',color:'#edf4ff'},kicker:{fontSize:'11px',fontWeight:800,letterSpacing:'.14em',color:'#7fa8e7'},title:{fontSize:'42px',margin:'8px 0 10px'},text:{color:'#93a4bf',lineHeight:1.55,marginBottom:'24px'},form:{display:'grid',gap:'9px'},label:{fontSize:'12px',fontWeight:700,color:'#b9c8df',marginTop:'6px'},input:{width:'100%',padding:'13px 14px',borderRadius:'11px',border:'1px solid #2b4265',background:'#0a1220',color:'#edf4ff',outline:'none'},hint:{color:'#71829b',fontSize:'11px'},error:{padding:'11px 12px',borderRadius:'10px',background:'#3a1822',border:'1px solid #d06480',color:'#fff4f6',fontSize:'13px'},success:{padding:'11px 12px',borderRadius:'10px',background:'#103329',border:'1px solid #43a283',color:'#f1fff9',fontSize:'13px'},button:{marginTop:'8px',border:0,borderRadius:'11px',padding:'13px 17px',fontWeight:800,cursor:'pointer',background:'#e7f0ff',color:'#0d1727'},note:{fontSize:'11px',color:'#71829b',margin:'18px 0 0'},accountBar:{position:'fixed',zIndex:50,right:'18px',top:'14px',display:'flex',gap:'8px',alignItems:'center',padding:'8px 9px 8px 13px',borderRadius:'999px',background:'rgba(13,21,35,.96)',border:'1px solid #24344f',color:'#b8c8df',fontSize:'11px',boxShadow:'0 10px 30px rgba(0,0,0,.25)'},profileButton:{border:'1px solid #344d72',background:'#17243a',color:'#edf4ff',borderRadius:'999px',padding:'6px 10px',cursor:'pointer',fontSize:'11px',fontWeight:700},logout:{border:'1px solid #344d72',background:'#17243a',color:'#edf4ff',borderRadius:'999px',padding:'6px 10px',cursor:'pointer',fontSize:'11px'},profileCard:{position:'fixed',zIndex:60,right:'18px',top:'62px',width:'min(360px,calc(100vw - 36px))',padding:'20px',borderRadius:'16px',background:'#101827',border:'1px solid #2b4265',boxShadow:'0 22px 70px rgba(0,0,0,.38)',color:'#edf4ff'},profileHead:{display:'flex',justifyContent:'space-between',gap:'12px',alignItems:'flex-start',marginBottom:'13px'},profileEmail:{display:'block',color:'#93a4bf',fontSize:'11px',marginTop:'4px'},close:{border:0,background:'transparent',color:'#93a4bf',fontSize:'22px',lineHeight:1,cursor:'pointer'}
};
