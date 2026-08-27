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

// Diese Aufgaben sind fachlich nahezu deckungsgleich mit bereits vorhandenen
// Aufgaben im kuratierten Pool. Wir behalten jeweils die stärkere Variante,
// statt Lernende dieselbe Antwort nur in leicht anderer Verpackung abzufragen.
const NEAR_DUPLICATE_IDS = new Set([
  'qb14-7-01', // Zeitfenster vs. kürzeste Route
  'qb14-8-01', // seitliche Sicherung bei Freiraum
  'qb14-9-02', // widersprüchliche Empfängerdaten / Versandetikett
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
  if (NEAR_DUPLICATE_IDS.has(question.id)) return false;

  const normalizedText = String(question.question ?? '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();

  if (!normalizedText) return true;
  if (seenQuestionTexts.has(normalizedText)) return false;
  seenQuestionTexts.add(normalizedText);
  return true;
});
