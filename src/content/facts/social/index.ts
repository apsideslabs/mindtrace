import { socialInfluence } from './collections/social-influence';
import { groupsConformity } from './collections/groups-conformity';
import { persuasionCompliance } from './collections/persuasion-compliance';
import { identityPrejudice } from './collections/identity-prejudice';
import { culturePsychology } from './collections/culture-psychology';
import { leadershipFollowership } from './collections/leadership-followership';
import { moralityEthics } from './collections/morality-ethics';
import { cooperationConflict } from './collections/cooperation-conflict';
import { statusHierarchy } from './collections/status-hierarchy';
import { FactCategory } from '../types';

export const socialCollections = [
  socialInfluence,
  groupsConformity,
  persuasionCompliance,
  identityPrejudice,
  culturePsychology,
  leadershipFollowership,
  moralityEthics,
  cooperationConflict,
  statusHierarchy,
];

export const socialCategory: FactCategory = {
  id: 'social',
  title: 'Social & Human Behaviour',
  icon: 'network',
  description: 'Communication, groups, trust and social psychology.',
};
