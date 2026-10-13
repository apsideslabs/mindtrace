import { brainCognition } from './collections/brain-cognition';
import { cognitiveBiases } from './collections/cognitive-biases';
import { decisionMaking } from './collections/decision-making';
import { emotion } from './collections/emotion';
import { memory } from './collections/memory';
import { attentionPerception } from './collections/attention-perception';
import { learningMotivation } from './collections/learning-motivation';
import { personalityDifferences } from './collections/personality-differences';
import { sleepCircadian } from './collections/sleep-circadian';
import { stressCoping } from './collections/stress-coping';
import { languageThought } from './collections/language-thought';
import { creativityInsight } from './collections/creativity-insight';
import { developmentAgeing } from './collections/development-ageing';
import { selfRegulation } from './collections/self-regulation';
import { mentalHealth } from './collections/mental-health';
import { intelligenceAbility } from './collections/intelligence-ability';
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
  sleepCircadian,
  stressCoping,
  languageThought,
  creativityInsight,
  developmentAgeing,
  selfRegulation,
  mentalHealth,
  intelligenceAbility,
];

export const psychologyCategory: FactCategory = {
  id: 'psychology',
  title: 'Psychology Facts',
  icon: 'brain',
  description: 'Research-backed findings about how the human mind works. Every fact is organized into collections based on cognitive science, neuroscience, behavioral psychology, and experimental research.',
};
