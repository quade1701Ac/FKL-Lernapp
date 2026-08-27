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

export const v07Questions = [...v08Questions, ...v09Questions, ...qualityQuestions, ...v11Questions, ...replacementLf5to12Questions, ...expansionV12Questions, ...qualityReplacementQuestions, ...qualityLf9to12Questions, ...v10Batch1Questions, ...v10CalculationQuestions];
