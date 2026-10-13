import { deceptionManipulation } from './collections/deception-manipulation';
import { darkPersonality } from './collections/dark-personality';
import { criminalBehaviour } from './collections/criminal-behaviour';
import { forensicInterviewing } from './collections/forensic-interviewing';
import { aggressionViolence } from './collections/aggression-violence';
import { fraudScams } from './collections/fraud-scams';
import { addictionSubstance } from './collections/addiction-substance';
import { cultCoercion } from './collections/cult-coercion';
import { FactCategory } from '../types';

export const crimeCollections = [
  deceptionManipulation,
  darkPersonality,
  criminalBehaviour,
  forensicInterviewing,
  aggressionViolence,
  fraudScams,
  addictionSubstance,
  cultCoercion,
];

export const crimeCategory: FactCategory = {
  id: 'crime',
  title: 'Crime & Dark Psychology',
  icon: 'fingerprint',
  description: 'Manipulation, deception, criminology and behavioural risk.',
};
