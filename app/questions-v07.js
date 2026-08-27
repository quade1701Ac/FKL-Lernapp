// Zentraler Fragen-Aggregator.
// LF 1–4: v05 + quality + v11 ergeben einen kuratierten Kern ohne den stark redundanten v04-Block.
// LF 5–12: bestehender Grundstock plus neue praxis- und transferorientierte Qualitätsfragen.
import { v08Questions } from './questions-v08';
import { v09Questions } from './questions-v09';
import { qualityQuestions } from './questions-quality';
import { v11Questions } from './questions-v11';
import { replacementLf5to12Questions } from './questions-replacement-lf5-12';

export const v07Questions = [...v08Questions, ...v09Questions, ...qualityQuestions, ...v11Questions, ...replacementLf5to12Questions];
