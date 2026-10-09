import { FactCategory } from '../types';
import { socialInfluence } from './collections/social-influence';

export const socialCollections = [socialInfluence];

export const socialCategory: FactCategory = {
  id: 'social',
  title: 'Social & Human Behaviour',
  icon: 'network',
  description: 'Communication, groups, trust and social psychology.',
};
