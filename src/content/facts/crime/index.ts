import { FactCategory } from '../types';
import { deceptionManipulation } from './collections/deception-manipulation';
import { darkPersonality } from './collections/dark-personality';
import { criminalBehaviour } from './collections/criminal-behaviour';
import { forensicInterviewing } from './collections/forensic-interviewing';

export const crimeCollections = [
  deceptionManipulation,
  darkPersonality,
  criminalBehaviour,
  forensicInterviewing,
];

export const crimeCategory: FactCategory = {
  id: 'crime',
  title: 'Crime & Dark Psychology',
  icon: 'fingerprint',
  description: 'Manipulation, deception, criminology and behavioural risk.',
};
