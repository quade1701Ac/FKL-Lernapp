// Zentraler Fragen-Aggregator.
// LF 1–4: v05 + quality + v11 ergeben einen kuratierten 25er-Kern ohne den stark redundanten v04-Block.
// LF 5–12: v08/v09 plus Qualitätsfragen.
import { v08Questions } from './questions-v08';
import { v09Questions } from './questions-v09';
import { qualityQuestions } from './questions-quality';
import { v11Questions } from './questions-v11';

export const v07Questions = [...v08Questions, ...v09Questions, ...qualityQuestions, ...v11Questions];
