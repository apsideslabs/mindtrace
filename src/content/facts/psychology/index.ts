import { brainCognition } from './collections/brain-cognition';
import { emotion } from './collections/emotion';
import { memory } from './collections/memory';
import { decisionMaking } from './collections/decision-making';
import { cognitiveBiases } from './collections/cognitive-biases';
import { FactCategory } from '../types';

export const psychologyCollections = [
  brainCognition,
  emotion,
  memory,
  decisionMaking,
  cognitiveBiases
];

export const psychologyCategory: FactCategory = {
  id: 'psychology',
  title: 'Psychology Facts',
  icon: 'brain',
  description: 'Research-backed findings about how the human mind works. Every fact is organized into collections based on cognitive science, neuroscience, behavioral psychology, and experimental research.',
};
