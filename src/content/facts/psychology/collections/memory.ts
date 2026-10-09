import { FactCollection } from '../../types';

export const memory: FactCollection = {
  id: 'memory',
  categoryId: 'psychology',
  title: 'Memory',
  description: 'Encoding, recall and forgetting.',
  icon: 'database',
  colorClass: 'text-purple-500',
  facts: [
    {
      id: 'memory-1',
      collectionId: 'memory',
      number: 1,
      title: 'Memories change every time you recall them.',
      readingTimeMinutes: 3,
      evidenceLevel: 5,
      summary: 'Memory is not a static recording. The act of remembering makes the memory malleable and subject to being altered or completely rewritten before it is stored again.',
      whyItHappens: 'Memory reconsolidation requires proteins to rebuild the memory trace. During the "open window" of recall, new information, current emotional states, or leading questions can physically weave into the memory structure.',
      realWorldExample: 'Witnesses to a car crash will estimate the car was going faster if asked "how fast were they going when they Smashed into each other?" instead of "Hit each other?". Over time, they will truly remember broken glass that wasn\'t there.',
      practicalUse: 'Be aware that your memory of highly emotional arguments is likely slightly distorted by how you felt during every subsequent time you thought about it.',
      relatedConcepts: ['Reconsolidation', 'Misinformation effect', 'False memories'],
      references: [
        { title: 'Reconstruction of Automobile Destruction: An Example of the Interaction Between Language and Memory', source: 'Journal of Verbal Learning and Verbal Behavior', year: 1974 }
      ],
      dateAdded: '2023-11-15'
    }
  ]
};
