import { FactCategory } from '../types';
import { attachmentAttraction, communicationConflict } from './collections/attachment-attraction';
import { intimacySexuality } from './collections/intimacy-sexuality';
import { relationshipMaintenance } from './collections/relationship-maintenance';

export const relationshipsCollections = [
  attachmentAttraction,
  communicationConflict,
  intimacySexuality,
  relationshipMaintenance,
];

export const relationshipsCategory: FactCategory = {
  id: 'relationships',
  title: 'Relationships, Love & Sex',
  icon: 'link',
  description: 'Attachment, attraction, intimacy and the science of staying close.',
};
