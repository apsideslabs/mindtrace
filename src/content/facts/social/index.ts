import { FactCategory } from '../types';
import { socialInfluence } from './collections/social-influence';
import { groupsConformity } from './collections/groups-conformity';
import { persuasionCompliance } from './collections/persuasion-compliance';
import { identityPrejudice } from './collections/identity-prejudice';

export const socialCollections = [
  socialInfluence,
  groupsConformity,
  persuasionCompliance,
  identityPrejudice,
];

export const socialCategory: FactCategory = {
  id: 'social',
  title: 'Social & Human Behaviour',
  icon: 'network',
  description: 'Communication, groups, trust and social psychology.',
};
