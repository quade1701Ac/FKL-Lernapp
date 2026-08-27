// Zentraler Fragen-Aggregator.
// Kuratierter Grundstock plus praxis-, transfer- und prüfungsorientierte Erweiterungen.
import { v08Questions } from './questions-v08';
import { v09Questions } from './questions-v09';
import { qualityQuestions } from './questions-quality';
import { v11Questions } from './questions-v11';
import { replacementLf5to12Questions } from './questions-replacement-lf5-12';
import { expansionV12Questions } from './questions-expansion-v12';
import { qualityReplacementQuestions } from './question-quality-filter';
import { qualityLf9to12Questions } from './questions-quality-lf9-12';
import { v10Batch1Questions } from './questions-v10-batch1';
import { v10CalculationQuestions } from './questions-v10-calculations';
import { v10SituationQuestions1 } from './questions-v10-situations-1';
import { v10SituationQuestions2 } from './questions-v10-situations-2';
import { balanceV13Questions } from './questions-balance-v13';
import { balanceV14Questions } from './questions-balance-v14';

// Fachlich nahezu deckungsgleiche Varianten. Je Thema bleibt die stärkere bzw.
// praxisnähere Frage aktiv, statt denselben Lernpunkt mehrfach abzufragen.
const NEAR_DUPLICATE_IDS = new Set([
  'qb14-7-01', // Zeitfenster vs. kürzeste Route -> sit1/sit2 decken den Transfer bereits ab
  'qb14-7-04', // Kilometerersparnis vs. Wartezeit -> nahezu identisch zu sit2-7-03
  'qb14-8-01', // seitliche Sicherung bei Freiraum -> nahezu identisch zu sit2-8-03
  'qb14-8-02', // beschädigter Zurrgurt -> nahezu identisch zu sit1-8-01
  'qb14-8-04', // Achslast trotz korrektem Gesamtgewicht -> nahezu identisch zu sit1-8-02
  'qb14-9-02', // widersprüchliche Empfängerdaten / Versandetikett
  'qb14-9-07', // wertvolle Sendung: Tracking/Haftung/Nachweis -> nahezu identisch zu sit2-9-01
]);

// Diese Fragen sind nicht zwingend fachlich falsch, passen aber in der aktuellen
// LF-Zuordnung nicht sauber genug zum Lernfeld. Sie werden bis zu einer späteren
// gezielten Überarbeitung nicht ausgespielt.
const MISPLACED_IDS = new Set([
  'sit2-4-01', // Versandverpackung liegt in LF4, obwohl LF4 hier innerbetrieblicher Transport ist
  'sit2-4-02', // Versandkennzeichnung gehört nicht in LF4
  'sit2-4-03', // Mehrweg-/Einweg-Versandverpackung gehört nicht in LF4
  'sit2-5-01', // Versandbereitstellung statt eigentlicher Kommissionierung
  'sit2-5-02', // Versand/Ladungsträger statt Kommissionierung
  'sit2-5-03', // Verladung statt Kommissionierung
  'sit2-6-01', // Auswahl Paketdienst/Spedition passt fachlich besser zu Versand als Verpacken
  'sit2-6-02', // Transportmittelwahl statt Verpacken
  'sit2-6-03', // Sonderfahrten/Expressnetz statt Verpacken
]);

const allQuestions = [
  ...v08Questions,
  ...v09Questions,
  ...qualityQuestions,
  ...v11Questions,
  ...replacementLf5to12Questions,
  ...expansionV12Questions,
  ...qualityReplacementQuestions,
  ...qualityLf9to12Questions,
  ...v10Batch1Questions,
  ...v10CalculationQuestions,
  ...v10SituationQuestions1,
  ...v10SituationQuestions2,
  ...balanceV13Questions,
  ...balanceV14Questions,
];

// Zusätzlich echte 1:1-Dubletten automatisch abfangen. Die erste kuratierte
// Variante bleibt erhalten; nur identische Fragetexte werden entfernt.
const seenQuestionTexts = new Set();
export const v07Questions = allQuestions.filter((question) => {
  if (NEAR_DUPLICATE_IDS.has(question.id) || MISPLACED_IDS.has(question.id)) return false;

  const normalizedText = String(question.question ?? '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();

  if (!normalizedText) return true;
  if (seenQuestionTexts.has(normalizedText)) return false;
  seenQuestionTexts.add(normalizedText);
  return true;
});
