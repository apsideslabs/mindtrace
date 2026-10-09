import { FactCollection } from '../../types';

export const brainCognition: FactCollection = {
  id: 'brain-cognition',
  categoryId: 'psychology',
  title: 'Brain & Cognition',
  description: 'Learning, memory, attention and thinking.',
  icon: 'brain',
  colorClass: 'text-blue-500',
  facts: [
    {
      id: 'brain-1',
      collectionId: 'brain-cognition',
      number: 1,
      title: 'Your brain physically rewires itself every time you learn a new skill.',
      readingTimeMinutes: 3,
      evidenceLevel: 5,
      summary: 'Neuroplasticity allows the brain to form and reorganize synaptic connections, especially in response to learning or experience or following injury.',
      whyItHappens: 'When you learn, repetitive firing of neurons across new circuits strengthens their connections—a principle summarized as "neurons that fire together, wire together." Astrocytes and oligodendrocytes help myelinate and stabilize these new pathways.',
      realWorldExample: 'London taxi drivers are required to memorize the complex layout of the city ("The Knowledge"). MRI scans show they have a significantly larger posterior hippocampus (which stores spatial representation) compared to average people.',
      practicalUse: 'Spaced repetition and consistent practice of a difficult skill will physically build denser neural pathways, making the skill feel effortless over time.',
      relatedConcepts: ['Neuroplasticity', 'Long-term potentiation', 'Myelination'],
      references: [
        { title: 'Navigation-related structural change in the hippocampi of taxi drivers', source: 'Proceedings of the National Academy of Sciences (PNAS)', year: 2000 }
      ],
      dateAdded: '2023-11-01'
    },
    {
      id: 'brain-2',
      collectionId: 'brain-cognition',
      number: 2,
      title: 'Multitasking is a myth.',
      readingTimeMinutes: 2,
      evidenceLevel: 5,
      summary: 'The human brain cannot process two cognitively demanding tasks simultaneously. What we perceive as multitasking is actually rapid "task-switching," which depletes energy and reduces overall efficiency.',
      whyItHappens: 'The prefrontal cortex, which controls attention and rules for tasks, acts as a bottleneck. It must disengage from one rule set and load another every time you switch focuses, causing a "switching cost" in time and accuracy.',
      realWorldExample: 'Attempting to write an email while listening to someone speak results in missing words from both, often typing what you hear instead of what you intended to write.',
      practicalUse: 'Batch similar tasks together and use the Pomodoro technique (focused intervals) to minimize task-switching friction and maintain cognitive energy.',
      relatedConcepts: ['Task-switching cost', 'Attention residue', 'Cognitive load'],
      references: [
        { title: 'Executive Control of Cognitive Processes in Task Switching', source: 'Journal of Experimental Psychology', year: 2001 }
      ],
      dateAdded: '2023-11-05'
    },
    {
      id: 'brain-3',
      collectionId: 'brain-cognition',
      number: 3,
      title: 'Sleep cleans your brain.',
      readingTimeMinutes: 4,
      evidenceLevel: 5,
      summary: 'During deep sleep, the brain\'s glymphatic system opens up to flush out toxic byproducts accumulated during waking hours, including beta-amyloid proteins.',
      whyItHappens: 'Glial cells in the brain shrink during sleep, increasing the interstitial space between neurons by up to 60%. This allows cerebrospinal fluid to wash through and clear out metabolic waste.',
      realWorldExample: 'After pulling an all-nighter, the "brain fog" you feel is literally the accumulation of uncleared metabolic waste interfering with synaptic firing.',
      practicalUse: 'Prioritize 7-9 hours of continuous sleep to prevent long-term cognitive decline and optimize daily focus.',
      relatedConcepts: ['Glymphatic system', 'Beta-amyloid', 'Slow-wave sleep'],
      references: [
        { title: 'Sleep Drives Metabolite Clearance from the Adult Brain', source: 'Science', year: 2013 }
      ],
      dateAdded: '2023-11-10'
    }
  ]
};
