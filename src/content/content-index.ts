/// <reference types="vite/client" />
import { Category, Topic } from '../types';
import { allCollections } from './facts';

export const CATEGORIES: Category[] = [
  { id: 'manipulation', title: 'Manipulation', description: 'Recognise psychological manipulation techniques and the warning signs behind them.', iconName: 'ShieldAlert' },
  { id: 'relationships', title: 'Relationships', description: 'Attachment, communication, boundaries and what makes connection healthy or harmful.', iconName: 'Heart' },
  { id: 'body-language', title: 'Body Language', description: 'Non-verbal cues, micro-expressions, posture and how to read the room.', iconName: 'Eye' },
  { id: 'persuasion', title: 'Persuasion', description: 'The ethical art of influence and the psychological triggers behind it.', iconName: 'MessageSquare' },
  { id: 'negotiation', title: 'Negotiation', description: 'Strategy, leverage and the mechanics of reaching mutual agreement.', iconName: 'Handshake' },
  { id: 'human-behavior', title: 'Human Behaviour', description: 'The fundamentals of why people act the way they do.', iconName: 'Users' },
  { id: 'cognitive-biases', title: 'Cognitive Biases', description: 'Systematic errors in human thinking and rationality.', iconName: 'BrainCircuit' },
  { id: 'decision-making', title: 'Decision Making', description: 'How people choose, weigh risk and quietly bypass logic.', iconName: 'GitMerge' },
  { id: 'social-psychology', title: 'Social Psychology', description: 'Groups, conformity and the pull of the social environment.', iconName: 'UsersRound' },
  { id: 'personality', title: 'Personality', description: 'The Big Five, the dark triad and the architecture of character.', iconName: 'User' },
  { id: 'deception-detection', title: 'Deception & Truth', description: 'Identifying lies, hidden agendas and strategic omissions.', iconName: 'EyeOff' },
  { id: 'power-dynamics', title: 'Power & Status', description: 'Hierarchies, dominance and the unspoken rules of social climbing.', iconName: 'Crown' },
  { id: 'behavioral-economics', title: 'Behavioural Economics', description: 'The hidden psychology behind money, value and spending.', iconName: 'Wallet' },
  { id: 'criminology', title: 'Criminology & Dark Behaviour', description: 'Deviant psychology, predatory patterns and severe transgressions.', iconName: 'Ghost' },
];

/** A muted, ink-friendly hue per module, used for accents and tags. */
export const CATEGORY_ACCENT: Record<string, string> = {
  manipulation: '#b23a2a',
  relationships: '#a2486b',
  'body-language': '#2f6e7a',
  persuasion: '#3a5ba0',
  negotiation: '#6a5a9e',
  'human-behavior': '#b07a2a',
  'cognitive-biases': '#4a5b6e',
  'decision-making': '#2e7d6b',
  'social-psychology': '#557a3e',
  personality: '#b5642a',
  'deception-detection': '#8c3b3b',
  'power-dynamics': '#8a6d2f',
  'behavioral-economics': '#4e7a3a',
  criminology: '#4a4048',
};

const topicFiles = import.meta.glob('./**/*.json', { eager: true, import: 'default' }) as Record<string, Topic>;

const topicsCache: Record<string, Topic> = {};
Object.values(topicFiles).forEach((t) => {
  if (t && t.id) topicsCache[t.id] = t;
});

export const getAllCategories = (): Category[] => CATEGORIES;

export const getCategoryById = (id: string): Category | undefined => CATEGORIES.find((c) => c.id === id);

export const getAllTopics = (): Topic[] => Object.values(topicsCache);

export const getTopicsByCategory = (categoryId: string): Topic[] =>
  getAllTopics()
    .filter((t) => t.category === categoryId)
    .sort((a, b) => a.title.localeCompare(b.title));

export const getTopicById = (id: string): Topic | undefined => topicsCache[id];

export const getTopicBySlug = (slug: string): Topic | undefined => getAllTopics().find((t) => t.slug === slug);

export const getRelatedTopics = (topic: Topic): Topic[] =>
  (topic.relatedTopics ?? []).map((id) => getTopicById(id)).filter(Boolean) as Topic[];

export const getTopicCount = (): number => getAllTopics().length;

export function searchTopics(query: string): Topic[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return getAllTopics()
    .map((t) => {
      const hay = `${t.title} ${t.description} ${(t.tags ?? []).join(' ')}`.toLowerCase();
      const idx = hay.indexOf(q);
      return { t, score: idx === -1 ? Infinity : idx };
    })
    .filter((r) => r.score !== Infinity)
    .sort((a, b) => a.score - b.score)
    .map((r) => r.t);
}

export interface FactHit {
  id: string;
  title: string;
  summary: string;
  collectionId: string;
}

export function searchFacts(query: string): FactHit[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const hits: FactHit[] = [];
  for (const c of allCollections) {
    for (const f of c.facts) {
      if (`${f.title} ${f.summary}`.toLowerCase().includes(q)) {
        hits.push({ id: f.id, title: f.title, summary: f.summary, collectionId: c.id });
      }
    }
  }
  return hits;
}
