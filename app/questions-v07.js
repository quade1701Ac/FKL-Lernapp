// v0.8 question-bank aggregator.
// page.js already imports v07Questions, so keeping this export name avoids touching the UI code.
import { v08Questions } from './questions-v08';
import { v09Questions } from './questions-v09';

export const v07Questions = [...v08Questions, ...v09Questions];
