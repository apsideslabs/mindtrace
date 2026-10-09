import { FactCollection } from '../../types';

export const emotion: FactCollection = {
  id: 'emotion',
  categoryId: 'psychology',
  title: 'Emotion',
  description: 'Stress, fear, happiness and regulation.',
  icon: 'heart-pulse',
  colorClass: 'text-amber-500',
  facts: [
    {
      id: 'emotion-1',
      collectionId: 'emotion',
      number: 1,
      title: 'Labeling an emotion decreases its intensity.',
      readingTimeMinutes: 3,
      evidenceLevel: 4,
      summary: 'Putting feelings into words ("affect labeling") diminishes the response of the amygdala and other limbic regions to negative emotional images.',
      whyItHappens: 'When you articulate an emotion, you engage the right ventrolateral prefrontal cortex, which exerts inhibitory control over the amygdala, effectively dampening the alarm bell of the brain.',
      realWorldExample: 'Saying "I am feeling extremely anxious about this presentation right now" will immediately make the anxiety physically feel slightly less intense.',
      practicalUse: 'When overwhelmed, consciously name the specific emotion you are feeling (e.g., "I feel betrayed" instead of "I feel bad") to bring the rational brain back online.',
      relatedConcepts: ['Affect labeling', 'Amygdala hijacking', 'Emotion regulation'],
      references: [
        { title: 'Putting Feelings Into Words: Affect Labeling Disrupts Amygdala Activity to Affective Stimuli', source: 'Psychological Science', year: 2007 }
      ],
      dateAdded: '2023-11-12'
    }
  ]
};
