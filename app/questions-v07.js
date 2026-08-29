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
import { orderV15Questions } from './questions-order-v15';
import { lf1V101Questions } from './questions-lf1-v101';
import { curriculumGapQuestions } from './questions-curriculum-gaps-v102';

const NEAR_DUPLICATE_IDS = new Set([
  'qb14-7-01','qb14-7-04','qb14-8-01','qb14-8-02','qb14-8-04','qb14-9-02','qb14-9-07',
  // LF1: repetitive variants of basic receiving checks/damage documentation.
  // Keep the stronger scenario questions and replace breadth with the v1.0.1 LF1 set.
  'q10-1-01','q10-1-02','q10-1-03',
]);

const MISPLACED_IDS = new Set([
  'sit2-4-01','sit2-4-02','sit2-4-03','sit2-5-01','sit2-5-02','sit2-5-03','sit2-6-01','sit2-6-02','sit2-6-03',
]);

const allQuestions = [
  ...v08Questions,...v09Questions,...qualityQuestions,...v11Questions,
  ...replacementLf5to12Questions,...expansionV12Questions,...qualityReplacementQuestions,
  ...qualityLf9to12Questions,...v10Batch1Questions,...v10CalculationQuestions,
  ...v10SituationQuestions1,...v10SituationQuestions2,...balanceV13Questions,...balanceV14Questions,
  ...orderV15Questions,...lf1V101Questions,...curriculumGapQuestions,
];

const seenQuestionTexts = new Set();
export const v07Questions = allQuestions.filter((question) => {
  if (NEAR_DUPLICATE_IDS.has(question.id) || MISPLACED_IDS.has(question.id)) return false;
  const normalizedText = String(question.question ?? '').toLowerCase().replace(/\s+/g, ' ').trim();
  if (!normalizedText) return true;
  if (seenQuestionTexts.has(normalizedText)) return false;
  seenQuestionTexts.add(normalizedText);
  return true;
});
