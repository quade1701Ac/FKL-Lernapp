// Shared cloud history contract. No privileged key and no schema mutation.
export const REVIEW_DAYS = [0, 1, 3, 7, 14, 30];
export function nextReview(previous = {}, score, at = Date.now()) {
  const oldBox = Math.max(0, Math.min(5, Number(previous.box) || 0));
  const box = score >= 80 ? Math.min(5, oldBox + 1) : score >= 60 ? Math.max(1, oldBox) : 0;
  return { box, lastScore: score, lastAnsweredAt: at, next: at + REVIEW_DAYS[box] * 86400000 };
}
export function historyTime(row) {
  const time = Date.parse(row.created_at ?? row.answered_at);
  return Number.isFinite(time) ? time : 0;
}
export function buildStats(rows) {
  const stats = {};
  for (const row of rows) {
    const field = Number(row.field), score = Number(row.score);
    if (row.score == null || row.score === '' || !Number.isInteger(field) || field < 1 || field > 13 || !Number.isFinite(score) || score < 0 || score > 100) continue;
    const topic = row.topic || 'Sonstiges';
    const current = stats[field] ||= { answered: 0, points: 0, correct: 0, topics: {} };
    const tp = current.topics[topic] ||= { answered: 0, points: 0 };
    current.answered++; current.points += score; current.correct += score >= 60 ? 1 : 0;
    tp.answered++; tp.points += score;
  }
  return stats;
}
export function buildReviews(rows) {
  const reviews = {};
  for (const row of [...rows].sort((a, b) => historyTime(a) - historyTime(b))) {
    const score = Number(row.score);
    if (!row.question_id || row.score == null || row.score === '' || !historyTime(row) || !Number.isFinite(score) || score < 0 || score > 100) continue;
    reviews[row.question_id] = nextReview(reviews[row.question_id], score, historyTime(row));
  }
  return reviews;
}
export function localDayKey(value) {
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return null;
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
}
export function learningStreak(rows, now = new Date()) {
  const days = new Set(rows.map(row => localDayKey(row.created_at ?? row.answered_at)).filter(Boolean));
  const cursor = new Date(now);
  cursor.setHours(12,0,0,0);
  if (!days.has(localDayKey(cursor))) cursor.setDate(cursor.getDate()-1);
  let streak = 0;
  while (days.has(localDayKey(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate()-1);
  }
  return streak;
}
export async function loadAnswerHistory(client, userId) {
  if (!userId) throw new Error('Benutzer fehlt');
  // Prefer created_at (the dashboard's existing contract). Only fall back for
  // a missing column, never hide permission/network errors as schema issues.
  for (const column of ['created_at', 'answered_at']) {
    const rows = [], pageSize = 500;
    let offset = 0;
    while (true) {
      const result = await client.from('answer_history')
        .select(`question_id,field,topic,score,${column}`)
        .eq('user_id', userId).order(column, { ascending: true })
        .order('id', { ascending: true }).range(offset, offset + pageSize - 1);
      if (result.error) {
        if (column === 'created_at' && ['42703', 'PGRST204'].includes(result.error.code)) break;
        throw new Error(result.error.message || 'Cloud-Lernstand konnte nicht geladen werden');
      }
      const page = result.data || [];
      rows.push(...page.map(row => ({ ...row, created_at: row[column] })));
      if (page.length < pageSize) return rows;
      offset += page.length;
    }
  }
  throw new Error('Keine unterstützte Zeitspalte vorhanden');
}
