import { brainCognition } from './collections/brain-cognition';
import { cognitiveBiases } from './collections/cognitive-biases';
import { decisionMaking } from './collections/decision-making';
import { emotion } from './collections/emotion';
import { memory } from './collections/memory';
import { attentionPerception } from './collections/attention-perception';
import { learningMotivation } from './collections/learning-motivation';
import { personalityDifferences } from './collections/personality-differences';
import { FactCategory } from '../types';

export const psychologyCollections = [
  brainCognition,
  cognitiveBiases,
  decisionMaking,
  emotion,
  memory,
  attentionPerception,
  learningMotivation,
  personalityDifferences,
];

export const psychologyCategory: FactCategory = {
  id: 'psychology',
  title: 'Psychology Facts',
  icon: 'brain',
  description:
    'Research-backed findings about how the human mind works. Every fact is organized into collections based on cognitive science, neuroscience, behavioral psychology, and experimental research.',
};
