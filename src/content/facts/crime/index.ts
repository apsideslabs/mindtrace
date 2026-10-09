import { FactCategory } from '../types';
import { deceptionManipulation } from './collections/deception-manipulation';

export const crimeCollections = [deceptionManipulation];

export const crimeCategory: FactCategory = {
  id: 'crime',
  title: 'Crime & Dark Psychology',
  icon: 'fingerprint',
  description: 'Manipulation, deception, criminology and behavioural risk.',
};
