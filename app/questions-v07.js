// Zentraler Fragen-Aggregator für LF 5–12 plus Qualitätsrunde für alle Lernfelder.
// Bestehende IDs bleiben stabil; qualityQuestions ergänzt bewusst Transfer- und Praxisaufgaben.
import { v08Questions } from './questions-v08';
import { v09Questions } from './questions-v09';
import { qualityQuestions } from './questions-quality';

export const v07Questions = [...v08Questions, ...v09Questions, ...qualityQuestions];
