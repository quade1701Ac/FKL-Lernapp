'use client';

import { useEffect, useState } from 'react';
import { supabase } from './supabase-client';

export default function AuthGate({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session ?? null);
      setLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  async function login(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });
    if (loginError) setError(loginError.message === 'Invalid login credentials' ? 'E-Mail oder Passwort ist falsch.' : loginError.message);
    setBusy(false);
  }

  async function logout() {
    await supabase.auth.signOut();
  }

  if (loading) {
    return <div style={styles.center}><div style={styles.loader}>LagerLogik wird geladen …</div></div>;
  }

  if (!session) {
    return (
      <main style={styles.center}>
        <section style={styles.card}>
          <div style={styles.logo}>▣ <strong>LagerLogik</strong> <span style={styles.version}>online</span></div>
          <p style={styles.kicker}>FACHKRAFT FÜR LAGERLOGISTIK</p>
          <h1 style={styles.title}>Anmelden</h1>
          <p style={styles.text}>Melde dich an, damit dein Lernstand deinem Konto zugeordnet werden kann.</p>
          <form onSubmit={login} style={styles.form}>
            <label style={styles.label}>E-Mail</label>
            <input style={styles.input} type="email" value={email} onChange={e=>setEmail(e.target.value)} autoComplete="email" required />
            <label style={styles.label}>Passwort</label>
            <input style={styles.input} type="password" value={password} onChange={e=>setPassword(e.target.value)} autoComplete="current-password" required />
            {error && <div style={styles.error}>{error}</div>}
            <button style={{...styles.button, opacity:busy?.65:1}} disabled={busy}>{busy?'Anmeldung läuft …':'Anmelden'}</button>
          </form>
          <p style={styles.note}>Testkonten werden vorerst über Supabase angelegt.</p>
        </section>
      </main>
    );
  }

  return (
    <>
      <div style={styles.accountBar}>
        <span><b>☁️ Online</b> · {session.user.email}</span>
        <button onClick={logout} style={styles.logout}>Abmelden</button>
      </div>
      {children}
    </>
  );
}

const styles = {
  center:{minHeight:'100vh',display:'grid',placeItems:'center',padding:'24px',background:'radial-gradient(circle at 15% 0,#14213b 0,transparent 34%),#080d18',color:'#edf4ff'},
  loader:{color:'#93a4bf'},
  card:{width:'100%',maxWidth:'460px',padding:'34px',borderRadius:'22px',background:'linear-gradient(180deg,#131d2f,#0d1523)',border:'1px solid #24344f',boxShadow:'0 28px 80px rgba(0,0,0,.28)'},
  logo:{fontSize:'21px',marginBottom:'34px'},
  version:{fontSize:'11px',marginLeft:'8px',padding:'4px 8px',borderRadius:'999px',background:'#20345b',color:'#a8c7ff'},
  kicker:{fontSize:'11px',fontWeight:800,letterSpacing:'.14em',color:'#7fa8e7'},
  title:{fontSize:'42px',margin:'8px 0 10px'},
  text:{color:'#93a4bf',lineHeight:1.55,marginBottom:'24px'},
  form:{display:'grid',gap:'9px'},
  label:{fontSize:'12px',fontWeight:700,color:'#b9c8df',marginTop:'6px'},
  input:{width:'100%',padding:'13px 14px',borderRadius:'11px',border:'1px solid #2b4265',background:'#0a1220',color:'#edf4ff',outline:'none'},
  error:{padding:'11px 12px',borderRadius:'10px',background:'#3a1822',border:'1px solid #d06480',color:'#fff4f6',fontSize:'13px'},
  button:{marginTop:'8px',border:0,borderRadius:'11px',padding:'13px 17px',fontWeight:800,cursor:'pointer',background:'#e7f0ff',color:'#0d1727'},
  note:{fontSize:'11px',color:'#71829b',margin:'18px 0 0'},
  accountBar:{position:'fixed',zIndex:50,right:'18px',top:'14px',display:'flex',gap:'12px',alignItems:'center',padding:'8px 10px 8px 13px',borderRadius:'999px',background:'rgba(13,21,35,.96)',border:'1px solid #24344f',color:'#b8c8df',fontSize:'11px',boxShadow:'0 10px 30px rgba(0,0,0,.25)'},
  logout:{border:'1px solid #344d72',background:'#17243a',color:'#edf4ff',borderRadius:'999px',padding:'6px 10px',cursor:'pointer',fontSize:'11px'}
};
