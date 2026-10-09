import { FactCategory } from '../types';
import { attachmentAttraction, communicationConflict } from './collections/attachment-attraction';

export const relationshipsCollections = [attachmentAttraction, communicationConflict];

export const relationshipsCategory: FactCategory = {
  id: 'relationships',
  title: 'Relationships, Love & Sex',
  icon: 'link',
  description: 'Attachment, attraction, intimacy and the science of staying close.',
};
