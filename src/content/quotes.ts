import { Quote } from '../types';

export interface QuoteCategory {
  id: string;
  title: string;
  description: string;
}

export const quoteCategories: QuoteCategory[] = [
  { id: 'psychology', title: 'Psychology', description: 'The mind, behaviour and the mechanics of self.' },
  { id: 'philosophy', title: 'Philosophy', description: 'Timeless wisdom and ways of thinking.' },
  { id: 'human-nature', title: 'Human Nature', description: 'Truths about people, power and society.' },
  { id: 'leadership', title: 'Leadership', description: 'Influence, responsibility and leading others.' },
  { id: 'success', title: 'Success & Work', description: 'Craft, achievement and doing great work.' },
  { id: 'motivation', title: 'Motivation & Discipline', description: 'Action, consistency and resilience.' },
];

export const QUOTES: Quote[] = [
  // Psychology
  { id: 'q1', text: 'Until you make the unconscious conscious, it will direct your life and you will call it fate.', author: 'Carl Jung', category: 'psychology' },
  { id: 'q2', text: 'Everything that irritates us about others can lead us to an understanding of ourselves.', author: 'Carl Jung', category: 'psychology' },
  { id: 'q3', text: 'The meeting of two personalities is like the contact of two chemical substances: if there is any reaction, both are transformed.', author: 'Carl Jung', category: 'psychology' },
  { id: 'q4', text: 'The curious paradox is that when I accept myself just as I am, then I can change.', author: 'Carl Rogers', category: 'psychology' },
  { id: 'q5', text: 'Nothing in life is as important as you think it is, while you are thinking about it.', author: 'Daniel Kahneman', category: 'psychology' },
  { id: 'q6', text: 'The greatest weapon against stress is our ability to choose one thought over another.', author: 'William James', category: 'psychology' },
  { id: 'q7', text: 'When we are no longer able to change a situation, we are challenged to change ourselves.', author: 'Viktor Frankl', category: 'psychology' },
  { id: 'q8', text: 'The greatest discovery of my generation is that a human being can alter his life by altering his attitudes.', author: 'William James', category: 'psychology' },

  // Philosophy
  { id: 'q9', text: 'The unexamined life is not worth living.', author: 'Socrates', category: 'philosophy' },
  { id: 'q10', text: 'Knowing yourself is the beginning of all wisdom.', author: 'Aristotle', category: 'philosophy' },
  { id: 'q11', text: 'We suffer more often in imagination than in reality.', author: 'Seneca', category: 'philosophy' },
  { id: 'q12', text: 'You have power over your mind — not outside events. Realise this, and you will find strength.', author: 'Marcus Aurelius', category: 'philosophy' },
  { id: 'q13', text: 'It is not what happens to you, but how you react to it that matters.', author: 'Epictetus', category: 'philosophy' },
  { id: 'q14', text: 'He who has a why to live can bear almost any how.', author: 'Friedrich Nietzsche', category: 'philosophy' },
  { id: 'q15', text: 'That which does not kill us makes us stronger.', author: 'Friedrich Nietzsche', category: 'philosophy' },
  { id: 'q16', text: 'Man is condemned to be free.', author: 'Jean-Paul Sartre', category: 'philosophy' },
  { id: 'q17', text: 'Those who cannot remember the past are condemned to repeat it.', author: 'George Santayana', category: 'philosophy' },

  // Human nature
  { id: 'q18', text: 'Power tends to corrupt, and absolute power corrupts absolutely.', author: 'Lord Acton', category: 'human-nature' },
  { id: 'q19', text: 'Nearly all men can stand adversity, but if you want to test a man’s character, give him power.', author: 'Abraham Lincoln', category: 'human-nature' },
  { id: 'q20', text: 'When dealing with people, remember you are not dealing with creatures of logic, but with creatures of emotion.', author: 'Dale Carnegie', category: 'human-nature' },
  { id: 'q21', text: 'The whole problem with the world is that fools and fanatics are always so certain of themselves, and wiser people so full of doubts.', author: 'Bertrand Russell', category: 'human-nature' },
  { id: 'q22', text: 'Knowing others is intelligence; knowing yourself is true wisdom. Mastering others is strength; mastering yourself is true power.', author: 'Laozi', category: 'human-nature' },
  { id: 'q23', text: 'No one can make you feel inferior without your consent.', author: 'Eleanor Roosevelt', category: 'human-nature' },

  // Leadership
  { id: 'q24', text: 'Know yourself and know your enemy, and you need not fear the result of a hundred battles.', author: 'Sun Tzu', category: 'leadership' },
  { id: 'q25', text: 'The best executive is the one who has sense enough to pick good people to do what he wants done, and self-restraint enough to keep from meddling with them while they do it.', author: 'Theodore Roosevelt', category: 'leadership' },
  { id: 'q26', text: 'A leader is best when people barely know he exists; when his work is done, his aim fulfilled, they will say: we did it ourselves.', author: 'Laozi', category: 'leadership' },

  // Success & work
  { id: 'q27', text: 'We are what we repeatedly do. Excellence, then, is not an act, but a habit.', author: 'Will Durant', category: 'success' },
  { id: 'q28', text: 'The only way to do great work is to love what you do.', author: 'Steve Jobs', category: 'success' },
  { id: 'q29', text: 'Act as if what you do makes a difference. It does.', author: 'William James', category: 'success' },

  // Motivation
  { id: 'q30', text: 'Stay hungry, stay foolish.', author: 'Steve Jobs', category: 'motivation' },
  { id: 'q31', text: 'It always seems impossible until it’s done.', author: 'Nelson Mandela', category: 'motivation' },
  { id: 'q32', text: 'Do not judge me by my successes, judge me by how many times I fell down and got back up again.', author: 'Nelson Mandela', category: 'motivation' },
];

export const getQuotesByCategory = (categoryId: string): Quote[] =>
  QUOTES.filter((q) => q.category === categoryId);
