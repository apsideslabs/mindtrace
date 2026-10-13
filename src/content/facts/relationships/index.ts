import { attachmentAttraction, communicationConflict } from './collections/attachment-attraction';
import { intimacySexuality } from './collections/intimacy-sexuality';
import { relationshipMaintenance } from './collections/relationship-maintenance';
import { friendship } from './collections/friendship';
import { familyParenting } from './collections/family-parenting';
import { lonelinessConnection } from './collections/loneliness-connection';
import { FactCategory } from '../types';

export const relationshipsCollections = [
  attachmentAttraction,
  communicationConflict,
  intimacySexuality,
  relationshipMaintenance,
  friendship,
  familyParenting,
  lonelinessConnection,
];

export const relationshipsCategory: FactCategory = {
  id: 'relationships',
  title: 'Relationships, Love & Sex',
  icon: 'link',
  description: 'Attachment, attraction, intimacy and the science of staying close.',
};
