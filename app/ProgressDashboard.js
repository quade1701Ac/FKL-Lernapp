'use client';

import { useEffect, useMemo, useState } from 'react';
import { supabase } from './supabase-client';
import { learningFields } from './data';

const MIN_OVERALL_ANSWERS = 10;
const MIN_FIELD_ANSWERS = 5;
const MIN_TOPIC_ANSWERS = 3;

export default function ProgressDashboard({ onClose }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        if (active) { setRows([]); setLoading(false); }
        return;
      }
      const { data, error } = await supabase
        .from('answer_history')
        .select('field, topic, score, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (!active) return;
      if (error) setError(error.message);
      else setRows(data || []);
      setLoading(false);
    })();
    return () => { active = false; };
  }, []);

  const stats = useMemo(() => {
    const fields = {};
    const topics = {};
    let sum = 0;
    for (const r of rows) {
      const score = Number(r.score) || 0;
      sum += score;
      const f = Number(r.field);
      fields[f] ||= { sum: 0, count: 0 };
      fields[f].sum += score;
      fields[f].count++;
      const key = `${f}|||${r.topic || 'Ohne Thema'}`;
      topics[key] ||= { field: f, topic: r.topic || 'Ohne Thema', sum: 0, count: 0 };
      topics[key].sum += score;
      topics[key].count++;
    }
    const overall = rows.length >= MIN_OVERALL_ANSWERS ? Math.round(sum / rows.length) : null;
    const fieldRows = learningFields.map(f => {
      const s = fields[f.id] || { sum: 0, count: 0 };
      return { ...f, count: s.count, avg: s.count ? Math.round(s.sum / s.count) : null };
    });
    const reliableFields = fieldRows.filter(f => f.count >= MIN_FIELD_ANSWERS);
    const strongest = reliableFields.length ? [...reliableFields].sort((a,b) => b.avg-a.avg)[0] : null;
    const weakest = reliableFields.length ? [...reliableFields].sort((a,b) => a.avg-b.avg)[0] : null;
    const weakTopics = Object.values(topics)
      .filter(t => t.count >= MIN_TOPIC_ANSWERS)
      .map(t => ({ ...t, avg: Math.round(t.sum/t.count) }))
      .sort((a,b) => a.avg-b.avg)
      .slice(0,3);
    const due = rows.filter(r => (Number(r.score)||0) < 80).length;
    return { overall, fieldRows, strongest, weakest, weakTopics, due };
  }, [rows]);

  if (loading) return <div className="progressOverlay"><div className="progressPanel"><h2>Lernstand wird geladen …</h2></div></div>;

  return <div className="progressOverlay">
    <div className="progressPanel">
      <div className="progressHeader">
        <div><span className="kicker">PERSÖNLICHES DASHBOARD · CLOUD</span><h1>Dein Lernstand</h1></div>
        <button className="secondary" onClick={onClose}>✕ Schließen</button>
      </div>
      {error && <p className="feedback bad">{error}</p>}
      <div className="progressSummary">
        <div className="card"><span>Gesamtleistung</span><strong>{stats.overall == null ? '–' : `${stats.overall}%`}</strong><small>{stats.overall == null ? `Noch ${Math.max(0, MIN_OVERALL_ANSWERS-rows.length)} Antworten bis zur ersten aussagekräftigen Quote` : `${rows.length} Cloud-Antworten`}</small></div>
        <div className="card"><span>Stärkstes Lernfeld</span><strong>{stats.strongest ? `LF ${stats.strongest.id}` : '–'}</strong><small>{stats.strongest ? `${stats.strongest.avg}% · ${stats.strongest.title}` : `Ab ${MIN_FIELD_ANSWERS} Antworten je LF`}</small></div>
        <div className="card"><span>Schwächstes Lernfeld</span><strong>{stats.weakest ? `LF ${stats.weakest.id}` : '–'}</strong><small>{stats.weakest ? `${stats.weakest.avg}% · ${stats.weakest.title}` : `Ab ${MIN_FIELD_ANSWERS} Antworten je LF`}</small></div>
        <div className="card"><span>Wiederholungen</span><strong>{stats.due}</strong><small>Antworten unter 80%</small></div>
      </div>

      <div className="progressBody">
        <section className="card progressFields">
          <div className="progressSectionTitle"><h2>Fortschritt je Lernfeld</h2><span>Quote · Anzahl Antworten</span></div>
          {stats.fieldRows.map(f => <div className="fieldProgress" key={f.id}>
            <strong>{f.icon} LF {f.id}</strong>
            <div className="progress"><i style={{width:`${f.avg ?? 0}%`}}/></div>
            <span>{f.count ? `${f.avg}%` : 'Neu'} {f.count ? <small>{f.count}×</small> : null}</span>
          </div>)}
        </section>
        <aside className="progressAside">
          <div className="card recommendation">
            <span className="kicker">EMPFEHLUNG</span>
            <h2>{stats.weakest ? `${stats.weakest.icon} LF ${stats.weakest.id}` : '📥 Noch Daten sammeln'}</h2>
            <p>{stats.weakest ? stats.weakest.title : 'Beantworte weiter Fragen. Sobald genug Daten vorliegen, erscheint hier dein schwächstes Lernfeld.'}</p>
            <small>{stats.weakest ? `Aktuell ${stats.weakest.avg}% bei ${stats.weakest.count} Antworten.` : `${rows.length} von ${MIN_OVERALL_ANSWERS} Antworten für die Gesamtquote erfasst.`}</small>
          </div>
          <div className="card weakTopics">
            <div className="progressSectionTitle"><h2>Schwächste Themen</h2><span>mind. {MIN_TOPIC_ANSWERS} Antworten</span></div>
            {stats.weakTopics.length ? stats.weakTopics.map((t,i)=><div className="weakTopic" key={`${t.field}-${t.topic}`}><div><strong>{i+1}. {t.topic}</strong><small>LF {t.field} · {t.count} Antworten</small></div><b>{t.avg}%</b></div>) : <p>Noch kein Thema hat mindestens {MIN_TOPIC_ANSWERS} Antworten. Erst etwas mehr Daten sammeln, dann wird die Rangliste aussagekräftig. 📦</p>}
          </div>
        </aside>
      </div>
    </div>
  </div>;
}
